const axios = require('axios')

class grdvControllers{
    static async login(req, res, next){
        try {
            let username = req.body.username//process.env.USERNAME_GRDV//'testgrdv'//
            let password = req.body.password//process.env.PASSWORD_GRDV//'testgrdv123'//
            let result = await axios.get(`https://app.grv.co.id/api/main/login?username=${username}&password=${password}`)
            let data = JSON.parse(JSON.stringify(result.data)) // kalau ngehit ke PHP hasilnya harus di buat kayak gini dulu
            console.log(data)
            return data
        } catch (error) {
            res.send(error)
        }
    }

    static rincianAkun(req, res, next){
        grdvControllers.login()
        .then((response)=>{
            let auth_token = response.results.token
            let auth_username = process.env.USERNAME_GRDV//'testgrdv'
            return axios.get(`https://app.grv.co.id/api/main/account?auth_username=${auth_username}&auth_token=${auth_token}`)
        })
        .then((response)=>{
            let data = JSON.parse(JSON.stringify(response.data)) // kalau ngehit ke PHP hasilnya harus di buat kayak gini dulu
            res.send(data)
        })
        .catch((error)=>{
            res.send(error)
        })
    }

    static async daftarProduk(req, res, next){
        grdvControllers.login()
        .then((response)=>{
            let auth_token = response.results.token
            let auth_username = process.env.USERNAME_GRDV //'testgrdv'
            return axios.get(`https://app.grv.co.id/api/main/get-vouchers?auth_username=${auth_username}&auth_token=${auth_token}`)
        })
        .then((response)=>{
            let data = JSON.parse(JSON.stringify(response.data)) // kalau ngehit ke PHP hasilnya harus di buat kayak gini dulu
            res.send(data)
        })
        .catch((error)=>{
            res.send(error)
        })
    }

    static async pembelian(req, res, next){
        grdvControllers.login()
        .then((response)=>{
            let auth_token = response.results.token
            let auth_username = process.env.USERNAME_GRDV
            let voucher_id = req.body.voucher_id // (Required) ID Voucher lihat di daftar harga (id)
            let phone = req.body.phone // (Required) Nomor HP pembeli atau nomor HP yang akan diisi ulang
            let id_plgn = req.body.id_plgn // (Optional) ID Pelanggan untuk order token PLN / Tagihan payment
            let payment = req.body.payment // (Required) Static=balance
            return axios.get(`https://app.grv.co.id/api/main/order?auth_username=${auth_username}&auth_token=${auth_token}&voucher_id=${voucher_id}&phone=${phone}&id_plgn=${id_plgn}&payment=${payment}`)
        })
        .then((response)=>{
            let data = JSON.parse(JSON.stringify(response.data)) // kalau ngehit ke PHP hasilnya harus di buat kayak gini dulu
            res.send(data)
        })
        .catch((error)=>{
            res.send(error)
        })
    }

    static async cekTransaksi(req, res, next){
        grdvControllers.login()
        .then((response)=>{
            let auth_token = response.results.token
            let auth_username = process.env.USERNAME_GRDV
            let id = req.body.id // (Required) ID Transaksi yang didapat ketika pembelian (results.id)
            return axios.get(`https://app.grv.co.id/api/main/transaction-details?auth_username=${auth_username}&auth_token=${auth_token}&id=${id}`)
        })
        .then((response)=>{
            let data = JSON.parse(JSON.stringify(response.data)) // kalau ngehit ke PHP hasilnya harus di buat kayak gini dulu
            res.send(data)
        })
        .catch((error)=>{
            res.send(error)
        })
    }
}

module.exports = grdvControllers;