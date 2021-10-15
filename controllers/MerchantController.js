const models = require("../models");
const Op = require("sequelize").Op;
const moment = require('moment-timezone')

module.exports = {
  async urlListener(req, res, next) {
    try {
      if (!req.body) {
        res.send('data tidak ada')
      } else {
        let newListener = JSON.parse(req.body)
        console.log(newListener,"<<<<< kiriman dari winpay")
        // let id_transaksi_winpay = newListener['id_transaksi']
        let id_transaksi_merchant = newListener['no_reff']
        let saldo = newListener['nominal_nett']
        let kode_reseller
        let result = await models.tiket_deposit.findOne({
          where: {
            id_transaksi: id_transaksi_merchant
          },
          order: [['kode', 'desc']]
        })
        if (!result) {
          console.log('Data Tiket Deposit Tidak Ditemukan')
          res.send('Data tiket Deposit Tidak Ditemukan')
        } else {
          if(result.status == 'S'){
            res.send('ACCEPTED')
          }else{
            kode_reseller = result.kode_reseller
            let tgl_status = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
            let updatedTiketDeposit = {
              status: "S",
              tgl_status
            }
            await models.tiket_deposit.update(updatedTiketDeposit, {
              where: {
                id_transaksi: result.id_transaksi
              }
            })
            // res.send('Tiket Deposit Berhasil diupdate')
            let cekReseller = await models.reseller.findOne({
              where: {
                kode: kode_reseller
              },
              order: [['kode', 'desc']]
            })
            if (!cekReseller) {
              console.log('Data Reseller TIDAK DITEMUKAN')
              res.send('Data Reseller TIDAK DITEMUKAN')
            } else {
              let newSaldo = cekReseller.saldo + Number(saldo)
              let updatedReseller = {
                saldo: newSaldo
              }
              await models.reseller.update(updatedReseller, {
                where: {
                  kode: cekReseller.kode
                }
              })
              res.send('ACCEPTED')
            }
          }
        }
      }
    } catch (error) {
      res.send(error)
    }
  },

  urlCallback: (req, res) => {
    try {
      res.render("callback");
    } catch (error) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
};


////////////////////////////////////////////////////////////////////
//  if(!req.body){
    //    res.status(200).send('data tidak ada')
    //  }else{
    //    let newListener = req.body 
    //    let id_transaksi_winpay = newListener['id_transaksi']
    //    let id_transaksi_merchant = newListener['no_reff']
    //    let saldo = newListener['nominal_nett']
    //    let kode_reseller
    //    let cekListener = await models.Listener.findOne({
    //      where:{
    //       id_transaksi:id_transaksi_winpay,
    //       no_reff:id_transaksi_merchant
    //      }
    //    })
    //    if(cekListener){
    //      res.send('ACCEPTED')
    //    }else{
    //      await models.Listener.create(newListener)
    //      let result = await models.tiket_deposit.findOne({
    //        where:{
    //          id_transaksi:id_transaksi_merchant
    //        },
    //        order:[['kode','desc']]
    //      })
    //      if(!result){
    //       res.send('Data tiket Deposit Tidak Ditemukan')
    //      }else{
    //       kode_reseller = result.kode_reseller
    //       let tgl_status = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
    //       let updatedTiketDeposit = {
    //        status: "S",
    //        tgl_status
    //       }
    //       await models.tiket_deposit.update(updatedTiketDeposit, {
    //         where: {
    //           id_transaksi:result.id_transaksi
    //         }
    //       })
    //       // res.send('Tiket Deposit Berhasil diupdate')
    //         let cekReseller = await models.reseller.findOne({
    //           where: {
    //             kode: kode_reseller
    //           },
    //           order: [['kode', 'desc']]
    //         })
    //        if(!cekReseller){
    //          res.send('Data Reseller TIDAK DITEMUKAN')
    //        }else{
    //           let newSaldo = cekReseller.saldo + Number(saldo)
    //           let updatedReseller = {
    //             saldo: newSaldo
    //           }
    //           await models.reseller.update(updatedReseller, {
    //             where: {
    //               kode: cekReseller.kode
    //             }
    //           })
    //          res.send('ACCEPTED')
    //        }
    //      }
    //    }
    //  }