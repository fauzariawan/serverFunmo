const sha256 = require('sha-256-js');
const { Base64 } = require('js-base64');
const CryptoJS = require('crypto-js')

function encryptPayload(data, token) {
  //let string = JSON.stringify(json_string)
  let key = CryptoJS.SHA256(token).toString().slice(0, 32)
  let iv = sha256(token).slice(0, 16)

  encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC, // CBC, CFB, CTR, OFB
    padding: CryptoJS.pad.Pkcs7 // Pkcs7, Iso97971, AnsiX923, Iso10126, ZeroPadding, NoPadding
  }).toString()

  encrypted = Base64.encode(encrypted).trim()
  return encrypted
}

module.exports = { encryptPayload }
