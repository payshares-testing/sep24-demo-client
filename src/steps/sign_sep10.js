const Config = require("../config");
const StellarSdk = require("stellar-sdk");

module.exports = {
  instruction:
    "We've received a challenge transaction from the server that we need the client to sign with our Stellar account.",
  action: "Sign Challenge (SEP-0010)",
  execute: async function(state, { log, instruction }) {
    const USER_SK = Config.get("USER_SK");
    const challenge_xdr = state.challenge_transaction;
    const envelope = StellarSdk.xdr.TransactionEnvelope.fromXDR(
      challenge_xdr,
      "base64"
    );
    const transaction = new StellarSdk.Transaction(envelope);
    transaction.sign(StellarSdk.Keypair.fromSecret(USER_SK));
    log("SEP-0010 Signed Transaction");
    log(transaction);
    log("Base64 Encoded");
    log(transaction.toEnvelope().toXDR("base64"));
    state.signed_challenge_tx = transaction;
  }
};
