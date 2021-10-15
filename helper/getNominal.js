const {tiket_deposit} = require('../models')

async function getNominal(){
let data  = await tiket_deposit.findOne({
        where:{
            kode_inbox:210
        },
        order:[['kode','desc']]
    })
}

console.log(getNominal())
