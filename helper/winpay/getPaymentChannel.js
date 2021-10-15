const axios = require('axios')

async function getPaymentChannel(auth) {
  try {
    let result = await axios({
      method: 'get',
      url: 'https://secure-payment.winpay.id/toolbar',
      headers: {
        'Content-Type': 'text/plain',
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
    return data
  } catch (error) {
    return error
  }
}

module.exports = { getPaymentChannel }