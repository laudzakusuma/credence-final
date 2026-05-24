import crypto from "crypto";

export function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function commitmentHash(payload: unknown) {
  return `0x${sha256Hex(JSON.stringify(payload))}`;
}

export function randomId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

export function nowIso() {
  return new Date().toISOString();
}