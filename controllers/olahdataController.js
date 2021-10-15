const models = require("../models");
const {
  Op
} = require('sequelize')
const {
  getReseller,
  getProdukPerOperator,
  getProdukUpline,
  getKodeOperator
} = require('../helper/getData')

const {levelA, levelD, levelMS, levelR, hargaMarkUp} = require('../helper/hargaPerLevel')

class olahdata {
  static async allProduk(req, res, next){
    models.produk.findAll()
    .then(response => {
      res.status(200).json(response)
    })
    .catch(error => {
      res.status(500).json(error)
    })
  }

  static fixProduk(kode_reseller, kode_operator, kriteria, jmlMarkup, produkMarkup){
    return new Promise (async function (resolve, reject) {
      try {
        // console.log(produkMarkup, 'ini dari fix produk')
        let produk
        let user
        let produk_upline
        console.log('ini dari fixproduk >>>>>>',kode_reseller)
        user = await getReseller(kode_reseller)
        console.log(user.kode, user.kode_level)
        produk = await getProdukPerOperator(kode_operator, kriteria) // produk yang mau ditampilkan
        // console.log(produkMarkup, '<<<<<<<<<<<<<<<<<')
        // // produk_upline = await getProdukUpline(user.kode_upline) // produk upline yang mau di markup
        // // console.log(produk_upline, '<<<<<<<<<<<')
        if (user.kode_level == 'O' || user.kode_level == 'H') {
          console.log('ini level O dan H')
          let produkFix = await hargaMarkUp(user.markup, produk, produkMarkup, jmlMarkup)
          // console.log(produkFix[0])
          resolve(produkFix)
        } else /*if (user.kode_level != 'O' || user.kode_level != 'H')*/ {
          console.log('ini selain level O dan H')
          let response = await levelMS(produk, user.kode_level)
          let produkFix = await hargaMarkUp(user.markup, response, produkMarkup, jmlMarkup)
          resolve(produkFix)
        }
      } catch (error) {
        reject(error)
      }
    })
  }
  
  static async pulsaPerReseller(req, res, next) {
    // res.send('berhasil')
    // console.log(req.body.prefix_tujuan)
    let prefix_tujuan = req.body.prefix_tujuan
    let kode_reseller = req.logedInUser.kode_reseller
    let byu, hsm, htp, ip, tm, xp, xpp
    console.log(prefix_tujuan)

    async function totalMarkup(itself, kode_reseller, kodeOperator, kriteria, markup, produk){
      let reseller = await getReseller(kode_reseller)
      let result = await getProdukUpline(kode_reseller)
      let produkYangDimarkup = produk // untuk awal array kosong '[]'
      console.log(reseller, '<<<<<< ni reseller')
      console.log(result)
      let jmlMarkup = markup // untuk awal nilainya 0
      result.forEach(element => {
        produkYangDimarkup.push({'kode_produk': element.kode_produk, 'markup':element.markup, })
      });
      console.log(produkYangDimarkup, '<<<<<<<< ini produk yang di markup >>>>>')
      // let jmlMarkup = reseller.markup // untuk awal nilainya 0
      // let produkYangDimarkup = produk // untuk awal array kosong '[]'
      // let dataUpline = []
      // let dataMarkup = []

      async function getDataUpline(kodeUpline, produk){
          console.log(produk,'<<<<<< ini produk di getdataupline')
          let upline = await getReseller(kodeUpline)
          console.log(upline.nama)
          console.log(upline.kode)
          // dataUpline.push(upline.kode)
          jmlMarkup += upline.markup
          console.log(jmlMarkup)
          // dataMarkup.push(upline.markup)
          // console.log(dataMarkup)
          //////////////////////////////////////////////////////////////// ini flownya diganti
          let result = await getProdukUpline(upline.kode)
          console.log(result)
          for (let i = 0; i < result.length; i++) {
            let newData = {
              kode_reseller: result[i].kode_reseller,
              kode_produk: result[i].kode_produk,
              markup: result[i].markup
            }
            produkYangDimarkup.push(newData)
            console.log(produkYangDimarkup)
          }
          /////////////////////
          
          if(/* upline.kode_upline != null || upline.kode_upline != undefined || */upline.kode != 'FUN186'){
            getDataUpline(upline.kode_upline, produkYangDimarkup)
          }else{
            let result = await olahdata.fixProduk(itself, kodeOperator, kriteria, jmlMarkup, produk)
            res.status(200).json(result)
          }
        }
      getDataUpline(reseller.kode_upline, produkYangDimarkup)
    }

    if (prefix_tujuan.slice(0,4) == '0851'){
      if (prefix_tujuan.length >= 6 ){
        if(prefix_tujuan.slice(0, 6) == '085154' || prefix_tujuan.slice(0, 6) == '085155' || prefix_tujuan.slice(0, 6) == '085156' || prefix_tujuan.slice(0, 6) == '085157'){
          byu = true
        }else{
          tm = true
        }
      }else{
        tm = true
      }
    }else{
      hsm = ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'].includes(prefix_tujuan.slice(0, 4)) // sma srtfrenen
      htp = ['0895', '0896', '0897', '0898', '0899'].includes(prefix_tujuan.slice(0, 4)) // uan thhree
      ip = ['0815', '0816', '0855', '0856', '0857', '0858', '0814'].includes(prefix_tujuan.slice(0, 4)) // i indosat
      tm = ['0812', '0813', '0821', '0822', '0823', '0852', '0853', '0851'].includes(prefix_tujuan.slice(0, 4)) // // telkomsel
      xp = ['0878', '0877', '0817', '0818', '0819', '0859'].includes(prefix_tujuan.slice(0, 4))
      xpp = ['0838', '0831', '0832', '0833'].includes(prefix_tujuan.slice(0, 4))
    }

    if (byu){
      totalMarkup(kode_reseller, kode_reseller, 'BYU', null, 0, [])
    }else if (hsm) {
      totalMarkup(kode_reseller, kode_reseller, 'HSM', null, 0, [])
    } else if (htp) {
      totalMarkup(kode_reseller, kode_reseller, 'HTP', null, 0, [])
    } else if (ip) {
      totalMarkup(kode_reseller, kode_reseller, 'IP', null, 0, [])
    } else if (tm) {
      totalMarkup(kode_reseller, kode_reseller, 'TM', null, 0, [])
    } else if (xp || xpp) {
      totalMarkup(kode_reseller, kode_reseller, 'XP', null, 0, [])
    } else {
      res.status(400).json({pesan: 'Operator Tidak Ditemukan'})
    }
  }

  static async getProduk(req, res, next){
    try {
      console.log(req.query.kodeOperator, req.query.kriteria )
      let kodeOperator = req.query.kodeOperator
      let kode_reseller = req.logedInUser.kode_reseller
      let kriteria = req.query.kriteria
      console.log('dari olahdata/getoperator')
      console.log(kodeOperator)
      console.log(kode_reseller)
      console.log(kriteria)
      async function totalMarkup(itself, kode_reseller, kodeOperator, kriteria, markup, produk){
        let reseller = await getReseller(kode_reseller)
        let result = await getProdukUpline(kode_reseller)
        let produkYangDimarkup = produk // untuk awal array kosong '[]'
        let jmlMarkup = markup // untuk awal nilainya 0
        result.forEach(element => {
          produkYangDimarkup.push({'kode_produk': element.kode_produk, 'markup':element.markup, })
        });
        console.log(produkYangDimarkup, '<<<<<<<< ini produk yang di markup >>>>>')
        // let jmlMarkup = reseller.markup // untuk awal nilainya 0
        // let produkYangDimarkup = produk // untuk awal array kosong '[]'
        // let dataUpline = []
        // let dataMarkup = []
  
        async function getDataUpline(kodeUpline, produk){
          console.log(produk,'<<<<<< ini produk di getdataupline')
          let upline = await getReseller(kodeUpline)
          // console.log(upline.nama)
          // dataUpline.push(upline.kode)
          jmlMarkup += upline.markup
          console.log(jmlMarkup, '<<< jumlah markup')
          // dataMarkup.push(upline.markup)
          // console.log(dataMarkup)
          //////////////////////////////////////////////////////////////// ini flownya diganti
          // let result = await getProdukUpline(upline.kode)
          // for (let i = 0; i < result.length; i++) {
          //   let newData = {
          //     kode_reseller: result[i].kode_reseller,
          //     kode_produk: result[i].kode_produk,
          //     markup: result[i].markup
          //   }
          //   produkYangDimarkup.push(newData)
          //   console.log(produkYangDimarkup)
          // }
          ///////////////////////
          if(upline.kode != 'FUN186'){
            getDataUpline(upline.kode_upline, produkYangDimarkup)
          }else{
            let result = await olahdata.fixProduk(itself, kodeOperator, kriteria, jmlMarkup, produk)
            res.status(200).json(result)
          }
        }
        getDataUpline(reseller.kode_upline, produkYangDimarkup)
      }
      totalMarkup(kode_reseller, kode_reseller, kodeOperator, kriteria, 0, [])
    } catch (e) {
      res.status(500).json(e.Message)
    }
  }

  static async banner(req, res, next){
    try {
      let result = await models.p_banner.findAll()
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static async info(req, res, next){
    try {
      let result = await models.p_info.findAll()
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static async getBank(req, res, next) {
    try {
      let result = await models.produk.findAll({
            where: {
              kode_operator: "ZWD"
            },
            attributes: ["kode", "nama"],
          })
      
      if(result.length > 0){
        result.forEach(element => {
          element.nama = element.nama.toUpperCase()
        });
        res.status(200).json(result)
      } else {
        res.status(400).json({rc:'01', pesan:'Data Tidak Ditemukan'})
      }

    } catch (error) {
      next(error)
    }
  }

  static async promo(req, res, next){
    try {
      let result = await models.p_flash.findAll({
        where:{
          status_flash: 1
        }
      })
      console.log('<<<<<<<<<< INI IKLAN YANG MAU DI TAMPILKAN >>>>>>>>>>>>>>>')
      console.log(result)
      res.status(200).json(result)
    } catch (error) {
      console.error(error)
      res.send(error)
    }
  }
}

module.exports = olahdata;