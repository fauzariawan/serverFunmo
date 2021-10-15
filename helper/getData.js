

const {reseller,produk,markup_produk,operator} = require('../models')
const models = require('../models')
const {
    Op
  } = require('sequelize')

async function getReseller(kode_reseller){
    let data = await reseller.findOne({
        where:{
            kode:kode_reseller
        }
    })
    return data
}

async function getKodeOperator(isInisial1, isInisial2){
    let data1 = ''
    let data2 = ''
    if(isInisial1){data1 = isInisial1}
    if(isInisial2){data2 = isInisial2}
    
    let data = await models.operator.findAll({
        where:{
            nama:{
                [Op.like]: `${data1}%`,
                [Op.substring]: `${data2}`
              }
        },
    })

    return data
}

async function getProdukPerOperator(kode_operator,kriteria){
    if(kode_operator && kriteria){
        let data = await models.produk.findAll({
            where:{
                kode_operator:kode_operator,
                nama:{
                    [Op.substring]: `${kriteria}`
                }
            },
            order:[['harga_jual','asc']]
        })
        return data
    }else{
        let data = await models.produk.findAll({
            where:{
                kode_operator:kode_operator,
            },
            order:[['harga_jual','asc']]
        })
        return data
    }
}

async function getProdukUpline(kode_upline){
    let data = await markup_produk.findAll({
        where:{
            kode_reseller:kode_upline
        }
    })
    return data
}


module.exports = {getReseller, getKodeOperator, getProdukPerOperator, getProdukUpline}
