const superagent = require("superagent");

async function getTokenWinPay(privateKey1, privateKey2) {
  const response = await superagent
    .post(`${process.env.BASE_URL_WINPAY}/token`)
    .auth(privateKey1, privateKey2);

  const json = JSON.parse(response.text);

  return json.data.token;
}

module.exports = { getTokenWinPay }