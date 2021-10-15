const otpGenerator = require('otp-generator')

function otpGen() {
  let kode = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false })
  return kode
}

module.exports = { otpGen }