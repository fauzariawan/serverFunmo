const models = require('../models')
const {
    Op
  } = require('sequelize')

function levelO(produk){
    return new Promise(async function (resolve, reject){
        let produk = await models.produk.findAll({
            attributes: ['nama','harga_jual'],
            where:{
                kode:'AIS10'
            }
        })
        if(produk.length > 0){
            console.log(produk, '<<<<<<<< dari levelO')
            resolve(produk)
        }else{
            reject('Level Tidak Terdaftar')
        }
    })
}

function levelMS(products, kodeLevel){
    return new Promise(async function(resolve, reject){
        console.log(kodeLevel, '<<<<<<<<<<< dari Level MS')
        let level = await models.level.findOne({
            attributes: ['nama', 'selisih_harga'],
            where:{
                kode: kodeLevel
                // [Op.or]: [{ kode: 'M' }, { kode: 'S' }],
            }
        })
        if(level){
            console.log(level.kode)
            products.forEach(produk =>{
                produk.harga_jual = produk.harga_jual + level.selisih_harga
            })
            // console.log(products, '<<<<< ini dari levelMS >>>>>')
            resolve(products)
            // levelO(produk)
            // .then( response =>{
            //     response.forEach(produk =>{
            //         produk.harga_jual = produk.harga_jual + level.selisih_harga
            //     })
            //     console.log(response, '<<<<< ini dari levelMS >>>>>')
            //     resolve(response)
            // })
            // .catch( error => {
            //     reject(error)
            // })
        }else{
            reject('Level Tidak Terdaftar')
        }
    })
}

function levelD(produk){
    return new Promise(async function(resolve, reject){
        let level = await models.level.findOne({
            attributes: ['nama', 'selisih_harga'],
            where:{
                kode:'D',
            }
        })
        if(level){
            levelMS(produk)
            .then( response =>{
                response.forEach(produk =>{
                    produk.harga_jual = produk.harga_jual + level.selisih_harga
                })
                resolve(response)
            })
            .catch( error => {
                reject(error)
            })
        }else{
            reject('Level Tidak Terdaftar')
        }
    })
}

function levelA(produk){
    return new Promise(async function(resolve, reject){
        let level = await models.level.findOne({
            attributes: ['nama', 'selisih_harga'],
            where:{
                kode:'A',
            }
        })
        if(level){
            levelD(produk)
            .then( response =>{
                response.forEach(produk =>{
                    produk.harga_jual = produk.harga_jual + level.selisih_harga
                })
                resolve(response)
            })
            .catch( error => {
                reject(error)
            })
        }else{
            reject('Level Tidak Terdaftar')
        }
    })
}

function levelR(produk){
    return new Promise(async function(resolve, reject){
        let level = await models.level.findOne({
            attributes: ['nama', 'selisih_harga'],
            where:{
                kode:'R',
            }
        })
        if(level){
            levelA(produk)
            .then( response =>{
                response.forEach(produk =>{
                    produk.harga_jual = produk.harga_jual + level.selisih_harga
                })
                resolve(response)
            })
            .catch( error => {
                reject(error)
            })
        }else{
            reject('Level Tidak Terdaftar')
        }
    })
}

function hargaMarkUp(markup, produk, produk_markup, user_markUp){
    console.log(markup)
    console.log(produk_markup)
    console.log(user_markUp)
    console.log('ini print dari hargaMarkup')

    if(produk_markup.length == 0){
        for (let i = 0; i < produk.length; i++) {
            produk[i].harga_jual = produk[i].harga_jual + markup + user_markUp
        }
    }else{
        console.log('ADA produk yang di markup')
        for (let i = 0; i < produk.length; i++) {
            let cek = 0
            let ketemu = false
            for (let j = 0; j < produk_markup.length; j++) {
                cek++
                if (produk[i].kode == produk_markup[j].kode_produk.toUpperCase()) {
                    // console.log('ini sama')
                    // console.log(`${produk[i].kode} => ${produk_markup[j].kode_produk.toUpperCase()}` )
                    // console.log(produk[i].harga_jual)
                    // console.log(produk_markup[j].markup)
                    // console.log(user_markUp)
                    // console.log(produk[i].harga_jual,'<<< setelah di jumlah kan')
                    produk[i].harga_jual += produk_markup[j].markup + user_markUp
                    ketemu = true
                }
                if(cek > produk_markup.length-1 && ketemu == false) produk[i].harga_jual += markup + user_markUp
                // console.log('ini tidak sama')
                // console.log(`${produk[i].kode} => ${produk_markup[j].kode_produk.toUpperCase()}` )
                // console.log(produk[i].harga_jual)
                // console.log(markup)
                // console.log(user_markUp)
                // console.log(produk[i].harga_jual,'<<< setelah di jumlah kan')
                // else{
                //     console.log('ini tidak sama')
                //     console.log(`${produk[i].kode} => ${produk_markup[j].kode_produk.toUpperCase()}` )
                //     console.log(produk[i].harga_jual)
                //     console.log(markup)
                //     console.log(user_markUp)
                //     produk[i].harga_jual = produk[i].harga_jual + markup + user_markUp
                //     console.log(produk[i].harga_jual,'<<< setelah di jumlah kan')
                // }
            }
        }
    }
    return produk
    //   markup produk sesuai dengan markup dari masing2 reseller/
    // produk.forEach(produk => {
    // produk.harga_jual = produk.harga_jual + user_markUp
    // })
}

module.exports = {levelMS, levelD, levelA, levelR, hargaMarkUp}