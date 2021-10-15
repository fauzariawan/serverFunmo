class anipayTest{
    static async testInquiryTransfer(req, res, next){
        try {
            let result = await axios({
                method:'POST',
                url:`http://188.166.251.24:17094/apih2h/anipay/`,
                headers:{
                    'content-type':'application/json',
                    'SessionID':'44EA83D4FAB434C68E60168912D0A0AC17D59995AEA03DBEA83405EACA8CFA37'
                },
                data:{
                    "method": "1141",
                    "reg_no": "066000000000003",
                    "traceNo":"123456",
                    "processing_code":"340",
                    "product":"REMITTANCE",
                    "billing_code":"5465327020",
                    "bank_code":"014",
                    "amount":"20000",
                    "senderAmount":"20000",
                    "senderCurrency":"IDR",
                    "senderID":"",
                    "senderName":"",
                    "news":"Test",
                    "sof":"Jakarta",
                    "trxdatetime":"2016-09-25 13:14:15"
                }
            })
            res.send(result.data) 
        } catch (error) {
            res.send(error)
        }
    }
    
    static async paymentTransfer(req, res, next){
        try {
            if(req.query){
                let data = req.query.data.split(",")
                let test = await axios({
                    method:'POST',
                    url:`http://188.166.251.24:17094/apih2h/anipay/`,
                    headers:{
                        'content-type':'application/json',
                        'SessionID':'44EA83D4FAB434C68E60168912D0A0AC17D59995AEA03DBEA83405EACA8CFA37'
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
                        "trxdatetime":`${data[10]}`
                    }
                })
                res.send(test.data)
            }else{
                res.send('tidak ada data')
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    static async Transfer(req, res, next){
        try {
            if(req.query){
                let data = req.query.data.split(",")
                let test = await axios({
                    method:'POST',
                    url:`http://188.166.251.24:17094/apih2h/anipay/`,
                    headers:{
                        'content-type':'application/json',
                        'SessionID':'44EA83D4FAB434C68E60168912D0A0AC17D59995AEA03DBEA83405EACA8CFA37'
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
                        "trxdatetime":`${data[10]}`
                    }
                })
                res.send(test.data)
            }else{
                res.send('tidak ada data')
            }
        } catch (error) {
            console.log(error)
        }
    }
}