function getFullDate() {
  let date = new Date().toISOString().slice(0, 10).replace(/[^0-9]/g, "")
  let time = new Date()
  let jam = time.getHours()
  let menit = time.getMinutes() + 120 // untuk menambah waktu pembayaran berdasarkan menit
  let detik = String(time.getSeconds()).length > 1 ? time.getSeconds().toString() : `0${time.getSeconds()}`
  let cek_menit
  let cek_jam
  if (menit > 59) {
    modulus = menit % 60
    cek_menit = String(modulus).length > 1 ? `${modulus}` : `0${modulus}`
    cek_jam = Math.floor(menit / 60)
    jam = cek_jam > 0 ? jam + cek_jam : jam
  }
  if (jam == 23) {
    jam = '00'
    date = Number(date) + 1
  }
  let fullTime = `${date}${jam}${cek_menit}${detik}`
  console.log(fullTime, '<<< dari helper')
  return fullTime
}

module.exports = { getFullDate }