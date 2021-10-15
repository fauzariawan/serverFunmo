const models = require("../models");
const Op = require("sequelize").Op;
//function (io)

module.exports = {
	
	reportDeposit: async (req, res, next) => {
		try {
			let id = req.params.id;
			models.tiket_deposit.findAll({
				where: {
					kode_reseller: id,
					id_transaksi: {
						[Op.ne]: null
					}
				},
				order: [
					['waktu', 'desc']
				],
				attributes: ["kode", "waktu", "jumlah", "status", "tgl_status", "kode_pembayaran"],
				include: ["bank",
				{
					model: models.inbox,
					as: "inbox",
					limit: 1,
					separate: false,
					attributes: ["kode", "tgl_entri", "pesan", "tgl_status"]
				}, {
					model: models.reseller,
					as: "reseller",
					limit: 1,
					separate: false,
					attributes: ["kode", "nama"]
				}, {
					model: models.transaksi,
					as: "transaksi",
					limit: 1,
					separate: false,
					attributes: ["kode", "tgl_entri", "tujuan", "harga", "tgl_status", "harga_beli", "saldo_awal", "qty", "harga_beli2", "keterangan"]
				}
			]
		}).then((data) => {
			res.status(200).json({
				message: "Get Report Deposit",
				data,
			});
		})
	} catch (e) {
		res.json({
			error: e.message
		})
	}
},

getDeposit: (req, res, next) => {
	try {
		let id = req.params.id;
		models.tiket_deposit.findOne({
			where: {
				kode: id,
			},
			attributes: ["kode", "waktu", "jumlah", "status", "tgl_status", "kode_pembayaran"],
			include: ["bank",
			{
				model: models.inbox,
				as: "inbox",
				limit: 1,
				separate: false,
				attributes: ["kode", "tgl_entri", "pesan", "tgl_status"]
			}, {
				model: models.reseller,
				as: "reseller",
				limit: 1,
				separate: false,
				attributes: ["kode", "nama"]
			}, {
				model: models.transaksi,
				as: "transaksi",
				limit: 1,
				separate: false,
				attributes: ["kode", "tgl_entri", "tujuan", "harga", "tgl_status", "harga_beli", "saldo_awal", "qty", "harga_beli2", "keterangan"]
			}
		]
	}).then((data) => {
		res.status(200).json({
			message: "Get Report Deposit",
			data,
		});
	})
} catch (e) {
	res.json({
		error: e.message
	})
}
},

reportTransaction: async (req, res, next) => {
	try {
		let id = req.params.id;
		models.transaksi.findAll({
			where: {
				kode_reseller: id,
				harga_beli: {
					[Op.ne]: 0
				},
				status: 20
			},
			order: [
				['tgl_entri', 'desc']
			],
			attributes: ["kode", "tgl_entri", "tujuan", "harga", "status", "harga_beli", "saldo_awal", "sn", "qty", "ref_id", "harga_beli2", "poin"],
			include: [{
				model: models.produk,
				as: "product",
				limit: 1,
				separate: false,
				attributes: ["nama", "harga_jual", "harga_beli"]
			}]
		}).then((data) => {
			res.status(200).json({
				message: "Get Report Transaction",
				data,
			});
		})
	} catch (e) {
		res.json({
			error: e.message
		})
	}
},

getTransaction: async (req, res, next) => {
	try {
		let id = req.params.id;
		models.transaksi.findOne({
			where: {
				kode: id
			},
			attributes: ["kode", "tgl_entri", "tujuan", "harga", "tgl_status", "harga_beli", "saldo_awal", "qty", "harga_beli2", "keterangan"],
			include: [{
				model: models.reseller,
				as: "reseller",
				limit: 1,
				separate: false,
				attributes: ["kode", "nama"]
			}, {
				model: models.produk,
				as: "product",
				limit: 1,
				separate: false,
				attributes: ["kode", "nama", "harga_jual", "harga_beli"]
			}]
		}).then((data) => {
			res.status(200).json({
				message: "Get Report Transaction",
				data,
			});
		})
	} catch (e) {
		res.json({
			error: e.message
		})
	}
},

reportMutation: async (req, res, next) => {
	try {
		let id = req.params.id;
		models.mutasi.findAll({
			where: {
				kode_reseller: id,
			},
			order: [
				['tanggal', 'desc']
			],
			include: [{
				model: models.reseller,
				as: "reseller",
				limit: 1,
				separate: false,
				attributes: ["kode", "nama", "saldo"]
			}, {
				model: models.transaksi,
				as: "transaksi",
				limit: 1,
				separate: false,
				attributes: ["kode", "tgl_entri", "tujuan", "harga", "status", "harga_beli", "saldo_awal", "sn", "qty", "ref_id", "harga_beli2", "poin"],
			}, "outbox"]
		}).then((data) => {
			res.status(200).json({
				message: "Get Report Mutation",
				data,
			});
		}).catch((err) => {
			res.status(500).json({
				message: err.message,
			});
		});
	} catch (e) {
		res.json({
			error: e.message
		})
	}
},

getMutation: async (req, res, next) => {
	try {
		let id = req.params.id;
		models.mutasi.findOne({
			where: {
				kode: id,
			},
			order: [
				['tanggal', 'desc']
			],
			include: [{
				model: models.reseller,
				as: "reseller",
				limit: 1,
				separate: false,
				attributes: ["kode", "nama", "saldo"]
			}, {
				model: models.transaksi,
				as: "transaksi",
				limit: 1,
				separate: false,
				attributes: ["kode", "tgl_entri", "tujuan", "harga", "status", "harga_beli", "saldo_awal", "sn", "qty", "ref_id", "harga_beli2", "poin"],
			}, "outbox"]
		}).then((data) => {
			res.status(200).json({
				message: "Get Report Mutation",
				data,
			});
		}).catch((err) => {
			res.status(500).json({
				message: err.message,
			});
		})
		} catch (e) {
			res.json({
				error: e.message
			})
		}
	}
}