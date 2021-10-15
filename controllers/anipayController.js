const axios = require('axios')
const moment = require('moment-timezone')

class anipayController{
    static async login(req, res, next){
        try {
                let result = await axios({
                    method:'POST',
                    url:process.env.URL_ANIPAY,
                    headers:{
                        'content-type':'application/json'
                    },
                    data:{
                        "method":'1000',
                        "username":process.env.USERNAME_ANIPAY,
                        "password":process.env.PASSWORD_ANIPAY,
                        "coid":process.env.COID
                    }
            })

            res.status(200).json({
                "Header":result.headers,
                "Data":result.data
                })
                // res.send(result.headers)
              // r  es.send(result.data)
          } catch (error) {
                res.send(error)
            }
        }
    
       static async  balance(req, res, next){
           try  {
                let sessionid = await axios({
                    method:'POST',
                    url:process.env.URL_ANIPAY, // ini url production
                    headers:{
                        'content-type':'application/json'
                    },
                data:{
                    "method":process.env.BALANCE,
                    "username":process.env.USERNAME_ANIPAY,
                    "password":process.env.PASSWORD_ANIPAY,
                    "coid":process.env.COID
                }
            })
            
            if(req.query){
                let data = req.query.data.split(',')
                let result = await axios({
                    method:'POST',
                    url:process.env.URL_ANIPAY,
                    headers:{
                        'content-type':'application/json',
                        'SessionID':sessionid.headers.sessionid
                    },
                    data:{
                        "method":`${data[0]}`,
                        "reg_no":`${data[1]}`
            
                    }
                })
                res.send(result.data)
            }else{
               res.send('data tidak ada')
            }
            
        } catch (error) {
            res.send(error)
        }
    }

    static async pulsaPrepaid(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'F942F78ADECF1B45081914FB17BD52C6FA072E7D3CFA464202CE95182EE474C6'
                },
                data:{
                    "method":'1141',
                    "reg_no":'066000000000003',
                    "traceNo":"uyt76hhu8", // sequencial number / nomor urut transaksi dari Mitra → string(6 char)
                    "processing_code":"299", //  kode transaksi (“299” untuk pulsa prepaid) → string(3 char)
                    "product":"SIMPATI", // jenis operator (sesuaikan tabel)   → string
                    "billing_code":"081237278172",  // nomor HP pelanggan yang akan di topup  → string 
                    "amount":"10000", //  denominasi yang akan di topup (sesuaikan tabel) → string
                    "tidTransaction":"6468989", // terminal id frontend    → string(8 char)
                    "trxdatetime":"2021-01-26 13:14:15" //  tanggal dan waktu transaksi   → yyyymm-dd HH:mm:ss 

                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryPlnPrepaid(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'411083A8EE6382EE8D668E63ED806C0534E8B4B0CA624281B74BFE282520FF4A'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"352",
                    "product":"PLN",
                    "billing_code":"551111111111",
                    "amount":"20000",
                    "tidTransaction":"PLNPRE01",
                    "trxdatetime":"2016-09-25 13:14:15" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async paymentPlnPrepaid(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'0024550791695DDFBCD038119460DFFD5E77585C7BFD0E5A3FE50C83CC7C3768'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"300",
                    "product":"PLN",
                    "billing_code":"551111111111",
                    "amount":"20000",
                    "tidTransaction":"PLNPRE01",
                    "trxdatetime":"2016-09-25 13:14:15" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryPlnPostpaid(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'4C2F7B50FF80BDCBD2E35060DE3FF3ECE0E0B3DC78C0DC5F46DA8B3F12EE2F8F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"301",
                    "product":"PLN",
                    "billing_code":"211111125251",
                    "tidTransaction":"PPOST001",
                    "trxdatetime":"2016-09-25 13:14:15" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async paymentPlnPostpaid(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'4C2F7B50FF80BDCBD2E35060DE3FF3ECE0E0B3DC78C0DC5F46DA8B3F12EE2F8F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"302",
                    "product":"PLN",
                    "billing_code":"211111125251",
                    "tidTransaction":"PPOST001",
                    "trxdatetime":"2016-09-25 13:14:15" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryPlnNontaglis(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'08B593216C8DDA45AF50968415C86C5681C6B1A4BDC2666559B417A2C32069C3'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"303",
                    "product":"PLN",
                    "billing_code":"5221111006630",
                    "tidTransaction":"PNTAG001",
                    "trxdatetime":"2016-09-25 13:14:15" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async paymentPlnNontaglis(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"304",
                    "product":"PLN",
                    "billing_code":"551111111111",
                    "trxdatetime":"2016-09-25 13:14:15" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryMultifinance(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'26526973FCE0E254C8A9A0655AB3F719FABE5D36B530F34BF61C8FEC40B78535'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"310",
                    "product":"BAF",
                    "billing_code":"213010068573",
                    "amount":"",
                    "tidTransaction": "BAF00001",
                    "trxdatetime":"2016-09-25 13:14:15" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async paymentMultifinance(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'26526973FCE0E254C8A9A0655AB3F719FABE5D36B530F34BF61C8FEC40B78535'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"311",
                    "product":"BAF",
                    "billing_code":"213010068573",
                    "amount":"",
                    "tidTransaction": "BAF00001",
                    "trxdatetime":"2016-09-25 13:14:15" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryTelkom(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"312",
                    "product":"Telepon",
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction":"TEL00001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async paymentTelkom(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"313",
                    "product":"Telepon",
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction":"TEL00001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryPdam(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"346",
                    "product":"Telepon",
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction":"PDAM0001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async paymentPdam(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"347",
                    "product":"Telepon",
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction":"PDAM0001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryHpPascabayar(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"348",
                    "product":"TELKOMSEL", 
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction": "HALO0001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async paymentHpPascabayar(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"349",
                    "product":"TELKOMSEL", 
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction": "HALO0001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryTvBerbayar(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"350",
                    "product":"INDOVISION", 
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction": "TV000001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async paymentTvBerbayar(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"351",
                    "product":"INDOVISION", 
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction": "TV000001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryBpjsKesehatan(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"314",
                    "product":"BPJSKS", 
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction": "BPKS0001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async paymentBpjsKesehatan(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'D6A75B801D30F8E61F6B41185D9EA67FFD7D8D1F8E9D0900BD5CA0AE54523A5F'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"315",
                    "product":"BPJSKS", 
                    "billing_code":"551111111111",
                    "amount":"",
                    "trxdatetime":"2016-09-25 13:14:15" ,
                    "tidTransaction": "BPKS0001" 
                }
            })
            res.send(result.data)
        } catch (error) {
            res.send(error)
        }
    }

    static async inquiryTransfer(req, res, next){
        try {
            let sessionid = await axios({
                method:'POST',
                url:process.env.URL_ANIPAY, // ini url production
                headers:{
                    'content-type':'application/json'
                },
                data:{
                    "method":'1000',
                    "username":process.env.USERNAME_ANIPAY,
                    "password":process.env.PASSWORD_ANIPAY,
                    "coid":process.env.COID
                }
            })
            if(req.query){
                let data = req.query.data.split(',')
                let test = await axios({
                    method:'POST',
                    url:process.env.URL_ANIPAY,
                    headers:{
                        'content-type':'application/json',
                        'SessionID':sessionid.headers.sessionid
                    },
                    data:{
                        "method": `${data[0]}`,
                        "reg_no": `${data[1]}`,
                        "traceNo":`${data[2]}`,
                        "processing_code":`${data[3]}`,
                        "product":`${data[4]}`,
                        "billing_code":`${data[5]}`,
                        "bank_code":`${data[6]}`,
                        "amount":`${data[7]}`,
                        "senderAmount":`${data[8]}`,
                        "senderCurrency":`${data[9]}`,
                        "senderID":"",
                        "senderName":"",
                        "news":"Test",
                        "sof":"Jakarta",
                        "trxdatetime":moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS")
                    }
                })
                res.send(test.data)
            }else{
                res.send('data tidak ada')
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = anipayController