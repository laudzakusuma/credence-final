#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, BytesN, Env};

#[contracttype]
#[derive(Clone)]
pub struct CreditPassport {
    pub merchant_hash: BytesN<32>,
    pub data_commitment: BytesN<32>,
    pub criteria_commitment: BytesN<32>,
    pub verified: bool,
    pub payout_reference: BytesN<32>,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Passport(BytesN<32>),
}

#[contract]
pub struct CredenceRegistry;

#[contractimpl]
impl CredenceRegistry {
    pub fn record_passport(
        env: Env,
        proof_id: BytesN<32>,
        merchant_hash: BytesN<32>,
        data_commitment: BytesN<32>,
        criteria_commitment: BytesN<32>,
        verified: bool,
        payout_reference: BytesN<32>,
    ) -> bool {
        let passport = CreditPassport {
            merchant_hash,
            data_commitment,
            criteria_commitment,
            verified,
            payout_reference,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Passport(proof_id), &passport);

        true
    }

    pub fn get_passport(env: Env, proof_id: BytesN<32>) -> CreditPassport {
        env.storage()
            .persistent()
            .get(&DataKey::Passport(proof_id))
            .unwrap()
    }

    pub fn update_verification(
        env: Env,
        proof_id: BytesN<32>,
        verified: bool,
        payout_reference: BytesN<32>,
    ) -> bool {
        let key = DataKey::Passport(proof_id);
        let mut passport: CreditPassport = env.storage().persistent().get(&key).unwrap();

        passport.verified = verified;
        passport.payout_reference = payout_reference;

        env.storage().persistent().set(&key, &passport);

        true
    }
}