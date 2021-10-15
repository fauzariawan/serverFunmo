var uuid = require('uuid-v4');

// Generate a new UUID
function getTransactionId() {
    let kode = uuid().slice()
    let kode1 = kode.slice(0, 4)
    let kode2 = kode.slice(4, 8)
    let kode3 = kode.slice(8, 12)
    let date = new Date()
    let tanggal = new Date().toISOString().slice(0, 10).split("-")
    let jam = date.getHours()
    let menit = date.getMinutes()
    let detik = date.getMilliseconds()
    let transactionId = `${tanggal[2]}${kode1}${jam}${kode2}${menit}${kode3}${detik}`
    return transactionId.toUpperCase()
    // return kode.toLocaleUpperCase()
}

function gtTrxid() {
    var val = Math.floor(1000 + Math.random() * 9000);
    return (val);
}



module.exports = {
    getTransactionId,
    gtTrxid
}