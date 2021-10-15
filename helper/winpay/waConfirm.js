const axios = require('axios')

function waConfirm(notelp, kode) {
  return axios({
    method: 'post',
    url: 'https://eu194.chat-api.com/instance206284/sendMessage?token=6xg7gkf9qxi5qvum',
    data: {
      phone: notelp,
      body: `ini Pin baru kamu ${kode}`
    }
  })
}

module.exports = { waConfirm }