// // Reading the file using default
// // fs npm package
// const fs = require("fs");
// csv = fs.readFileSync("migrasi.csv")

// // Convert the data to String and
// // split it in an array
// var array = csv.toString().split("\r");

// // All the rows of the CSV will be
// // converted to JSON objects which
// // will be added to result in an array
// let result = [];

// // The array[0] contains all the
// // header columns so we store them
// // in headers array
// let headers = array[0].split(", ")

// // Since headers are separated, we
// // need to traverse remaining n-1 rows.
// for (let i = 1; i < array.length - 1; i++) {
// let obj = {}

// // Create an empty object to later add
// // values of the current row to it
// // Declare string str as current array
// // value to change the delimiter and
// // store the generated string in a new
// // string s
// let str = array[i]
// let s = ''

// // By Default, we get the comma separated
// // values of a cell in quotes " " so we
// // use flag to keep track of quotes and
// // split the string accordingly
// // If we encounter opening quote (")
// // then we keep commas as it is otherwise
// // we replace them with pipe |
// // We keep adding the characters we
// // traverse to a String s
// let flag = 0
// for (let ch of str) {
// 	if (ch === '"' && flag === 0) {
// 	flag = 1
// 	}
// 	else if (ch === '"' && flag == 1) flag = 0
// 	if (ch === ', ' && flag === 0) ch = '|'
// 	if (ch !== '"') s += ch
// }

// // Split the string using pipe delimiter |
// // and store the values in a properties array
// let properties = s.split("|")

// // For each header, if the value contains
// // multiple comma separated data, then we
// // store it in the form of array otherwise
// // directly the value is stored
// for (let j in headers) {
// 	if (properties[j].includes(", ")) {
// 	obj[headers[j]] = properties[j]
// 		.split(", ").map(item => item.trim())
// 	}
// 	else obj[headers[j]] = properties[j]
// }

// // Add the generated object to our
// // result array
// result.push(obj)
// }

// // Convert the resultant array to json and
// // generate the JSON output file.
// let json = JSON.stringify(result);
// fs.writeFileSync('output.json', json);
const moment = require('moment-timezone')
const e = require('express')
const fs = require('fs')
// let reseller = []
// let fixDataReseller = []
// let dataMigrasi = fs.readFileSync('./dataResellerFix.csv', 'utf-8').split('\r\n')
// let dataReseller = dataMigrasi.slice(1, dataMigrasi.length - 1)
// let filter = []
// let pengirimSms = []
// dataReseller.map(el => {
// 	reseller.push(el.split(';'))
// })
// console.log(reseller[0])

// //  migrasi data pada tanggal 11/10/2021 //
// reseller.map(el =>{
// 	const tgl_daftar = moment(el[9], 'YYYY-MM-DD').toDate();
// 	const tgl_data = moment(el[23], 'YYYY-MM-DD').toDate()
// 	fixDataReseller.push({
// 		"kode":el[0] == 'NULL' ? null : el[0],
// 		"nama":el[1] == 'NULL' ? null : el[1],
// 		"saldo":0,
// 		"alamat":el[3] == 'NULL' ? null : el[0] == 'FUN446' ? 'Tks_-_MEDAN AREA_KOTA MEDAN_SUMATERA UTARA' : el[3],
// 		"pin":el[4] == 'NULL' ? null : el[4], 
// 		"aktif":1,
// 		"kode_upline":el[6] == 'NULL' ? null : el[6],
// 		"kode_level":el[7] == 'NULL' ? null : el[7],
// 		"keterangan":el[8] == 'NULL' ? null : el[8],
// 		"tgl_daftar":el[9] == 'NULL' ? null : tgl_daftar,
// 		"saldo_minimal":0,
// 		"tgl_aktivitas":el[11] == 'NULL' ? null : el[11],
// 		"pengingat_saldo":el[12] == 'NULL' ? null : el[12],
// 		"f_pengingat_saldo":el[13] == 'NULL' ? null : el[13],
// 		"nama_pemilik":el[14] == 'NULL' ? null : el[14],
// 		"kode_area":el[15] == 'NULL' ? null : el[15],
// 		"tgl_pengingat_saldo":el[16] == 'NULL' ? null : el[16],
// 		"markup":el[17] == 'NULL' ? null : el[17],
// 		"oid":el[18] == 'NULL' ? null : el[18],
// 		"poin":0,
// 		"alamat_ip":el[20] == 'NULL' ? null : el[20],
// 		"password_ip":el[21] == 'NULL' ? null : el[21],
// 		"url_report":el[22] == 'NULL' ? null : el[22],
// 		"tgl_data":el[23] == 'NULL' ? null : tgl_data,
// 		"suspend":el[24] == 'NULL' ? null : el[24],
// 		"ip_no_sign":el[25] == 'NULL' ? null : el[25],
// 		"deleted":el[26] == 'NULL' ? null : el[26],
// 		"nomor_ktp":el[27] == 'NULL' ? null : el[27],
// 		"npwp":el[28] == 'NULL' ? null : el[28]
// 	})
// })

// console.log(fixDataReseller[0])
// let json = JSON.stringify(fixDataReseller, null, 2)
// fs.writeFileSync('dataResellerFix.json', json);

///// untuk data Pengirim //////////////////////////////////////////////////////////////////
let pengirim = []
let fixDataPengirim = []
let dataMigrasi = fs.readFileSync('./pengirimSmsFix.csv', 'utf-8').split('\r\n')
let dataPengirim = dataMigrasi.slice(1, dataMigrasi.length - 1)
let filter = []
let pengirimSms = []
dataPengirim.map(el => {
	pengirim.push(el.split(';'))
})
console.log(pengirim[0])

pengirim.map(el =>{
	// let cleanDash
	// let cleanSpasi
	let cekSpasi = el[0].includes(" ")
	let cekDash = el[0].includes("-")
	let cekDoubleKode = el[0].split("+")
	cleanKode = el[0].split('+')
	cek = el[0].includes(['^0-9,+'])
	if(cekSpasi == false && cekDash == false && cekDoubleKode.length == 2){
		pengirim = `0${cleanKode[1]}@funmo.co.id`
		fixDataPengirim.push({
			"pengirim": pengirim,
			"tipe_pengirim": "Y",
			"kode_reseller": el[2],
			"kirim_info": Number(el[3]),
			"tgl_data": el[4] == 'NULL' ? null : el[4],
			"akses" : el[5] == 'NULL' ? null : el[5]
		})
	}
})

console.log(fixDataPengirim[0])
let json = JSON.stringify(fixDataPengirim, null, 2)
fs.writeFileSync('dataPengirimSmsFix.json', json);

fixDataPengirim.map(pengirim => {
	if(pengirim.pengirim == '+6281375630807'){
		filter.push(pengirim)
	}
})

console.log(filter, filter.length)

// reseller.map(el =>{
// 	let no = el[0].substring(1,el[0].length-1);
// 	let kode = el[0].substring(1,el[0].length-1)
// 	let status = el[10].substring(0,el[10].length-1)
// 	let markup = el[4].substring(1,el[4].length-1)
// 	let saldo = el[3].substring(1,el[3].length-1)
	
// 	fixDataReseller.push({
// 		// "no":no, 
// 		"id":el[1], 
// 		"kode":`FUN${kode.replace('.','')}`,
// 		"nama": el[2],
// 		"saldo" : saldo.includes('-') ? 0 : Number(saldo.replace('.','')),
// 		"alamat": `${el[18]}&NULL&${el[14]}&${el[15]}&${el[16]}`,
// 		"pin": '123123',
// 		"aktif": status ? 1 : 0,
// 		"kode_upline": el[6],
// 		"kode_level": 'O',
// 		"keterangan": null,
// 		// "tgl_daftar": null,
// 		// "saldo_minimal": null,
// 		"tgl_aktivitas": null,
// 		"nama_pemilik": null,
// 		"kode_area" : null,
// 		"markup": markup.includes('-') ? 0 : Number(markup),
// 		"oid": null,
// 		"poin": Number(el[5].substring(1,el[5].length-1)),
// 		"alamat_ip": null,
// 		"password_ip": null,
// 		"url_report": null,
// 		"suspend" : null,
// 		"ip_no_sign": null,
// 		"deleted": null,
// 		"nomor_ktp": null,
// 		"npwp": null,
// 		// "nama_upline": el[7],
// 		// "gropup_sales": el[8],
// 		// "type": el[9],
// 		// "device_multi": el[11] == 'YES' ? 1 : 0,
// 		// "komisi": el[12].substring(1,el[12].length-1),
// 		"pengirim": el[13].substring(0,el[13].length-2),
// 		// "region": el[17]
// 	})
// })

// let pembanding = fixDataReseller
// for (let i = 0; i < fixDataReseller.length; i++) {
// 	for (let j = 0; j < pembanding.length; j++) {
// 		if(fixDataReseller[i].kode_upline == pembanding[j].id){
// 			fixDataReseller[i].kode_upline = pembanding[j].kode
// 		}
// 	}
// }

// fixDataReseller.map(el => {
// 	var key = "id";
// 	delete el[key];
// })

// fixDataReseller.map(reseller => {
// 	if(reseller.kode == 'FUN0269'){
// 		filter.push(reseller)
// 	}
// })

// console.log(filter)

// fixDataReseller.map(reseller => {
// 	let pengirim = reseller.pengirim.replace(/[^0-9]/g, "")
// 	let data = {
// 		pengirim:pengirim+"@funmo.co.id",
// 		tipe_pengirim:"Y",
// 		kode_reseller:reseller.kode,
// 		kirim_info:1,
// 		tgl_data:null,
// 		akses:null,
// 	}
// 	pengirimSms.push(data)
// })
// let json = JSON.stringify(pengirimSms, null, 2)
// fs.writeFileSync('pengirimYahoo.json', json);
// fixDataReseller.map( el => {
// 	if(el.pengirim == '081269981200'){
// 		filter.push(el)
// 	}
// })
// console.log(filter)