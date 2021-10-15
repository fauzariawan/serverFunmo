const otpGenerator = require('otp-generator')

function otpGen() {
  let kode = otpGenerator.generate(4, { digits: true, alphabets: false, upperCase: false, specialChars: false })
  return kode
}

module.exports = { otpGen }