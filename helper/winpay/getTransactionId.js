
var uuid = require('uuid-v4');

// Generate a new UUID
function getTransactionId() {
  let kode = uuid().slice(24)
  let kode1 = kode.slice(0, 4)
  let kode2 = kode.slice(4, 8)
  let kode3 = kode.slice(8, 12)
  let date = new Date()
  let tanggal = new Date().toISOString().slice(0, 10).split("-")
  let jam = date.getHours()
  let menit = date.getMinutes()
  let detik = date.getMilliseconds()
  let transactionId = `TRX${tanggal[2]}${kode1}${jam}${kode2}${menit}${kode3}${detik}`
  return transactionId.toUpperCase()
}

// console.log(getTransactionId())
// PENTING............//
// misal
// let temp = 'd0360533-594f-4356-88fe-e40bed4f622f\n'
// temp = temp.replace(/(\r\n|\n|\r)/gm, "") menghilangkan tanda penghubung("-")
// new Date().toISOString().slice(0, 10) // .split('-').reverse().join('/') (menjadikan format tanggal indonesia dd-mm-yyyy)
// Validate a UUID as proper V4 format
// console.log(uuid.isUUID(myUUID));  // true
// ....................//
module.exports = { getTransactionId }