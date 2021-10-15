function genPin() {
  let newPin = Math.floor(Math.random() * 100000)
  return newPin
}

module.exports = { genPin }