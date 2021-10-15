const provinsi = require('../wilayahIndonesia/propinsi.json')

class dataProvinsiController{
    static async provinsi(req, res, next){
        console.log('<<<<<<<<< ada yang akses data provinsi>>>>>>>')
        res.status(200).json(provinsi)
    }

    static async kabupaten(req, res, next){
        let idProvinsi = req.body.idProvinsi
        const kabupaten = require(`../wilayahIndonesia/kabupaten/${idProvinsi}.json`)
        console.log('<<<<<<<<< ada yang akses data kabupaten>>>>>>>')
        res.status(200).json(kabupaten)
    }

    static async kecamatan(req, res, next){
        let idKabupaten = req.body.idKabupaten
        const kecamatan = require(`../wilayahIndonesia/kecamatan/${idKabupaten}.json`)
        kecamatan.forEach(element => {
            element.nama = element.nama.toUpperCase()
        });
        console.log('<<<<<<<<<ada yang akses data kecamatan>>>>>>>')
        res.status(200).json(kecamatan)
    }

    static async kelurahan(req, res, next){
        let idKecamatan = req.body.idKecamatan
        const kelurahan = require(`../wilayahIndonesia/kelurahan/${idKecamatan}.json`)
        kelurahan.forEach(element => {
            element.nama = element.nama.toUpperCase()
        });
        console.log('<<<<<<<<ada yang akses <data kelurahan>>>>>>>')
        res.status(200).json(kelurahan)
    }

}

module.exports = dataProvinsiController