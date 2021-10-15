const axios = require('axios')
var cron = require('node-cron');
// var request = require('request');

async function getPaymentCode(paymentMethod, data) {
  let result
  let final

  console.log('<<<<<<<<< lagi generate payment code >>>>>>>>')
  result = await axios({
    method: 'post',
    url: paymentMethod,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: `orderdata=${data}`
  })
  let status = result.status
  let headers = JSON.parse(JSON.stringify(result.headers))
  let response = JSON.parse(JSON.stringify(result.data))
  final = {
    status,
    headers,
    response
  }
  return final

  // console.log('<<<<<<<<<<<<<<<<<<<<<<<< menunggu result >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  // request({
  //   method: 'POST',
  //   url: paymentMethod,
  //   headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  //   },
  //   body: `orderdata=${data}`
  // }, function (error, response, body) {
  //   console.log('Status:', response.statusCode);
  //   console.log('Headers:', JSON.stringify(response.headers));
  //   console.log('Response:', body);
  // });
}

module.exports = { getPaymentCode }