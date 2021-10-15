class daftarBank{
    static async allBank(req, res, next){
        try {
            const daftarBank = require('../daftarBank/daftarBank.json')
            res.status(200).json(daftarBank)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = daftarBank