const {inbox, outbox, transaksi, reseller} = require('../models')
var CronJob = require('cron').CronJob;

class DbWatch{
	static async watchInsert(req, res){
		try {
			let result = await transaksi.findAll()
			let jumlah = result.length
			let job = new CronJob('* * * * * *', async function() {
				let result = await transaksi.findAll()
				if(result.length > jumlah){
					console.log('ada penambahan data')
					jumlah = result.length
				}else{
					console.log('tidak ada penambahan data')
				}
			}, null, true, 'America/Los_Angeles');
			job.start();
		} catch (error) {
			res.send(error)
		}
	}
}

module.exports = DbWatch;