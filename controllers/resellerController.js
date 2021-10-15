
const {
  reseller, 
  pengirim, 
  outbox, 
  transaksi, 
  tiket_deposit, 
  mutasi, 
  hadiah_poin, 
  hadiah_desc, 
  komisi, produk, 
  reseller_data, 
  reseller_save, 
  reseller_toko, 
  tiket_response} = require('../models')
const {
  Op
} = require('sequelize')
const config = require('../config/config.json')
const dataMigrasi = require('../jsonReseller.json')
const pengirimSms = require('../pengirimSms.json')
const pengirimSmsTambahan = require('../pengirmSmsTambahan.json')
const pengirimWa = require('../pengirimWa.json')
const dataPengirim = require('../dataPengirimSmsFix.json')
const axios = require('axios')
const path = require ('path')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const {getToken, verifyToken} = require('../helper/jwt')
const {otpGen} = require('../helper/otpGen')
const { decode } = require('js-base64')
const {getTransactionId} = require('../helper/getTrxId')
const {} = require('../helper/getSignature')
const moment = require('moment-timezone')
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.development);
const queryInterface = sequelize.getQueryInterface();
// const Op = Sequelize.Op


cloudinary.config({ // settingan cloudinary nya
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


class resellerController{
  static async tiketDeposit(req, res, next){
    try {
      // let expired_time = moment('2021-09-24 23:47:32.108314').tz("Asia/Jakarta").add(2, 'hours')
      let result = await tiket_deposit.findAll({
        where:{
          kode_reseller: 'FUN0104'
        },
        include: 'tiket_response',
      })
      // console.log(expired_time)
      res.send(result)
    } catch (error) {
      res.send(error)
    }
  }

  static async getAllReseller(req, res, next){
    try {
        let result = await reseller.findAll()
        res.send(result)
    } catch (error) {
        res.send(error)
    }
  }

  static async getReseller(req, res, next){
    try {
      if(req.body.noTelp){
        let telp
        let str
        if(req.body.noTelp[0] == '0'){
          str = req.body.noTelp.slice(1, req.body.noTelp.length)
          telp = `+62${str}`
        }else{
          telp = req.body.noTelp
        }
        let result = await pengirim.findOne({
          where:{
            pengirim:telp
          },
          include: [
            {
              model: reseller,
              as: "reseller",
              include: [{
                model: komisi,
                as: 'komisi',
              },{
                model: reseller_data,
                as: 'reseller_data',
              },{
                model: reseller_save,
                as: 'reseller_save',
              },{
                model: reseller_toko,
                as: 'reseller_toko',
              }],
            }
          ]
        });
        if(result){
          if(result.reseller.aktif == 0){
            res.status(200).json({rc:"03",pesan:"Akun Diblokir"})
          }else{
            res.status(200).json(result)
          }
        }else{
          res.status(400).json({rc:"05", pesan:"Nomor Tujuan Tidak Ditemukan"})
        }
      }else{
        let token = req.body.token
        console.log('ini token>>>>',token)
        let data = verifyToken(token)
        console.log(data)
        let result = await reseller.findOne({
          where:{
            kode:data.kode_reseller
          },
          include: [
            {
              model: pengirim,
              as: "pengirim",
            },
            {
              model: komisi,
              as: 'komisi'
            },
            {
              model: reseller_data,
              as: 'reseller_data'
            },
            {
              model: reseller_save,
              as: 'reseller_save'
            },
            {
              model: reseller_toko,
              as: 'reseller_toko',
            }
          ]
        })
        res.status(200).json(result)
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async signin(req, res, next) {
    try {
      let deviceId = req.body.deviceId
      console.log(deviceId,"<<< ini device Id")
      let dataDeviceId = {deviceId, salahData: 0, tryLogin: 0}
      console.log(dataDeviceId)
      let chosenDevice
      if(req.app.locals.listDevices){
        console.log('List Device Sudah Ada ')
        console.log(req.app.locals.listDevices)
        // req.app.locals.listDevice = null
        if(req.app.locals.listDevices.some(device => device.deviceId === deviceId)){
          console.log("Object found inside the array.");
          req.app.locals.listDevices.forEach(device => {
            if(device.deviceId == deviceId){
              chosenDevice = device
            }
          });
          console.log("device yang lagi mengakses >>>", chosenDevice)
        } else{
            console.log("Object not found.");
            req.app.locals.listDevices.push(dataDeviceId)
            chosenDevice = dataDeviceId
            console.log(chosenDevice)
        }
      }else{
        console.log('List Device Belum Ada')
        req.app.locals.listDevices = []
        req.app.locals.listDevices.push(dataDeviceId)
        chosenDevice = dataDeviceId
        console.log(chosenDevice)
      }
      if(chosenDevice){
        let error = {
          name: 'login',
          errors: []
        }
        let notelp = '+62' + req.body.notelp.slice(1,12)
        let logedInUser = {
          notelp:notelp ,
          pin: req.body.pin
        }
        console.log(logedInUser.notelp, "<<< data user yang login")
        // pengirim.findOne({
        //   where:{
        //     pengirim:logedInUser.notelp
        //   },
        //   include:'reseller'
        // }).then((response) => {
        //   console.log((response))
        // }).catch((error)=>{
        //   console.log(error)
        // })
        let result = await pengirim.findOne({
            where:{
              pengirim:logedInUser.notelp
            },
            include:'reseller'
          })
        console.log(result, "<<< data user login")

        if(result == null){
          error.errors.push('Akun Tidak Di Temukan!!!')
          // console.log(error)
          // console.log(chosenDevice.salahData)
          if(chosenDevice.salahData == 2){
            chosenDevice.salahData = 0
            req.app.locals.listDevices.forEach(device => {
              if(device.deviceId == chosenDevice.deviceId){
                device.salahData = chosenDevice.salahData
              }
            });
            res.status(200).json({rc:'04',pesan:"Terlalu Banyak Nyoba-nyoba"})
          }else{
            chosenDevice.salahData++
            console.log(`salah ke ${chosenDevice.salahData}`)
            req.app.locals.listDevices.forEach(device => {
              if(device.deviceId == chosenDevice.deviceId){
                device.salahData = chosenDevice.salahData
              }
            });
            throw error
          }
        }else {
          if (result.reseller.aktif == 0){
            res.status(200).json({rc:'03', pesan:"Akun Anda Diblokir"})
          }else{
            console.log('akun di temukan')
            if(result.pengirim != notelp || result.reseller.pin != logedInUser.pin){
              if(chosenDevice.tryLogin == 2){
                error.errors.push('Wrong Password Or Phone Number')
                let editReseller = await reseller.update({
                  aktif: 0
                },{
                  where:{
                    kode: result.reseller.kode
                  }
                })
                req.app.locals.listDevices.forEach(device => {
                  if(device.deviceId == chosenDevice.deviceId){
                    device.tryLogin = 0
                  }
                  console.log(`Wrong Password Or Phone Number ${device.tryLogin}`)
                });
                console.log(editReseller,'<<< ini hasil edit reseller')
                throw error
              }else{
                error.errors.push('Wrong Password Or Phone Number') // ini salah no HP ato Pin
                req.app.locals.listDevices.forEach(device => {
                  if(device.deviceId == chosenDevice.deviceId){
                    device.tryLogin++
                  }
                  console.log(`Wrong Password Or Phone Number ${device.tryLogin}`)
                });
                throw error
              }
            }else{
              let otp = otpGen()
              let data = {
                kode_reseller:result.reseller.kode,
                otp,
                notelp: result.pengirim,
                nama: result.reseller.nama,
                deviceId
                  // pin:result.reseller.pin,
                  // saldo:result.reseller.saldo,
                  // markup:result.reseller.markup,
                  }
              let token = getToken(data)
              console.log(data)
              res.status(200).json({token:token})
            }
          }
        }
      }else{
        console.log('ADA PENYUSUP YANG BERHASIL MASUK TANPA DIKETAHUI ID DEVICE NYA!!!!!!!!')
      }
    } catch (error) {
      next(error)
    }
  }

  static async kirimotp(req, res,  next){
    let method = req.body.method
    let data = JSON.parse(req.headers.token) 
    let decodeToken = verifyToken(data.token)
    let newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");
    // console.log(method)
    // console.log(decodeToken)
    if(method == 'SMS'){
      // console.log('sms')
      // let result = await queryInterface.bulkInsert("outbox", [{
      //     tgl_entri:newDate,
      //     tgl_status:newDate,
      //     pengirim:null,
      //     penerima:decodeToken.notelp,
      //     tipe_penerima:'S',
      //     pesan: 'FUNMOBILE :) HI ' + decodeToken.nama + ' SILAHKAN MASUKKAN KODE OTP ' + decodeToken.otp + ' UNTUK MASUK DI APLIKASI, JANGAN BERITAHU OTP INI KEPADA ORANG LAIN.',
      //     kode_reseller:decodeToken.kode_reseller,
      //     kode_inbox:null,
      //     kode_transaksi:null,
      //     status:0,
      //     bebas_biaya:1,
      //     prioritas:3,
      //     kode_terminal:null,
      //     modul_proses:','
      //   }], {})
      let item = {
        tgl_entri:newDate,
        tgl_status:newDate,
        pengirim:null,
        penerima:decodeToken.notelp,
        tipe_penerima:'S',
        pesan: 'FUNMOBILE :) HI ' + decodeToken.nama + ' SILAHKAN MASUKKAN KODE OTP ' + decodeToken.otp + ' UNTUK MASUK DI APLIKASI, JANGAN BERITAHU OTP INI KEPADA ORANG LAIN.',
        kode_reseller:decodeToken.kode_reseller,
        kode_inbox:null,
        kode_transaksi:null,
        status:0,
        bebas_biaya:1,
        prioritas:3,
        kode_terminal:null,
        modul_proses:','
      }
      await outbox.create(item)
      res.status(200).json({kode:'00', pesan:'OTP sudah dikirim melalu SMS'})
      console.log(decodeToken)
    }else if(method == "WA"){
      let string = decodeToken.notelp.substring(1, decodeToken.notelp.length)
      console.log(string)
      let item = {
        tgl_entri: newDate,
        tgl_status: newDate,
        pengirim: null,
        penerima: string,
        tipe_penerima: 'W',
        pesan: `FUNMOBILE :) HI ${decodeToken.nama} SILAHKAN MASUKKAN KODE ${decodeToken.otp} UNTUK MASUK DI APLIKASI, JANGAN BERITAHU OTP INI KEPADA ORANG LAIN.`,
        kode_reseller: decodeToken.kode_reseller,
        kode_inbox: null,
        kode_transaksi: null,
        bebas_biaya: 1,
        prioritas: 3,
        modul_proses: '.',
        is_perintah: 0,
        kode_modul: null,
        kode_terminal: 11,
        ctr_kirim: null
      }
      await outbox.create(item)
      res.status(200).json({kode:'00', pesan:'OTP sudah dikirim melalu WA'})
      console.log(decodeToken)
        // res.status(200).json(decodeToken)
    }
  }

  static async confirmOtp(req, res, next) {
    try {
      if (req.headers.token && req.body.kode_otp) {
        let otp = req.body.kode_otp
        let data = JSON.parse(req.headers.token) 
        let decodeToken = verifyToken(data.token)
        console.log(decodeToken.otp, otp)
        if (decodeToken.otp == otp) {
          // console.log('data sesuai')
          // res.status(200).json(decodeToken)
          let result = await reseller_data.findAll({
            where:{
              kode_reseller:decodeToken.kode_reseller,
            }
          })
          let cekDevice = await reseller_data.findAll({
            where:{
              device_id: decodeToken.deviceId
            }
          })
          console.log('ini cek device id >>>', cekDevice.length)
          console.log('ini cek kode reseller >>>', result.length)
          if(result.length == 0 && cekDevice.length == 0){
            console.log('1')
            let time = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
            let newResellerData = {
              kode_reseller: decodeToken.kode_reseller,
              device_id: decodeToken.deviceId,
              device_multi: 0,
              device_act: 1,
              reseller_img: null,
              createdAt: time,
              updatedAt: time
            }
            await reseller_data.create(newResellerData)
            let newToken = getToken({
              nama: decodeToken.nama,
              notelp: decodeToken.notelp,
              kode_reseller:decodeToken.kode_reseller,
            })
            console.log(newToken)
            res.status(200).json({
              message: 'SUCCESS LOGIN',
              token: newToken
            }).catch((error) => {
              res.status(500).json(error)
            })
          } else if (result.length == 1){
            // console.log('2')
            if(result[0].device_multi == 0){
              console.log('device id >>>',result[0].device_id, decodeToken.deviceId)
              console.log('device_act >>>',result[0].device_act)
              if(result[0].device_id == decodeToken.deviceId && result[0].device_act == 0){
                await reseller_data.update({
                  device_act: 1,
                },{
                  where:{ 
                    device_id: decodeToken.deviceId
                  }
                })
                let newToken = getToken({
                  nama: decodeToken.nama,
                  notelp: decodeToken.notelp,
                  kode_reseller:decodeToken.kode_reseller,
                })
                console.log(newToken)
                res.status(200).json({
                  message: 'SUCCESS LOGIN',
                  token: newToken
                }).catch((error) => {
                  res.status(500).json(error)
                })
              }else{
                console.log("JANGAN SEMBARANGAN MENGGUNAKAN AKUN ORANG !!!")
                res.status(401).json({pesan:"not authorized"})
              }
            }else{
              let isNewDevice = false
              let deviceLogin = []
              for (let i = 0; i < result.length; i++) {
                if(result[i].device_id == decodeToken.deviceId){
                  deviceLogin.push(result[i].device_id)
                }
              }
              if(deviceLogin.length == 0){
                isNewDevice = true
              }
              deviceLogin.length == 0 ? isNewDevice = true : isNewDevice = false
              if(isNewDevice){
                let time = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
                let newResellerData = {
                  kode_reseller: decodeToken.kode_reseller,
                  device_id: decodeToken.deviceId,
                  device_multi: 1,
                  device_act: 1,
                  reseller_img: null,
                  createdAt: time,
                  updatedAt: time
                }
                await reseller_data.create(newResellerData)
                let newToken = getToken({
                  nama: decodeToken.nama,
                  notelp: decodeToken.notelp,
                  kode_reseller:decodeToken.kode_reseller,
                })
                console.log(newToken)
                res.status(200).json({
                  message: 'SUCCESS LOGIN',
                  token: newToken
                }).catch((error) => {
                  res.status(500).json(error)
                })
              }else{
                await reseller_data.update({
                  device_act: 1,
                },{
                  where:{ 
                    device_id: decodeToken.deviceId
                  }
                })
                let newToken = getToken({
                  nama: decodeToken.nama,
                  notelp: decodeToken.notelp,
                  kode_reseller:decodeToken.kode_reseller,
                })
                console.log(newToken)
                res.status(200).json({
                  message: 'SUCCESS LOGIN',
                  token: newToken
                }).catch((error) => {
                  res.status(500).json(error)
                })
              }
            }
          } else if(result.length == 0 && cekDevice.length == 1){
            console.log('masuk kesini')
            res.status(401).json({pesan:"Jangan Buka Akun Orang !!!"})
          } else {
            console.log('3')
            let isNewDevice = false
            let deviceLogin = []
            for (let i = 0; i < result.length; i++) {
              if(result[i].device_id == decodeToken.deviceId){
                deviceLogin.push(result[i].device_id)
              }
            }
            // if(deviceLogin.length == 0){
            //   isNewDevice = true
            // }
            deviceLogin.length == 0 ? isNewDevice = true : isNewDevice = false
            if(isNewDevice){
              let time = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
              let newResellerData = {
                kode_reseller: decodeToken.kode_reseller,
                device_id: decodeToken.deviceId,
                device_multi: 1,
                device_act: 1,
                reseller_img: null,
                createdAt: time,
                updatedAt: time
              }
              await reseller_data.create(newResellerData)
              let newToken = getToken({
                nama: decodeToken.nama,
                notelp: decodeToken.notelp,
                kode_reseller:decodeToken.kode_reseller,
              })
              console.log(newToken)
              res.status(200).json({
                message: 'SUCCESS LOGIN',
                token: newToken
              }).catch((error) => {
                res.status(500).json(error)
              })
            }else{
              await reseller_data.update({
                device_act: 1,
              },{
                where:{ 
                  device_id: decodeToken.deviceId
                }
              })
              let newToken = getToken({
                nama: decodeToken.nama,
                notelp: decodeToken.notelp,
                kode_reseller:decodeToken.kode_reseller,
              })
              console.log(newToken)
              res.status(200).json({
                message: 'SUCCESS LOGIN',
                token: newToken
              }).catch((error) => {
                res.status(500).json(error)
              })
            }
          }
        } else {
          res.status(500).json({pesan:'not authorized'})
        }
      } else {
        res.status(500).json({pesan:'not authorized'})
      }
    } catch (error) {
      next(error)
    }
  }

  static async topup(req, res, next) {
      try {
        let user = req.logedInUser
        // res.status(200).json(user)
        // payload yang di butuhkan
        let paymentChannelUrl = req.body.paymentChannelUrl // 'https://secure-payment.winpay.id/apiv2/ALFAMART' //req.body.paymentChannelUrl
        let item_unitPrice = Number(req.body.unitPrice)//99999
        let feeWinpay = Number(process.env.FEE_WINPAY)
        let amount = item_unitPrice + feeWinpay
        ///////////////////////////////
        let privateKey1 = process.env.PRIVATE_KEY_1 //'9220fbdeb1d115a4f2e9b2636edc24cc' //
        let privateKey2 = process.env.PRIVATE_KEY_2 //'5b74d200096570de0280b9838c7af1ab' //
        let merchant_key = process.env.MERCHANT_KEY //'c9c64d57f0c606ef06c297f96697cab4' //
        let spiToken = process.env.SPI_TOKEN //'9220fbdeb1d115a4f2e9b2636edc24cc5b74d200096570de0280b9838c7af1ab'//
        let transactionID = getTransactionId() //'5e4ce7cf7901235'//
        let signature = spi_signature(merchant_key, spiToken, transactionID, `${String(amount)}.00`) //'38697D628FAF2806FCD1844DC895C50CB631C38E' //
        let token = await getTokenWinPay(privateKey1, privateKey2) //'001d3ff493988afabd38facf0b16f67c' //
        let url_listener = process.env.URL_LISTENER
        let url_callback = process.env.URL_CALLBACK
        let date = getFullDate()
        let data = `{
    "cms": "WINPAY API",
    "spi_callback": "${url_callback}",
    "url_listener": "${url_listener}",
    "spi_currency": "IDR",
    "spi_item": [
      {
        "name": "TOPUP",
        "qty": 1,
        "unitPrice": ${item_unitPrice},
        "desc": "Deposi/TopUp Saldo Funmo"
      }
    ],
    "spi_amount": ${amount},
    "spi_signature": "${signature}",
    "spi_token": "${spiToken}",
    "spi_merchant_transaction_reff": "${transactionID}",
    "spi_billingPhone": "${user.notelp}",
    "spi_billingEmail": "${user.email}",
    "spi_billingName": "${user.nama}",
    "spi_paymentDate": "${date}",
    "get_link": "no"
  }`
        // res.status(200).json(data)
        // let token = '001d3ff493988afabd38facf0b16f67c'
        let messageEncrypted = encryptPayload(data, token)
        let orderData = `${messageEncrypted.slice(0, 10)}${token}${messageEncrypted.slice(10)}`
        // res.status(200).json(orderData)
        // console.log(orderData)
        let response = await getPaymentCode(paymentChannelUrl, orderData)
        // setelah berhasil get payment code simpan data transaksi deposit ke tabel tiket_deposit
        let tgl_status = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
        let newDeposit = {
          jumlah: item_unitPrice,
          kode_reseller: user.kode,
          waktu:tgl_status,
          tgl_status:tgl_status,
          kode_pembayaran: response.data.data.reff_id,
          id_transaksi: response.data.data.order_id
        }
        await tiket_deposit.create(newDeposit)
        res.status(200).json(response.data)
      } catch (error) {
        res.status(400).json(error)
      }
    }
  
  static async allTransaksi(req, res, next){
    try {
      let user = req.logedInUser
      let result = await transaksi.findAll({
        where:{
          kode_reseller: user.kode_reseller
        },
        include: 'produk',
        order:[['tgl_entri','desc']]
      })
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async findOneTransaksi(req, res, next){
    try {
      // let user = req.logedInUser
      let kode = req.query.kode 
      let result = await transaksi.findOne({
        where:{
          kode
        },
        include: 'produk',
        order:[['tgl_entri','desc']]
      })
      console.log(result.status, ' <<<<< yang pertama')
      if(result.status == 1){
        async function findTrx(kode){
          let hasil = await transaksi.findOne({
            where:{
              kode
            },
            include: 'produk',
            order:[['tgl_entri','desc']]
          })
          console.log(hasil.status, '<<<< yang berikutnya')
          if(hasil.status == 1){
            findTrx(kode)
          }else{
            res.status(200).json(hasil)
          }
        }
        findTrx(kode)
      }else{
        res.status(200).json(result)
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async allDeposit(req, res, next){
    try {
      let user = req.logedInUser
      let result = await tiket_deposit.findAll({
        where:{
          kode_reseller: user.kode_reseller
        },
        include: 'tiket_response',
        order:[['waktu','desc']]
      })
      console.log(result)
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async allMutasi(req, res, next){
    try {
      let user = req.logedInUser
      let result = await mutasi.findAll({
        where:{
          kode_reseller: user.kode_reseller
        },
        include: "transaksi",
        order:[['tanggal','desc']]
      })
      res.status(200).json(result)
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async allNotification(req, res, next) {
    try {
      let user = req.logedInUser
      let result = await outbox.findAll({
        where:{
          kode_reseller: user.kode_reseller, 
          // kode_transaksi : {
          //   [Op.ne]: '' // tidak sama dengan '' (kosong)
          // }
        },
        order:[['tgl_entri','desc']]
      })
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static async verifikasiData(req, res, next){ 
    // menyiapkan tempat penyimpanan dan memberikan nama untuk file
    let nik = String(req.query.nik)
    let token = req.query.token
    let decodeToken = verifyToken(token)
    console.log(decodeToken)
    let isExist = await resellerController.cekKtp(nik)
    console.log('hasil pencarian nik dari verifikasiData >>',isExist)
    // res.send(isExist)
    if(isExist){
      res.status(200).json(3)
    }else{
        const storage = multer.diskStorage({
        // destination: './public/image/', //<= bisa langsung seperti ini
        // destination: (req, file, cb) => {
        //     cb(null, path.join(__dirname,'../public/image')) // path.join(__dirname) memberikan alamat lemgkap dimana kita berada
        // },
        filename: (req, file, cb) => {
            let namaFile = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
            cb(null, namaFile) // path.extname mengambil ekstension file nya aja
        }
      })

      // hanya format gambar yang boleh di upload
      function checkFileType(file, cb) {
          // allowed ext
          const filetypes = /jpeg|jpg|png|gif/;
          // check ext
          const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
          //check mime
          const mimetype = filetypes.test(file.mimetype)
      
          if(mimetype && extname){
              return cb(null, true)
          }else{
              return cb('Error: Images Only')
          }
      }

      // untuk upload gambar dan kriteria yang boleh di upload
      const upload = multer({
          storage: storage,
          // limits: {fileSize: 1000000}, // in byte
          // fileFilter: (req, file, cb) => {
          //     checkFileType(file, cb)
          // }
      }).array('files', 2)
      // single('fotoKtp')
      
      // menjalankan fungsi upload gambar
      upload(req, res, (err) => {
        if(err){
          console.log(err)
          // res.send(err)
        } else {
          console.log('upload complete')
          // console.log(req.files)
          let dataFile = req.files
          dataFile.forEach(file => {
            file.size = 10000
          });
          if(dataFile.length == 0){
            console.log('file tidak ditemukan')
            res.status(500).json({pesan:"File tidak ditemukan"})
          }else{
            res.status(200).json(1)
            const cloudinaryImageUploadMethod = /*async*/ file => {
              console.log(file, "<<<<<<< ini yang mau di upload")
              return new Promise(resolve => {
                  cloudinary.uploader.upload( 
                      file ,
                      {
                          folder:'image',
                          
                      },
                      (err, res) => {
                          if (err) return res.status(500).send("upload image error")
                          console.log( res.secure_url )
                          urls.push(res.secure_url)
                          resolve({
                              res: urls/*res.secure_url*/
                          }) 
                      }
                  ) 
              })
            }
            let urls = [];
            const files = dataFile//req.files;
            console.log(files, "<<<<< ini file yang mau di upload")
            for (const file of files) {
              const { path } = file;
              console.log(path)
              cloudinary.image(path, {width: 50, crop: "scale"}) // 
              cloudinaryImageUploadMethod(path).then((response) => {
              }).catch((error) => {
                  console.log(error)
              })
            }
            function cekUrls(time, noKtp){
                if(urls.length == 2){
                  let dataFoto = urls.join(',')
                  reseller.update({
                      nomor_ktp: noKtp,
                      url_report: dataFoto,
                      oid:'02', // pending
                  },{
                      where:{
                          kode:decodeToken.kode_reseller
                      }
                  })
                  // .then((response) => {
                  //     res.status(200).json(response[0]) // kalau hasilnya "1" berarti update sukses kalau hasilnya "0" bearti update gagal
                  // }).catch((error)=>{
                  //     res.status(500).json(error)
                  // })
                }else{
                  time++
                  console.log(`cek yang ke ${time}`)
                  setTimeout(() => {
                      cekUrls(time, noKtp)
                  }, 1000)
                }
            }
            cekUrls(1, nik)
          }
        }
      })
    }
  }

  static async downline(req, res, next){
    try {
      console.log('lagi mencari downline')
      let subdownline = []
      let result = await reseller.findAll({
        where: {
          kode_upline : req.params.kode_upline
        },
        include:"pengirim",
        order:[['kode']]
      })
      let resultJson = JSON.stringify(result)
      let _result = JSON.parse(resultJson)
      _result.forEach(element =>{
        element.urutan = Number(element.kode.substr(3, element.kode.length))
        element.nama = element.nama.toUpperCase()
        element.jumlahDownline = 0
      })
      for (let i = 0; i < _result.length; i++) {
        let data = await reseller.findAll({
          where: {
            kode_upline: _result[i].kode
          }
        })
        let sdl = {
          kode_reseller : _result[i].kode,
          jd: data.length
        }
        subdownline.push(sdl)
      }
      console.log(subdownline, '<<< ini hasil pencarian sub downline')
      for (let i = 0; i < _result.length; i++) {
       for (let j = 0; j < subdownline.length; j++) {
         if(_result[i].kode == subdownline[j].kode_reseller){
           _result[i].jumlahDownline = subdownline[j].jd
         }
       }
      }
      // membuat sebuah array berurut berdasarkan key //
      _result.sort(function(a, b) {
        var keyA = a.urutan,
          keyB = b.urutan;
        // Compare the 2 key
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      console.log(_result)
      res.status(200).json(_result)
    } catch (error) {
      console.log(error)
    }
  }

  static async editMarkup(req, res, next){
    try {
      const {kode_reseller, markup} = req.body
      let result = await reseller.update({
        markup
      },{
        where: {
          kode:kode_reseller
        }
      })
      if(result[0] == 1){
        res.status(200).json({rc:'00', pesan: 'update markup berhasil'})
      }else{
        res.status(200).json({rc:'01', pesan: 'update markup gagal'})
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async reward(req, res, next){
    let result = await hadiah_poin.findAll({
      order:[['jml_poin','asc']],
      include: "hadiah_desc",
    })
    res.send(result)
  }

  static async komisi(req, res, next){
    try {
      let user = req.logedInUser
      let result = await komisi.findAll({
        where: {
          kode_reseller: user.kode_reseller
         },
         order: [
          ['kode_transaksi', 'desc']
         ],
         include: [
         {
          model: transaksi,
          as: "transaksi",
          include: [{
              model: produk,
              as: 'produk',         /**** b) ****/
              // required: false,        /**** a) #1 ****/ 
              // attributes: ['userId', 'firstname', 'lastname', 'profilePicture']
          }],
          // limit: 1,
          // separate: false,
          // attributes: ["kode_produk", "tujuan"]
         }]
      })
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  static async cekPlnPrePaid(req, res, next){
    try {
      let noTujuan = req.body.noTujuan
      let result = await axios({
        method: 'get',
        url: `https://funmo.co.id/ppob/inquiry.php?idtrx=12345&tujuan=${noTujuan}&kodeproduk=PLNPREPAID`,
      })
      if(typeof result.data == 'object'){
        res.status(200).json(result.data['DATA'])
      }else{
        res.status(400).json(result.data)
      }
    } catch (error) {
      console.error(error)
    }
  }

  static async cekKtp(nik){
    try {
      let dataKtp = []
      let result = await reseller.findAll({
        where:{
          nomor_ktp : nik
        },
        // attributes: ['nomor_ktp']
      })
      result.forEach(ktp=>{
        dataKtp.push(ktp.nomor_ktp)
      })
      let hasil = dataKtp.includes(nik)
      return hasil
      // res.status(200).json(hasil)
    } catch (error) {
      console.log(error)
    }
  }

  static async logout(req, res, next){
    try {
      let kode_reseller = req.body.kode_reseller
      let device_id = req.body.device_id
      console.log(kode_reseller, device_id)
      let result = await reseller_data.update({
        device_act: 0
      },{
        where:{
          kode_reseller, device_id
        }
      })
      if(result[0] == 1){
        res.status(200).json({rc:'00', pesan:'Berhasil Logout'})
      }else{
        res.status(400).json({rc:'01', pesan:'gagal update device_act'})
      }
    } catch (error) {
      next(error)
    }
  }

  static async saveNumber(req, res, next){
    try {
      let time = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
      let user = req.logedInUser
      let {number, nama, type} = req.body
      console.log(number, nama, type)
      if(number != undefined && nama != undefined && type != undefined){
        let check = await reseller_save.count({ 
          where: { 
           noTelp: number 
          } 
         })
         if(check > 0){
            res.status(400).json({rc:'02', pesan:'Nomor Sudah Ada'})
         }else{
            let newNumber = {
              kode_reseller: user.kode_reseller,
              nama: nama.toUpperCase(),
              noTelp: number,
              s_createdAt: time,
              s_updatedAt: time,
              s_stype: Number(type),
            }
            let result = await reseller_save.create(newNumber)
            if(result){
              res.status(200).json({rc:'00', pesan:"Nomor Berhasil Disimpan"})
            }else{
              res.status(400).json({rc:'01', pesan:"Gagal Menyimpan Nomor"})
            }
         }
      }else{
        res.send('data tidak lengkap')
      }
    } catch (error) {
      next(error)
    }
  }

  static async saveResellerToko(req, res, next){
    try {
      let time = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
      let user = req.logedInUser
      let {namaToko, alamatToko, tipeToko} = req.body
      let result = await reseller_toko.findOne({
        where: {
          kode_reseller: user.kode_reseller
        }
      })
      if(result){
        let update = await reseller_toko.update({
          nama_toko : namaToko,
          alamat_toko: alamatToko,
          tipe_toko: tipeToko,
          updatedAt: time
        },{
          where:{
            kode_reseller: user.kode_reseller
          }
        })
        if(update[0] == 1){
          res.status(200).json({rc:'00', pesan:"Berhasil Update Data Toko"})
        }else{
          res.status(400).json({rc:'01', pesan:"Gagal Update Data Toko"})
        }
      }else{
        let save = await reseller_toko.create({
          kode_reseller: user.kode_reseller,
          nama_toko : namaToko,
          alamat_toko: alamatToko,
          tipe_toko: tipeToko,
          createdAt: time,
          updatedAt: time
        })
        if(save){
          res.status(200).json({rc:'00', pesan:"Berhasil Membuat Data Toko"})
        }else{
          res.status(400).json({rc:'03', pesan:"Gagal Membuat Data Toko"})
        }
      }
    } catch (error) {
      next(error)
    }
  }

  static async editPemilik(req, res, next){
    try {
      let user = req.logedInUser
      let namaPemilik = req.body.namaPemilik
      let result = await reseller.update({
        nama_pemilik: namaPemilik
      }, {
        where : {
          kode: user.kode_reseller
        }
      })
      if(result[0] == 1){
        res.status(200).json({rc:'00', pesan:'Nama Pemilik Berhasil di Update'})
      }else{
        res.status(400).json({rc:'01', pesan:'GAGAL Update Nama Pemilik'})
      }
    } catch (error) {
      next(error)
    }
  }

  static async lupaPin(req, res, next){
    try {
      if(req.body.noTelp){
        let telp
        let str
        if(req.body.noTelp[0] == '0'){
          str = req.body.noTelp.slice(1, req.body.noTelp.length)
          telp = `+62${str}`
        }else{
          telp = req.body.noTelp
        }
        let result = await pengirim.findOne({
          where:{
            pengirim:telp
          },
          include: [
            {
              model: reseller,
              as: "reseller",
              include: [{
                model: komisi,
                as: 'komisi',
              },{
                model: reseller_data,
                as: 'reseller_data',
              },{
                model: reseller_save,
                as: 'reseller_save',
              },{
                model: reseller_toko,
                as: 'reseller_toko',
              }],
            }
          ]
        });
        if(result){
          if(result.reseller.aktif == 0){
            res.status(200).json({rc:"03",pesan:"Akun Diblokir"})
          }else{
            let newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");
            let otp = otpGen()
            let item = {
              tgl_entri:newDate,
              tgl_status:newDate,
              pengirim:null,
              penerima:telp,
              tipe_penerima:'S',
              pesan: 'FUNMOBILE :) HI ' + result.reseller.nama + ' SILAHKAN MASUKKAN KODE OTP ' + otp + ' UNTUK MERESET PIN KAMU, JANGAN BERITAHU OTP INI KEPADA ORANG LAIN.',
              kode_reseller: result.reseller.kode,
              kode_inbox:null,
              kode_transaksi:null,
              status:0,
              bebas_biaya:1,
              prioritas:3,
              kode_terminal:null,
              modul_proses:','
            }
            await outbox.create(item)
              let data = {
                otp,
                notelp: telp,
                  }
              let token = getToken(data)
              console.log(data)
              console.log(token)
              res.status(200).json({token:token})
          }
        }else{
          res.status(400).json({rc:"05", pesan:"Nomor Tujuan Tidak Ditemukan"})
        }
      }else{
        res.status(401).json({pesan:"Nomor Tujuan Tidak Ada"})
      }
    } catch (error) {
      next(error)
    }
  }

  static async migrasi(req, res, next){
    try {
      let result = await queryInterface.bulkInsert("pengirim", dataPengirim, {})
      // let result = await queryInterface.bulkDelete("pengirim", null, {})
      res.send(result)
    } catch (error) {
      next(error)
    }
  }

}

// include: [{
//   model: models.Proposition,
//   include: [{
//       model: models.User,
//       as: 'whatever',         /**** b) ****/
//       required: false,        /**** a) #1 ****/ 
//       attributes: ['userId', 'firstname', 'lastname', 'profilePicture']
//   }, {
//       model: models.User,
//       as: 'Fan',
//       required: false,        /**** b) #2 ****/ 
//       attributes: []
//   }],

module.exports = resellerController

// Respon Code
// 03 = Akun Di Blokir
// 04 = terlalu banyak coba-coba
// 05 = nomor tujuan tidak ditemukan
