const models = require("../models");
const axios = require('axios')
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'client-id': process.env.CLIENT_ID_LINKQU,
    'client-secret': process.env.CLIENT_SECRET_LINKQU
}
const moment = require('moment-timezone')
const {
    gtTrxid, getTransactionId
  } = require('../helper/getTrxId')
class LinkquController{
    static async getDataBank(req, res, next){
        let url = `${process.env.URL_LINKQU}/linkqu-partner/masterbank/list`
        let result = await axios({
            method: 'get',
            url,
            headers
          })
        if(result.data.rc == '00'){
            res.send(result.data.data)
        }else{
            res.status(400).json(result.data)
        }
    }
    static async getDataEmoney(req, res, next){
        let url = `${process.env.URL_LINKQU}/linkqu-partner/data/emoney?username=LI801D8G7`
        let result = await axios({
            method: 'get',
            url,
            headers
          })
          res.send(result.data)
    }
    static async getResumeAccount(req, res, next){
        let url = `${process.env.URL_LINKQU}/linkqu-partner/akun/resume?username=LI801D8G7`
        let result = await axios({
            method: 'get',
            url,
            headers
          })
          res.send(result.data)
    }
    static async createVirtualAccount(req, res, next){
        let expired = moment().tz("Asia/Jakarta").add(2, 'hours').format("YYYYMMDDHHmmss")
        let url = `${process.env.URL_LINKQU}/linkqu-partner/transaction/create/vapermata`
        let result = await axios({
            method: 'post',
            url,
            headers,
            data: {
                amount : 50000,
                partner_reff : "20091911581103688587",
                transaction_amount : "50000",
                customer_id : "31857418",
                customer_name : "Gerbang Pembayaran Indonesia",
                expired,
                username : process.env.USERNAME_LINKQU,
                pin : process.env.PIN_LINKQU, 
                customer_phone : "081231857418",
                customer_email : "cto@linkqu.id"
            }
          })
          res.send(result.data)
    }
    static async createVirtualAccountOB(req, res, next){
        let expired = moment().tz("Asia/Jakarta").add(2, 'hours').format("YYYYMMDDHHmmss")
        let url = `${process.env.URL_LINKQU}/linkqu-partner/transaction/create/va`
        let result = await axios({
            method: 'post',
            url,
            headers,
            data: {
                amount : 25000,
                partner_reff : "200102083952562712182",
                customer_id : "31857118",
                customer_name : "GPI",
                expired,
                username : process.env.USERNAME_LINKQU,
                pin :  process.env.PIN_LINKQU,
                customer_phone : "081231857418",
                customer_email : "cto@linkqu.id",
                bank_code : "014"
            }
          })
          res.send(result.data)
    }
    static async createVirtualAccountDedicated(req, res, next){
        let url = `${process.env.URL_LINKQU}/linkqu-partner/transaction/create/vadedicated/add`
        let result = await axios({
            method: 'post',
            url,
            headers,
            data: {
                customer_id : "001",
                customer_name : "Fauza Riawan",
                username : process.env.USERNAME_LINKQU,
                pin : process.env.PIN_LINKQU,
                customer_phone : "081231857418",
                customer_email : "cto@linkqu.id",
                bank_code : "008"
            }
          })
          res.send(result.data)
    }
    static async updateVirtualAccountDedicated(req, res, next){
        let url = `${process.env.URL_LINKQU}/linkqu-partner/transaction/create/vadedicated/update`
        let result = await axios({
            method: 'post',
            url,
            headers,
            data: {
                customer_id : "001",
                customer_name : "Fauza Riawan",
                username : process.env.USERNAME_LINKQU,
                pin : process.env.PIN_LINKQU,
                customer_phone : "081231857418",
                customer_email : "cto@linkqu.id",
                bank_code : "008"
            }
          })
          res.send(result.data)
    }
    static async callback(req, res, next){
        let data = req.body
        let result = JSON.parse(data)
        let response = {
            "response" : "OK"
          }
        res.send(response)
    }
    static async simulateInqBill(req, res, next){
        let url = 'https://gateway-dev.linkqu.id/simulator/apisim/permata/inq'
        let result = await axios({
            method: 'post',
            url,
            headers,
            data: {
                "nova":"713604000000008"
            }
          })
          res.send(result.data)
    }
    static async simulatePayBill(req, res, next){
        let url = 'https://gateway-dev.linkqu.id/simulator/apisim/permata/pay'
        let result = await axios({
            method: 'post',
            url,
            headers,
            data: {
                "nova":"713604000000008",
                "amount":"52000"
            }
          })
          res.send(result.data)
    }
    static async inqTransferBank(req, res, next){
        let {code, norek, nominal} = req.body
        console.log(code, norek, nominal)
        let user = req.logedInUser
        console.log(user)
      
        let reseller = await models.pengirim.findOne({
            where: {
            kode_reseller: user.kode_reseller,
            tipe_pengirim: 'Y'
            },
            include: "reseller",
        });
      if (reseller.reseller.saldo > Number(nominal)){
        let url = `${process.env.URL_LINKQU}/linkqu-partner/transaction/withdraw/inquiry`
        let result = await axios({
            method: 'post',
            url,
            headers,
            data: {
                username : process.env.USERNAME_LINKQU,//"LI307GXIN",
                pin : process.env.PIN_LINKQU,//"2K2NPCBBNNTovgB",
                bankcode : code, //"008",
                accountnumber : norek, //"1234566788234",
                amount : nominal, // 50000,
                partner_reff : getTransactionId()
            }
          })
          console.log(result.data)
          if(result.data.response_code == '00'){
              res.status(200).json(result.data)
          }else{
              res.status(400).json(result.data)
          }
      }else {
        console.log('saldo tidak cukup')
        res.status(400).json({pesan:"saldo tidak cukup"})
      }
    }
    static async payTransferBank(req, res, next){
        if(req.logedInUser){
            let {bankcode, accountnumber, amount, partner_reff, inquiry_reff, remark} = req.params
            console.log(bankcode, accountnumber, amount, partner_reff, inquiry_reff, remark)
            let url = `${process.env.URL_LINKQU}/linkqu-partner/transaction/withdraw/payment`
            let result = await axios({
                method: 'post',
                url,
                headers,
                data: {
                    username : process.env.USERNAME_LINKQU,
                    pin : process.env.PIN_LINKQU,
                    bankcode,
                    accountnumber,
                    amount,
                    partner_reff,
                    inquiry_reff,
                    remark
                }
            })
            console.log(result.data)
            res.send(result.data)
        }else{
            console.log('Kamu siapa ??, kamu siapa ??')
            res.send('Kamu siapa ??, kamu siapa ??')
        }
    }
    static async payTransferBankDQ(req, res, next){
        let url = `${process.env.URL_LINKQU}/linkqu-partner/transaction/withdraw/payment/queue`
        let result = await axios({
            method: 'post',
            url,
            headers,
            data: {
                username : process.env.USERNAME_LINKQU,
                pin : process.env.PIN_LINKQU,
                bankcode : "014",
                accountnumber : "7205022155",
                amount : 50000,
                partner_reff : "452221231233402"
            }
          })
          res.send(result.data)
    }
    static async callbackTransferBank(req, res, next){
        let result = req.body
        let data = JSON.parse(result)
        res.send(data)
    }
}

module.exports = LinkquController