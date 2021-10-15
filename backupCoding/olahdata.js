
  // static async paketDataInjekPerReseller(req, res, next) {
  //   // console.log('berhasil')
  //   try {
  //     let paketData = req.body.paketData // PDI(Paket Data Injek), PDV(paket Data Voucher), PDIV(Paket Data Injek Voucher)
  //     let operator = req.body.operator

  //     let data = await models.operator.findAll({
  //       where: {
  //         nama: {
  //           [Op.like]: `${paketData}%`,
  //           [Op.substring]: `${operator}`
  //         }
  //       }
  //     })

  //     res.status(200).json(
  //       data
  //     )
  //   } catch (error) {
  //     res.status(500).json(
  //       error
  //     )
  //   }
  // }

  // static getProduk(req, res, next) {
  //   getProdukPerOperator(req.body.kode_operator).then((produk) => {
  //     res.status(200).json(produk)
  //   }).catch((error) => {
  //     res.send(error)
  //   })
  // }

  // static async paketTelp(req, res, next) {
  //   try {
  //     let paket = req.body.paket
  //     let data = await models.operator.findAll({
  //       where: {
  //         nama: {
  //           [Op.like]: `4%`,
  //           [Op.substring]: `${paket}`
  //         }
  //       }
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async checktagihanPln(req, res, next) {
  //   try {
  //     /* getProdukPerOperator('PL').then((response) => {
  //       res.send(response)
  //     }).catch((error) => {
  //       res.send(error)
  //     }) */
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async bayartagihanPln(req, res, next) {
  //   try {
  //     getProdukPerOperator('PL').then((response) => {
  //       res.send(response)
  //     }).catch((error) => {
  //       res.send(error)
  //     })
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async tokenPln(req, res, next) {
  //   try {
  //     getProdukPerOperator('PP').then((response) => {
  //       res.send(response)
  //     }).catch((error) => {
  //       res.send(error)
  //     })
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async roaming(req, res, next) {
  //   try {
  //     let data = await models.operator.findAll({
  //       where: {
  //         nama: {
  //           [Op.like]: `9%`,
  //         }
  //       }
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async listpulsainternasional(req, res, next) {
  //   try {
  //     let data = await models.operator.findAll({
  //       where: {
  //         nama: {
  //           [Op.like]: `Pulsa Internasional%`,
  //         }
  //       },
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async getpulsainternasional(req, res, next) {
  //   try {
  //     let id = req.params.id
  //     getProdukPerOperator(id).then((response) => {
  //       res.send(response)
  //     }).catch((error) => {
  //       res.send(error)
  //     })
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async finance(req, res, next) {
  //   try {
  //     if (!req.body.search) {
  //       let data = await models.produk.findAll({
  //         where: {
  //           kode_operator: {
  //             [Op.eq]: 'fin',
  //           },
  //           nama: {
  //             [Op.like]: 'cek%',
  //           }
  //         }
  //       })
  //       res.send(data)
  //       // res.send('tidak ada search')
  //     } else {
  //       let data = await models.produk.findAll({
  //         where: {
  //           kode_operator: {
  //             [Op.eq]: 'fin',
  //           },
  //           nama: {
  //             [Op.like]: 'cek%',
  //             [Op.like]: `%${req.body.search}%`
  //           }
  //         }
  //       })
  //       res.send(data)
  //     }
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async pascaBayar(req, res, next) {
  //   try {
  //     let data = await models.produk.findAll({
  //       where: {
  //         kode_operator: {
  //           [Op.eq]: 'telp',
  //         },
  //         nama: {
  //           [Op.like]: 'cek%'
  //         }
  //       }
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async pam(req, res, next) {
  //   try {
  //     let data = await models.produk.findAll({
  //       where: {
  //         kode_operator: {
  //           [Op.eq]: 'pam',
  //         },
  //         nama: {
  //           [Op.like]: 'cek%'
  //         }
  //       }
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async voucherWifiId(req, res, next) {
  //   try {
  //     let data = await models.produk.findAll({
  //       where: {
  //         nama: {
  //           [Op.substring]: 'voucher wifi'
  //         }
  //       },
  //       order: [
  //         ['harga_jual', 'asc']
  //       ]
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async saldoOvo(req, res, next) {
  //   try {
  //     let data = await models.produk.findAll({
  //       where: {
  //         kode: {
  //           [Op.like]: 'OVO%'
  //         }
  //       },
  //       order: [
  //         ['harga_jual', 'asc']
  //       ]
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async saldoDana(req, res, next) {
  //   try {
  //     getProdukPerOperator('DANA').then((response) => {
  //       res.send(response)
  //     }).catch((error) => {
  //       res.send(error)
  //     })
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async gojekCustomer(req, res, next) {
  //   try {
  //     let data = await models.produk.findAll({
  //       where: {
  //         kode: {
  //           [Op.like]: 'GO%'
  //         }
  //       },
  //       order: [
  //         ['harga_jual', 'asc']
  //       ]
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async gojekDriver(req, res, next) {
  //   try {
  //     getProdukPerOperator('GD').then((response) => {
  //       res.send(response)
  //     }).catch((error) => {
  //       res.send(error)
  //     })
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async grabCustomer(req, res, next) {
  //   try {
  //     let data = await models.produk.findAll({
  //       where: {
  //         kode_operator: {
  //           [Op.eq]: 'ovo',
  //         },
  //         nama: {
  //           [Op.substring]: 'grab'
  //         }
  //       }
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async grabDriver(req, res, next) {
  //   try {
  //     getProdukPerOperator('SGD').then((response) => {
  //       res.send(response)
  //     }).catch((error) => {
  //       res.send(error)
  //     })
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async game(req, res, next) {
  //   try {
  //     let data = await models.operator.findAll({
  //       where: {
  //         nama: {
  //           [Op.substring]: 'game'
  //         }
  //       }
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async produkGame(req, res, next) {
  //   getProdukPerOperator(req.body.kode_operator).then((response) => {
  //     res.send(response)
  //   }).catch((error) => {
  //     res.send(error)
  //   })
  // }

  // static async saldoShopee(req, res, next) {
  //   try {
  //     getProdukPerOperator('SHOP').then((response) => {
  //       res.send(response)
  //     }).catch((error) => {
  //       res.send(error)
  //     })
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async emoney(req, res, next) {
  //   try {
  //     let data = await models.operator.findAll({
  //       where: {
  //         nama: {
  //           [Op.substring]: '5%'
  //         }
  //       }
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async produkEmoney(req, res, next) {
  //   getProdukPerOperator(req.body.kode_operator).then((response) => {
  //     res.send(response)
  //   }).catch((error) => {
  //     res.send(error)
  //   })
  // }

  // static produkLinkaja(req, res, next) {
  //   getProdukPerOperator('LINK').then((response) => {
  //     res.send(response)
  //   }).catch((error) => {
  //     res.send(error)
  //   })
  // }

  // static produkPbb(req, res, next) {
  //   getProdukPerOperator('pbb').then((response) => {
  //     res.send(response)
  //   }).catch((error) => {
  //     res.send(error)
  //   })
  // }

  // static async inetTv(req, res, next) {
  //   try {
  //     let data = await models.produk.findAll({
  //       where: {
  //         kode_operator: {
  //           [Op.eq]: 'ppob',
  //         },
  //         nama: {
  //           [Op.like]: 'cek%'
  //         }
  //       }
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async getKodeOperator(req, res, next) {
  //   try {
  //     // res.send('berhasil')
  //     let inisial1 = req.body.inisial1
  //     let inisial2 = req.body.inisial2
  //     getKodeOperator(inisial1, inisial2).then((response) => {
  //       res.send(response)
  //     }).catch((error) => {
  //       res.send(error)
  //     })
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }

  // static async produkEnt(req, res, next) {
  //   try {
  //     let data = await models.produk.findAll({
  //       where: {
  //         kode_operator: {
  //           [Op.eq]: 'ent',
  //         },
  //         nama: {
  //           [Op.like]: `${req.body.teks}%`
  //         }
  //       }
  //     })
  //     res.send(data)
  //   } catch (error) {
  //     res.send(error)
  //   }
  // }
/// byu ///
//   if (prefix_tujuan.slice(0,4) == '0851'){
//     if (prefix_tujuan.lenght >= 6 ){
//       if(prefix_tujuan.slice(0, 6) == '085154' || prefix_tujuan.slice(0, 6) == '085155' || prefix_tujuan.slice(0, 6) == '085156' || prefix_tujuan.slice(0, 6) == '085157'){
//         byu = true
//       }else{
//         tm = true
//       }
//     }else{
//       tm = true
//     }

