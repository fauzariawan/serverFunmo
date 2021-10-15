const { tiket_deposit, tiket_response } = require('../models')
const { getPaymentChannel } = require('../helper/winpay/getPaymentChannel')
const { getTokenWinPay } = require('../helper/winpay/getTokenWinPay')
const { getTransactionId } = require('../helper/winpay/getTransactionId')
const { spi_signature } = require('../helper/winpay/getSignature')
const { encryptPayload } = require('../helper/winpay/encryptPayload')
const { getPaymentCode } = require('../helper/winpay/getPaymentCode')
const { getFullDate } = require('../helper/winpay/getFullDate')
const moment = require('moment-timezone')
const base64 = require('js-base64')
const axios = require('axios')
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('otomax', 'sa', 'qwerty1090*', {
  host: '45.13.132.61',
      dialect: 'mssql',
      dialectOptions: {
          options: {
            // instanceName: "SQLSERVERFUN",
            encrypt: false,
            validateBulkLoadParameters: true,
            useUTC: false
          }
        },
      timezone: "+07:00"
    });
const queryInterface = sequelize.getQueryInterface();

class winpayController{
  static async paymentChannel(req, res, next) {
    try {
      let private_key1 = process.env.PRIVATE_KEY_1
      let private_key2 = process.env.PRIVATE_KEY_2
      let auth = base64.encode(`${private_key1}:${private_key2}`);
      let result = await getPaymentChannel(auth)
      res.status(200).json(result.response)
      // res.status(200).json({jenisPembayaran : Object.keys(result.response.data.products)})
      // res.status(200).json(auth)
    } catch (error) {
      res.status(500).json(error)
    }
  }
    
  static async topup(req, res, next) {
    try {
      let str = moment().tz("Asia/Jakarta").add(2, 'hours').format("YYYYMMDDHHmmss")
      let user = req.logedInUser
      let paymentChannelUrl = req.body.paymentChannelUrl // 'https://secure-payment.winpay.id/apiv2/ALFAMART' //req.body.paymentChannelUrl
      let item_unitPrice = Number(req.body.unitPrice)//99999
      let pembayaran = req.body.pembayaranVia
      let feeWinpay = pembayaran == 'ALFAMART' ? 4000 : 1500
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
      // let date = getFullDate()
      let data = `{
  "cms": "WINPAY API",
  "spi_callback": "https://funmo.herokuapp.com/merchant/callback",
  "url_listener": "${url_listener}",
  "spi_currency": "IDR",
  "spi_item": [
    {
      "name": "TOPUP",
      "qty": 1,
      "unitPrice": ${item_unitPrice},
      "desc": "Deposit/TopUp Saldo Funmo"
    }
  ],
  "spi_amount": ${amount},
  "spi_signature": "${signature}",
  "spi_token": "${spiToken}",
  "spi_merchant_transaction_reff": "${transactionID}",
  "spi_billingPhone": "${user.notelp}",
  "spi_billingEmail": "funmoreport@gmail.com",
  "spi_billingName": "${user.nama}",
  "spi_paymentDate": "${str}",
  "get_link": "no"
}`
      let messageEncrypted = encryptPayload(data, token)
      let orderData = `${messageEncrypted.slice(0, 10)}${token}${messageEncrypted.slice(10)}`
      // console.log("ini order data>>>>",orderData)
      let response = await getPaymentCode(paymentChannelUrl, orderData)
      console.log(response.response)
      // setelah berhasil get payment code simpan data transaksi deposit ke tabel tiket_deposit
      // res.status(200).json(response.response)
      if(response.response.rc == '00'){
        let tgl_status = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
        let newDeposit = {
          waktu: tgl_status,
          jumlah: item_unitPrice,
          status: 'O',
          tgl_status: tgl_status,
          // kode_inbox:'',
          // kode_data_bank:'',
          kode_reseller: user.kode_reseller,
          // wrkirim:'',
          kode_pembayaran: pembayaran,
          // id_transaksi:''
          //////////////////////////////////////////////////////////////////
          // jumlah: item_unitPrice,
          // kode_reseller: user.kode_reseller,
          // waktu:tgl_status,
          // tgl_status:tgl_status,
          // kode_pembayaran: response.response.data.image_qr || response.response.data.payment_method_code,
          // kode_inbox: response.response.data.reff_id || null, //ini adalah kode pembayaran
          // id_transaksi: response.response.data.order_id,
          // wrkirim: response.response.rd
        }
        let createDeposit = await tiket_deposit.create(newDeposit)
        console.log(createDeposit)
        if(createDeposit){
          let resTime = response.response.response_time
          let reqTime = response.response.request_time
          let request_time = moment(reqTime).tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
          let response_time = moment(resTime).tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
          let expired_time = moment(resTime).tz('Asia/Jakarta').add(2, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
          // let request_time = new Date()
          let newTiketResponse = {
            kode_tiketdeposit: createDeposit.kode,
            rc: response.response.rc,
            rd: response.response.rd,
            request_time,
            reff_id: response.response.data.reff_id,
            payment_code: response.response.data.payment_code,
            order_id: response.response.data.order_id,
            request_key: response.response.data.request_key,
            url_listener: response.response.data.url_listener,
            payment_method: response.response.data.payment_method,
            payment_methodcode: response.response.data.payment_method_code,
            fee_admin: response.response.data.fee_admin,
            total_amount: response.response.data.total_amount,
            spi_statusurl: response.response.data.spi_status_url,
            response_time,
            expired_time
          }
          console.log(newTiketResponse)
          let result = await tiket_response.create(newTiketResponse)
          console.log(result,'<<< ini data tiket_response yang sudah di insert yang baru')
          if(result){
            let findTiket = await tiket_deposit.findOne({
                  where:{
                    kode: createDeposit.kode
                  },
                  include: 'tiket_response'
                })
            res.status(200).json(findTiket)
            // if(pembayaran == 'ALFAMART'){
            //   let findTiket = await tiket_deposit.findOne({
            //     where:{
            //       kode: createDeposit.kode
            //     },
            //     include: 'tiket_response'
            //   })
            //   res.status(200).json(findTiket)
            // }else{
            //   res.status(200).json(response.response)
            // }
          }else{
            res.status(500).json({pesan:"BELUM TERCATAT DI tiket_response"})
          }
        }else{
          res.status(500).json({pesan:"JANGAN MELAKUKAN PEMBAYARAN DATA ANDA TIDAK TERCATAT!!! SEGERA HUBUNGI CUSTOMER SERVICE KAMI"})
        }
      }else{
        res.status(500).json({pesan:'Gagal Get Payment Code From Winpay', response})
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }  

  static async topupQr(req, res, next){
    try {
      let str = moment().tz("Asia/Jakarta").add(2, 'hours').format("YYYYMMDDHHmmss")
      let user = req.logedInUser
      let paymentChannelUrl = req.body.paymentChannelUrl // 'https://secure-payment.winpay.id/apiv2/ALFAMART' //req.body.paymentChannelUrl
      let item_unitPrice = Number(req.body.unitPrice)//99999
      let pembayaran = req.body.pembayaranVia
      // let feeWinpay = Number(process.env.FEE_WINPAY)
      let amount = item_unitPrice
      //       ///////////////////////////////
      let privateKey1 = process.env.PRIVATE_KEY_1 //'9220fbdeb1d115a4f2e9b2636edc24cc' //
      let privateKey2 = process.env.PRIVATE_KEY_2 //'5b74d200096570de0280b9838c7af1ab' //
      let merchant_key = process.env.MERCHANT_KEY //'c9c64d57f0c606ef06c297f96697cab4' //
      let spiToken = process.env.SPI_TOKEN //'9220fbdeb1d115a4f2e9b2636edc24cc5b74d200096570de0280b9838c7af1ab'//
      let transactionID = getTransactionId() //'5e4ce7cf7901235'//
      let signature = spi_signature(merchant_key, spiToken, transactionID, `${String(amount)}.00`) //'38697D628FAF2806FCD1844DC895C50CB631C38E' //
      let token = await getTokenWinPay(privateKey1, privateKey2) //'001d3ff493988afabd38facf0b16f67c' //
      let url_listener = process.env.URL_LISTENER
      let url_callback = process.env.URL_CALLBACK
      // let date = getFullDate()
      // console.log(date)
      let data = `{
  "cms": "WINPAY API",
  "spi_callback": "https://funmo.herokuapp.com/merchant/callback",
  "url_listener": "${url_listener}",
  "spi_currency": "IDR",
  "spi_item": [
    {
      "name": "TOPUP",
      "qty": 1,
      "unitPrice": ${item_unitPrice},
      "desc": "Deposit/TopUp Saldo Funmo"
    }
  ],
  "spi_amount": ${amount},
  "spi_signature": "${signature}",
  "spi_token": "${spiToken}",
  "spi_merchant_transaction_reff": "${transactionID}",
  "spi_billingPhone": "${user.notelp}",
  "spi_billingEmail": "funmoreport@gmail.com",
  "spi_billingName": "${user.nama}",
  "spi_paymentDate": "${str}",
  "get_link": "no",
  "spi_qr_type": "dynamic",
  "spi_qr_subname": "${user.nama}"
}`
// "spi_qr_fee_type": "percent",
// "spi_qr_fee": "10",
      let messageEncrypted = encryptPayload(data, token)
      let orderData = `${messageEncrypted.slice(0, 10)}${token}${messageEncrypted.slice(10)}`
      let response = await getPaymentCode(paymentChannelUrl, orderData)
      console.log(response)
      // console.log(response.response)
      // setelah berhasil get payment code simpan data transaksi deposit ke tabel tiket_deposit
      // res.status(200).json(response.response)
      if(response.response.rc == '00'){
        let tgl_status = moment().tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
        let newDeposit = {
          waktu: tgl_status,
          jumlah: item_unitPrice,
          status: 'O',
          tgl_status: tgl_status,
          kode_reseller: user.kode_reseller,
          kode_pembayaran: pembayaran,
        }
        let createDeposit = await tiket_deposit.create(newDeposit)
        console.log(createDeposit)
        if(createDeposit){
          let resTime = response.response.response_time
          let reqTime = response.response.request_time
          let request_time = moment(reqTime).tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
          let response_time = moment(resTime).tz('Asia/Jakarta').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
          let expired_time = moment(resTime).tz('Asia/Jakarta').add(2, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSZ').slice(0, 23)
          // let request_time = new Date()
          let newTiketResponse = {
            kode_tiketdeposit: createDeposit.kode,
            rc: response.response.rc,
            rd: response.response.rd,
            request_time,
            // reff_id: response.response.data.reff_id,
            // payment_code: response.response.data.payment_code,
            order_id: response.response.data.order_id,
            // request_key: response.response.data.request_key,
            // url_listener: response.response.data.url_listener,
            payment_method: response.response.data.payment_method,
            payment_methodcode: response.response.data.payment_method_code,
            fee_admin: response.response.data.fee_admin,
            total_amount: response.response.data.total_amount,
            spi_statusurl: response.response.data.spi_status_url,
            tips:response.response.data.tips,
            nominal_mdr:response.response.data.nominal_mdr,
            image_qr:response.response.data.image_qr,
            response_time,
            expired_time
          }
          console.log(newTiketResponse)
          let result = await tiket_response.create(newTiketResponse)
          console.log(result,'<<< ini data tiket_response yang sudah di insert yang baru')
          if(result){
            let findTiket = await tiket_deposit.findOne({
                  where:{
                    kode: createDeposit.kode
                  },
                  include: 'tiket_response'
                })
            console.log(findTiket,'ini tiket deposit dari QRIS')
            res.status(200).json(findTiket)
          }else{
            res.status(500).json({pesan:"BELUM TERCATAT DI tiket_response"})
          }
        }else{
          res.status(500).json({pesan:"JANGAN MELAKUKAN PEMBAYARAN DATA ANDA TIDAK TERCATAT!!! SEGERA HUBUNGI CUSTOMER SERVICE KAMI"})
        }
      }else{
        res.status(500).json({pesan:'Gagal Get Payment Code From Winpay', response})
      }
    } catch (error) {
      res.status(400).json(error)
    }
  }  

  static async cekTransaksi(req, res, next){
    try {
      // res.send('berhasil')
      let private_key1 = process.env.PRIVATE_KEY_1
      let private_key2 = process.env.PRIVATE_KEY_2
      let auth = base64.encode(`${private_key1}:${private_key2}`);
      let result = await axios({
        method: 'get',
        url: 'https://secure-payment.winpay.id/transaction/check-qris-transaction?order_id=TRX1941A8118ECB392622900',
        headers: {
          // 'Content-Type': 'text/plain',
          'Authorization': `Basic ${auth}`
        }
      })
      let status = result.status
      let headers = JSON.parse(JSON.stringify(result.headers))
      let response = JSON.parse(JSON.stringify(result.data))
      let data = {
        status,
        headers,
        response
      }
      console.log(data)
      res.send(data)
    } catch (error) {
     next(error)
    }
  }
}

module.exports = winpayController