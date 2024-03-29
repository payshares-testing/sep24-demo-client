const Config = require("../config");
module.exports = {
  instruction:
    "We need to send the signed SEP10 challenge back to the server to get a JWT token to authenticate our stellar account with future actions",
  action: "Send signed response back to server",
  execute: async function(state, { log, expect }) {
    const AUTH_URL = Config.get("AUTH_SERVER_URL");
    const transaction = state.signed_challenge_tx;
    const params = {
      transaction: transaction.toEnvelope().toXDR("base64")
    };
    log("POST /auth request with params:");
    log(params);
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });
    const json = await response.json();
    log("POST /auth response");
    log(json);
    expect(json.token, "No token returned from /auth");
    state.token = json.token;
  }
};
