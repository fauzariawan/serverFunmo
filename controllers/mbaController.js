const axios = require("axios");
const convert = require('xml-js');
const {getTransactionId} = require('../helper/getTrxId')

class mba{
    static async tes(req, res, next){
        try {
            let trxId = getTransactionId()
            let option = {compact: true, spaces: 2}
            let option2 = {compact: true, spaces: 2, ignoreComment: true, alwaysChildren: true, ignoreDeclaration: true, ignoreAttributes: true}
            let xmls=`<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema- instance"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
            <YtzTopupRequest xmlns="http://ytz.org/">
            <msisdn>087869461708</msisdn>
            <productCode>XAMC5</productCode>
            <userID>${process.env.USER_ID_MBA}</userID>
            <userPassword>${process.env.PASS_MBA}</userPassword>
            <clientRefID>TRXA0003</clientRefID>
            <storeid>${process.env.STORE_ID}</storeid>
            </YtzTopupRequest>
            </soap:Body>
            </soap:Envelope>`;

            axios.post('http://103.253.113.20:8081/api/YtzService.asmx?wsdl', xmls, {
            headers: {'Content-Type': 'text/xml'}
            }).then(response=>{
                let result1 = JSON.parse(convert.xml2json(response.data, option2));
                res.send(result1['soap:Envelope']['soap:Body']['YtzTopupRequestResponse']['YtzTopupRequestResult']);
                // console.log(result1['_declaration']);
                // console.log(response.data)
                // var xmlText = res.data;
                // var jsonObj = x2js.xml2json(xmlText)
                // res.send(jsonObj);
            }).catch(err=>{console.log(err)});
        } catch (error) {
            res.send(error)
        }
    }

    static async cekTransaksi(req, res, next){
        try {
            let option2 = {compact: true, spaces: 2, ignoreComment: true, alwaysChildren: true, ignoreDeclaration: true, ignoreAttributes: true}
            let xmls = `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema- instance"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
            <YtzTransactionStatus xmlns="http://ytz.org/">
            <transID>00000000194281111</transID>
            <userID>${process.env.USER_ID_MBA}</userID>
            <userPassword>${process.env.PASS_MBA}</userPassword>
            </YtzTransactionStatus>
            </soap:Body>
            </soap:Envelope>`
            
            axios.post('http://103.253.113.20:8081/api/YtzService.asmx?wsdl', xmls, {
            headers: {'Content-Type': 'text/xml'}
            }).then(response=>{
                let result1 = JSON.parse(convert.xml2json(response.data, option2));
                res.send(result1);
                // console.log(result1['_declaration']);
                // console.log(response.data)
                // var xmlText = res.data;
                // var jsonObj = x2js.xml2json(xmlText)
                // res.send(jsonObj);
            }).catch(err=>{console.log(err)});
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = mba