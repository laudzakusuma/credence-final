export type SaleRecord = {
  date: string;
  source: string;
  orderId: string;
  amount: number;
  currency: "IDR";
  customerHash: string;
};

export type CreditCriteria = {
  minRevenue: number;
  minGrowth: number;
  periodDays: number;
  currency: "IDR";
};

export type CreditPassport = {
  proofId: string;
  merchantHash: string;
  commitment: string;
  network: "Midnight";
  payoutRail: "Stellar USDC";
  criteria: CreditCriteria;
  result: {
    verified: boolean;
    revenueThresholdMet: boolean;
    growthThresholdMet: boolean;
    rawRevenueHidden: true;
    rawTransactionsHidden: true;
    customerDataHidden: true;
  };
  issuedAt: string;
};

export const sampleSales: SaleRecord[] = [
  {
    date: "2026-01-04",
    source: "Tokopedia",
    orderId: "TKP-1001",
    amount: 1250000,
    currency: "IDR",
    customerHash: "cus_a91",
  },
  {
    date: "2026-01-12",
    source: "Tokopedia",
    orderId: "TKP-1002",
    amount: 2100000,
    currency: "IDR",
    customerHash: "cus_b82",
  },
  {
    date: "2026-01-24",
    source: "Shopee",
    orderId: "SHP-2001",
    amount: 1750000,
    currency: "IDR",
    customerHash: "cus_c73",
  },
  {
    date: "2026-02-03",
    source: "Lazada",
    orderId: "LZD-3001",
    amount: 2600000,
    currency: "IDR",
    customerHash: "cus_d64",
  },
  {
    date: "2026-02-14",
    source: "Tokopedia",
    orderId: "TKP-1003",
    amount: 3100000,
    currency: "IDR",
    customerHash: "cus_e55",
  },
  {
    date: "2026-02-26",
    source: "Shopee",
    orderId: "SHP-2002",
    amount: 2850000,
    currency: "IDR",
    customerHash: "cus_f46",
  },
  {
    date: "2026-03-08",
    source: "Tokopedia",
    orderId: "TKP-1004",
    amount: 3350000,
    currency: "IDR",
    customerHash: "cus_g37",
  },
  {
    date: "2026-03-19",
    source: "Lazada",
    orderId: "LZD-3002",
    amount: 4200000,
    currency: "IDR",
    customerHash: "cus_h28",
  },
  {
    date: "2026-03-27",
    source: "Shopee",
    orderId: "SHP-2003",
    amount: 3900000,
    currency: "IDR",
    customerHash: "cus_i19",
  },
  {
    date: "2026-04-07",
    source: "Tokopedia",
    orderId: "TKP-1005",
    amount: 4800000,
    currency: "IDR",
    customerHash: "cus_j10",
  },
  {
    date: "2026-04-18",
    source: "Shopee",
    orderId: "SHP-2004",
    amount: 5100000,
    currency: "IDR",
    customerHash: "cus_k11",
  },
  {
    date: "2026-04-28",
    source: "Lazada",
    orderId: "LZD-3003",
    amount: 5600000,
    currency: "IDR",
    customerHash: "cus_l12",
  },
];

export function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactIDR(value: number) {
  if (value >= 1_000_000_000) return `Rp${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `Rp${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `Rp${(value / 1_000).toFixed(1)}K`;
  return `Rp${value}`;
}

export function calculateTotalRevenue(records: SaleRecord[]) {
  return records.reduce((total, record) => total + record.amount, 0);
}

export function calculateGrowth(records: SaleRecord[]) {
  const sorted = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const middle = Math.floor(sorted.length / 2);
  const firstPeriod = sorted.slice(0, middle);
  const secondPeriod = sorted.slice(middle);

  const firstRevenue = calculateTotalRevenue(firstPeriod);
  const secondRevenue = calculateTotalRevenue(secondPeriod);

  if (firstRevenue === 0) return 0;

  return ((secondRevenue - firstRevenue) / firstRevenue) * 100;
}

export function buildMonthlyChart(records: SaleRecord[]) {
  const grouped = records.reduce<Record<string, number>>((acc, record) => {
    const month = new Date(record.date).toLocaleString("en-US", {
      month: "short",
    });

    acc[month] = (acc[month] || 0) + record.amount;
    return acc;
  }, {});

  return Object.entries(grouped).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

export function simpleHash(input: string) {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return Math.abs(hash).toString(16).padStart(16, "0");
}

export function createCreditPassport(
  records: SaleRecord[],
  criteria: CreditCriteria
): CreditPassport {
  const totalRevenue = calculateTotalRevenue(records);
  const growth = calculateGrowth(records);

  const revenueThresholdMet = totalRevenue >= criteria.minRevenue;
  const growthThresholdMet = growth >= criteria.minGrowth;

  const privateCommitment = simpleHash(
    JSON.stringify({
      merchant: "Nusantara Craft Co.",
      records,
      totalRevenue,
      growth,
      criteria,
      secretSalt: "credence-midnight-private-commitment",
    })
  );

  return {
    proofId: `credence-proof-${Date.now()}`,
    merchantHash: simpleHash("Nusantara Craft Co. APAC MSME"),
    commitment: `0x${privateCommitment}`,
    network: "Midnight",
    payoutRail: "Stellar USDC",
    criteria,
    result: {
      verified: revenueThresholdMet && growthThresholdMet,
      revenueThresholdMet,
      growthThresholdMet,
      rawRevenueHidden: true,
      rawTransactionsHidden: true,
      customerDataHidden: true,
    },
    issuedAt: new Date().toISOString(),
  };
}

export function simulateStellarPayout(destination: string, amount: number) {
  return {
    destination,
    amount,
    asset: "USDC",
    network: "Stellar Testnet",
    txHash: `stellar_testnet_${simpleHash(destination + amount + Date.now())}`,
    status: "success",
    createdAt: new Date().toISOString(),
  };
}