const models = require("../models");
const Op = require("sequelize").Op;

module.exports = {
	listInfo: (req, res, next) => {
		models.p_info
		.findAll()
		.then((data) => {
			res.status(200).json({
				message: "Get All Info",
				data,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
			});
		});
	},
	
	getInfo: (req, res, next) => {
		const id = req.params.id;
		models.p_info
		.findOne({
			where: {
				code_info: id
			},
		})
		.then((data) => {
			res.status(200).json({
				message: "Get Single Info",
				data,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
			});
		});
	},
	
	listBanner: (req, res, next) => {
		models.p_banner
		.findAll({})
		.then((data) => {
			res.status(200).json({
				message: "Get All Banner",
				data,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
			});
		});
	},
	
	getBanner: (req, res, next) => {
		const id = req.params.id;
		models.p_banner
		.findOne({
			where: {
				code_banner: id
			},
		})
		.then((data) => {
			res.status(200).json({
				message: "Get Single Banner",
				data,
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: err.message,
			});
		});
	},
};