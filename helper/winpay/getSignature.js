// const crypto = require("crypto")
// const shasum = crypto.createHash("sha1");

// function spi_signature(mk, spiToken, transactionId, amount) {
//   let merchant_key = mk;
//   let spi_token = spiToken;
//   let spi_merchant_transaction_reff = transactionId;
//   let spi_amount = amount;

//   shasum.update(
//     spi_token +
//     "|" +
//     merchant_key +
//     "|" +
//     spi_merchant_transaction_reff +
//     "|" +
//     spi_amount +
//     "|0|0"
//   );
//   return spi_signature = shasum.digest("hex").toUpperCase();
// }

const CryptoJS = require('crypto-js')

function spi_signature(mk, spiToken, transactionId, amount) {
  let merchant_key = mk;
  let spi_token = spiToken;
  let spi_merchant_transaction_reff = transactionId;
  let spi_amount = amount;

  var hash = CryptoJS.SHA1(spi_token +
    "|" +
    merchant_key +
    "|" +
    spi_merchant_transaction_reff +
    "|" +
    spi_amount +
    "|0|0");

  let result = CryptoJS.enc.Hex.stringify(hash)
  return result.toUpperCase()
}
// spi_signature = shasum.digest("hex")
// spi_signature: E3201FD290B5B4EE66C24EF5ECB5807042B5F329
//                E3201FD290B5B4EE66C24EF5ECB5807042B5F329
module.exports = { spi_signature }