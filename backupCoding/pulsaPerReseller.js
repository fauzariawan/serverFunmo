//   let produk = {
  //     "produk":[
  //       {
  //         "kode":'TM'
  //       }
  //     ]
  //   }

  //   res.status(200).json(produk)
    // console.log('berhasil')
    // res.send({status:'berhasil'})
    


    try {
        let prefix_tujuan = req.body.p
        // let kode_reseller = req.logedInUser.kode_reseller
        // let produk
        // let user
        // let produk_upline
  
        // let byu = ['085154', '085155', '085156', '085157'].join(' ').includes(prefix_tujuan) //byU
        // let hsm = ['088'].join(' ').includes(prefix_tujuan) // sma srtfrenen   
        // let htp = ['089'].join(' ').includes(prefix_tujuan) // uan thhree
        // let ip = ['0815', '0816', '0855', '0856', '0857', '0858', '0859', '0814'].join(' ').includes(prefix_tujuan) // i indosat
        // let tm = ['0812', '0813', '0821', '0822', '0823', '0852', '0853', '0851'].join(' ').includes(prefix_tujuan) // // telkomsel
        // let xp = ['0878', '0877', '0817', '0818', '0819', '0859', '083'].join(' ').includes(prefix_tujuan)
  
        console.log(prefix_tujuan)
        // if(tm){
          // user = await models.reseller.findOne({
          //   where:{
          //     kode:kode_reseller
          //   }
          // })
          // produk = await models.produk.findAll({
          //   where:{
          //     kode_operator:'TM'
          //   }
          // })
          // res.send(produk)
          // produk_upline = await models.markup_produk.findAll({
          //   where:{
          //       kode_reseller:user.kode_upline
          //   }
          // })
          // res.send(produk_upline)
          // for (let i = 0; i < produk.length; i++) {
          //   for (let j = 0; j < produk_upline.length; j++) {
          //     if (produk[i].kode == produk_upline[j].kode_produk) {
          //       produk[i].harga_jual = produk[i].harga_jual + produk_upline[j].markup
          //     }
          //   }
          // }
          // produk.forEach(produk => {
          //   produk.harga_jual = produk.harga_jual + user.markup
          // })
          // res.status(200).json({produk})
        // }
    } catch (error) {
      res.send(error)
      }