const axios = require('axios')

class inquiryController{
	static async inquiryPlnPrepaid (req, res, next){
		try {
			let idtrx = '12345'
			let tujuan = req.body.tujuan//'50171180313'
			let kodeproduk = req.body.kodeproduk//'PLNPREPAID'
			
			let data = await axios({
				method:'get',
				url:`https://funmo.co.id/ppob/inq.php?idtrx=${idtrx}&tujuan=${tujuan}&kodeproduk=${kodeproduk}`
			})
			res.send(data.data)
		} catch (error) {
			res.send(error)
		}
	}
	
}

module.exports = inquiryController