const moment = require('moment-timezone');

function getFullDate() {
    let date = moment().tz("Asia/Jakarta").format('YYYYMMDD')
    let jam = Number(moment().tz("Asia/Jakarta").format('HH'))
    let menit = Number(moment().tz("Asia/Jakarta").format('mm')) + 120
    let detik = Number(moment().tz("Asia/Jakarta").format('ss'))
    let cek_menit
    let cek_jam
    if (menit > 59) {
      modulus = menit % 60
      cek_menit = String(modulus).length > 1 ? `${modulus}` : `0${modulus}`
      cek_jam = Math.floor(menit / 60)
      jam = cek_jam > 0 ? jam + cek_jam : jam
      console.log(modulus, cek_menit, cek_jam, jam)
    }
    if (jam == 23) {
      jam = '00'
      date = Number(date) + 1
    }
    let fullTime = `${date}${jam}${cek_menit}${detik}`
    return fullTime
  }
  
  module.exports = { getFullDate }