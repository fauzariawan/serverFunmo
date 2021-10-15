const {
  inbox,
  reseller,
  pengirim,
  tiket_deposit,
  outbox,
  transaksi
} = require("../models");
const moment = require("moment-timezone");
const resellerController = require("./resellerController");
const {
  gtTrxid
} = require('../helper/getTrxId')
const {verifyToken} = require('../helper/jwt')
class inboxController {
  static formatJson(id, number, message) {
    let newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");
    let str = number
    str.replace('+62',"0")

    return {
      tgl_entri: newDate,
      penerima: null,
      kode_reseller: id,
      pengirim: number,
      tipe_pengirim: "Y",
      pesan: message,
      kode_terminal: "1",
      kode_transaksi: "",
      status: "0",
      tgl_status: newDate,
      is_jawaban: "0",
      service_center: "+62816124",
    };
  }

  static resOutBox(kode_transaksi, kode_inbox){
    return new Promise(async function (resolve, reject){
      try {
        if(kode_transaksi){
          let result = await outbox.findAll({
            where: {
              kode_transaksi: kode_transaksi
            },
            order: [
              ['tgl_entri', 'desc']
            ]
          })
          resolve(result)
  
          let update = await outbox.update({
            status:20
          }, {
            where: {
              kode_transaksi: kode_transaksi, tipe_penerima: 'Y'}
          })
          console.log(update)
        }else{
          let result = await outbox.findAll({
            where: {
              kode_inbox: kode_inbox
            },
            order: [
              ['tgl_entri', 'desc']
            ]
          })
          resolve(result)
  
          let update = await outbox.update({
            status:20
          }, {
            where: {
              kode_inbox: kode_inbox, tipe_penerima: 'Y'}
          })
          console.log(update)
        }
        
      } catch (error) {
        reject(error)
      }
    })
  }

  static getResponse(res, kode, timeCek) {
    transaksi.findOne({
      where: {
        kode_inbox: kode
      },
      order: [
        ['kode', 'desc']
      ]
    }).then((response) => {
      // res.send(response)
      if (!response) {
        // langsung cek kode inbox di table outbox untuk ambil pesan di table outbox sesuai dengan kode inbox
        console.log('cek table transaksi', timeCek)
        timeCek++
        if (timeCek > 2) {
          res.status(200).json({
            pesan: 'diabaikan karena transaksi sebelumnya blm selesai atau transaksi double'
          })
          console.log('diabaikan atau double')
        } else {
          console.log('lagi nunggu 3 detik untuk ngecek ulang ada atau tidak masuk transaksi ke table transaksi')
          setTimeout(() => { // penambaham >>>>>>>>>>>
            inboxController.getResponse(kode, timeCek)
          }, 500);
        }
      } else {
        // kalau ada respon kita cek status ditable transaksi
        let status = response.status
        let kode_transaksi = response.kode
        if (status <= 19) {
          // res.send('transaksi pending')
          function menungguTransaksi(status, timeCek) {
            transaksi.findOne({
              where: {
                kode_inbox: kode
              },
              order: [
                ['kode', 'desc']
              ]
            }).then((response) => {
              if (response.status != status) {
                status = response.status

                function getResponse(kode_transaksi) {
                  if (status == 2) {
                    console.log('>>>>>>>>>>>>> MENUNGGU JAWABAN <<<<<<<<<<<<<')
                    setTimeout(() => {
                      menungguTransaksi(status, timeCek)
                    }, 3000);
                  } else {
                    outbox.findAll({
                      where: {
                        kode_transaksi: kode_transaksi
                      },
                      order: [
                        ['tgl_entri', 'desc']
                      ]
                    }).then((response) => {
                      if (response.length > 2) {
                        console.log(response[0])
                        res.status(200).json(response[0])
                      } else {
                        setTimeout(() => {
                          getResponse(kode_transaksi)
                        }, 2000);
                      }
                    }).catch((error) => {
                      console.log(error)
                      res.status(200).json(error)
                    })
                  }
                }
                getResponse(kode_transaksi)
              } else {
                timeCek++
                console.log('status msh pending', timeCek)
                if (timeCek > 10000) {
                  res.status(200).json({
                    message: 'status blm berubah masih pending'
                  })
                }
                menungguTransaksi(status, timeCek)
              }
            })
          }
          menungguTransaksi(status, 1)
        } else if (status == 20) {
          outbox.findAll({
            where: {
              kode_transaksi: kode_transaksi
            },
            order: [
              ['tgl_entri', 'desc']
            ]
          }).then((response) => {
            console.log('Transaksi Langsung Sukses')
            res.status(200).json(response[0])
          }).catch((error) => {
            res.status(200).json(error)
          })
        } else if (status >= 40) {
          console.log('Transaksi Gagal')
          res.status({
            message: 'Transaksi Gagal'
          })
        }
      }
    }).catch((error) => {
      res.status(500).json(error)
    })
  }

  static resOutbox(kode, saldo, harga_produk) {
    if (saldo > harga_produk) {

      function getResponse(kode, timeCek) {
        transaksi.findOne({
          where: {
            kode_inbox: kode
          },
          order: [
            ['kode', 'desc']
          ]
        }).then((response) => {
          if (!response) {
            console.log(timeCek)
            timeCek++
            if (timeCek > 1000) {
              res.send('diabaikan karena transaksi sebelumnya blm selesai atau transaksi double')
            } else {
              getResponse(kode, timeCek)
            }
          } else {
            let status = response.status
            let kode_transaksi = response.kode
            if (status <= 19) {
              function menungguTransaksi(status, timeCek) {
                transaksi.findOne({
                  where: {
                    kode_inbox: kode
                  },
                  order: [
                    ['kode', 'desc']
                  ]
                }).then((response) => {
                  if (response.status != status) {
                    status = response.status
                    outbox.findAll({
                      where: {
                        kode_transaksi: kode_transaksi
                      },
                      order: [
                        ['tgl_entri', 'desc']
                      ]
                    }).then((response) => {
                      res.send(response[0])
                    }).catch((error) => {
                      res.send(error)
                    })
                  } else {
                    timeCek++
                    if (timeCek > 10000) {
                      res.send('status blm berubah masih pending')
                    }
                    menungguTransaksi(status, timeCek)
                  }
                })
              }
              menungguTransaksi(status, 1)
            } else if (status == 20) {
              return res.send('sukses')
            } else if (status >= 40) {
              return res.send('Transaksi Gagal')
            }
          }
        }).catch((error) => {
          return res.status(500).json(error)
        })
      }

      getResponse(result.kode, 1)
    } else {
      return res.send("saldo tidak cukup")
    }
  }

  static async checkPriceProduct(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = ["CH", req.body.code_product].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async checkMarkupDownline(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        "CEKMARKUP",
        reseller.reseller.kode,
        reseller.reseller.pin,
      ].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async checkMarkupProduct(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        "CMP",
        reseller.reseller.kode,
        req.body.code_product,
        reseller.reseller.pin,
      ].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async checkAllMarkupProduk(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        "CMP",
        reseller.reseller.kode,
        reseller.reseller.pin,
      ].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async checkMutation(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = "REK";

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async checkLastMutation(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = "REK2";

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async checkBalance(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        "SAL",
        reseller.reseller.kode,
        reseller.reseller.pin,
      ].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async register(req, res, next) {
    try {
      var {name,notelp,email,password,kodeReferal} = req.body
      let mp = Number(req.body.mp)
      console.log(name, notelp, email, password, mp, kodeReferal)
      let newString = notelp.substring(1, notelp.length)
      let address = req.body.address.split('.').join(' ')
      let newDate = moment().tz("Asia/Jakarta").format("yyyy-MM-DD HH:mm:ss.SSS");
      let error = {
        name:'register',
        errors: []
      }
      let kode_referal
      let resellerUpline
      let markup = mp

      // let String = notelp.replace(notelp[0], "");
      let checkReseller = await pengirim.count({ limit: 1, where: { pengirim: "+62" + newString }})

      if (checkReseller > 0) 
        res.status(200).json({ kode: '04', pesan: 'Nomor yang anda gunakan sudah terdaftar' })
      
      else if (kodeReferal == '0') {
        kode_referal = 'FUN0001'
        markup = 300
      } else {
        let result = await reseller.findOne({
          where:{
            kode: kodeReferal
          }
        })
        if (result == null){
          res.status(200).json({kode:'01',pesan: 'kode referal TIDAK ditemukan'})
        } else {
          kode_referal = kodeReferal.toUpperCase()
          markup = mp == 0 ? 100 : mp
        }
      }
      resellerUpline = await pengirim.findOne({
        where: {
          kode_reseller: kode_referal, // tipe_pengirim:'Y'
        },
        include: "reseller",
      });
      let combine = ['REG', name, address, notelp, markup].join('.')
      let data = inboxController.formatJson(
        kode_referal,
        resellerUpline.pengirim,
        combine
      );
      let result = await inbox.create(data);
      async function getResponse(kodeInbox, timeCek){
        try {
          let resultInbox = await inbox.findOne({
            where:{
              kode: kodeInbox
            }
          })
          console.log('ini STATUS di inbox >>>',resultInbox.status)
          console.log('ini KODE di inbox >>>',resultInbox.kode)
          if(resultInbox.status == 21){
            async function cekOutBox(kodeInbox, timeCek){
              try {
                let resultOutbox = await outbox.findAll({
                  where:{
                    kode_inbox: kodeInbox
                  }
                })
                if(resultOutbox.length > 0){
                  await outbox.update({
                    status:20
                  },{
                    where:{
                      kode_inbox: resultOutbox[0].kode_inbox, tipe_penerima: 'Y'
                    }
                  })
                  let resultPengirim = await pengirim.findOne({
                    where: {
                      pengirim: "+62"+newString,
                    },
                  })
                  console.log("hasil pencarian di table pengirim >>>>",resultPengirim)
                  if(resultPengirim){
                    let resultY = await pengirim.create({
                      "pengirim": notelp+"@funmo.co.id",
                      "tipe_pengirim":"Y",
                      "kode_reseller":resultPengirim.kode_reseller,
                      "kirim_info":1,
                      "tgl_data":newDate,
                      "akses":""
                    })
                    let resultW = await pengirim.create({
                      "pengirim": "62" + notelp,
                      "tipe_pengirim": "W",
                      "kode_reseller": resultPengirim.kode_reseller,
                      "kirim_info": 1,
                      "tgl_data": newDate,
                      "akses": ""
                     })
                    if(resultY && resultW){
                      res.status(200).json({kode:'00', pesan:`Registrasi Berhasil`})
                    }else{
                      res.status(200).json({kode:'05', pesan:'Pengirim dengan tipe Y / W tidak berhasil di buat'})
                    }
                  }else{
                    console.log('data pengirim tidak ditemukan')
                  }
                }else{
                  timeCek++
                  console.log('cek out box yang ke = ', timeCek)
                  if (timeCek > 10){
                    res.status(200).json({kode:'02',pesan: 'Outbox tidak cukup'})
                  }else{
                    setTimeout(() => {
                      cekOutbox(kodeInbox, timeCek)
                    },500)
                  }
                }
              } catch (error) {
                next(error)
              }
            }
            cekOutBox(resultInbox.kode, 1)
          }else if (resultInbox.status == 40 || resultInbox.status == 42){
            console.log('ini kode inbox', resultInbox.kode)
            let result = await outbox.findOne({
              where: {
                kode_inbox: resultInbox.kode
              }
            })
            if(result){
              res.status(200).json(result)
            }else{
              console.log(result)
            }
          }else {
            timeCek++
            console.log('proses registrasi... dengan status',resultInbox.status)
            setTimeout(() => {
              getResponse(resultInbox.kode, timeCek)
            },500)
          }
        } catch (error) {
          next(error)
        }
      }
      getResponse(result.kode, 1)

    } catch (error) {
      console.log(error)
    }
  }

  static async reportMutation(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = ["REK", req.body.date].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async reportTrx(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = ["LAP", req.body.date].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async listGift(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        "CEKHADIAH"
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async listDownline(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let data = inboxController.formatJson(reseller.reseller.kode, reseller.pengirim, "LDL");

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async listSubDownline(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = ["LDL", req.body.code].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async forgetPin(req, res, next) {
    try {
      let kode_otp = req.body.kode_otp
      let token = JSON.parse(req.headers.token)
      let decodeToken = verifyToken(token.token)
      console.log(kode_otp, token, decodeToken);
      if(kode_otp == decodeToken.otp){
        let reseller = await pengirim.findOne({
          where: {
            pengirim:decodeToken.notelp,
          },
          include: "reseller",
        });

        let combine = ["R3ST", reseller.reseller.kode, '123123'].join(".");

        let data = inboxController.formatJson(
          'owner',
          '082362944444@funmobile.id', // ini nomor upline nya
          combine
        );
        let result = await inbox.create(data);

        async function getResponse(kodeInbox, timeCek){
          let result = await inbox.findOne({
            where:{
              kode: kodeInbox
            }
          })
          if(result.status == 21){
            console.log('pin anda berhasil di reset')
            res.status(200).json({rc:"00", pesan:"Pin Anda Berhasil di Reset, Kami Akan Mengirimkan PIN Baru melaui WA atau SMS"})
          }else if(result.status == 49 || result.status == 40 ){
            console.log('pin anda GAGAL di reset')
            res.status(400).json({rc:"01", pesan:"PIN GAGAL di Reset"})
          }else{
            setTimeout(() => {
              timeCek++
              getResponse(kodeInbox, timeCek)
            }, 500);
          }
        }
        getResponse(result.kode, 1)
      } else {
        res.status(400).json({rc:"02", pesan:"OTP tidak Sesuai"})
      }
    } catch (error) {
      res.send(error);
    }
  }

  static async inboxDeposit(req, res, next) {
    try {
      let user = req.logedInUser
      var price = Number(req.body.price);
      console.log(typeof price, price)
      let reseller = await pengirim.findOne({
        where: {
          kode_reseller: user.kode_reseller,
        },
        include: "reseller",
      });

      if (price >= 50000) {
        let combine = ["TIKET", price, reseller.reseller.pin].join(".");

        let data = inboxController.formatJson(
          user.kode_reseller,
          reseller.pengirim,
          combine
        );

        let result = await inbox.create(data);
        console.log(result)
        function getNominal(kode) {
          tiket_deposit.findOne({
            where: {
              kode_inbox: kode
            },
            order: [
              ['kode', 'desc']
            ]
          }).then((response) => {
            if (!response) {
              console.log('tidak ada di table tiket_deposit')
              console.log('jadi kita cek di table outbox')
              outbox.findOne({
                where: {
                  kode_inbox: kode
                },
                order: [
                  ['kode', 'desc']
                ]
              }).then((response)=>{
                if(!response){
                  console.log('blm ada respon dari table tiket_deposit dan table outbox')
                  setTimeout(() => {
                    getNominal(kode)
                  }, 500);
                }else{
                  response.dataValues.rc = '02'
                  res.status(200).json(response)
                }
              })
            } else {
              console.log('ini respon dari table tiket_deposit')
              console.log(response)
              res.status(200).json(response)
            }
          }).catch((error) => {
            res.status(500).json(error)
          })
        }
        getNominal(result.kode)
      } else
        res.json({
          error: "nominal minimal Rp. 50.000"
        })
    } catch (error) {
      res.status(200).json({
        error
      });
    }
  }

  static async inboxTrx(req, res, next) {
    try {
      let user = req.logedInUser
      
      let reseller = await pengirim.findOne({
        where: {
          kode_reseller: user.kode_reseller,
          tipe_pengirim: 'Y'
        },
        include: "reseller",
      });
      
      if (reseller.reseller.saldo > req.body.harga_produk) {
        let combine = [
          req.body.code_product,
          req.body.destiny,
          reseller.reseller.pin,
        ].join(".");

        let data = inboxController.formatJson(
          reseller.reseller.kode,
          reseller.pengirim,
          combine + ' R#' + gtTrxid()
        );

        let result = await inbox.create(data);
        console.log(result, '<<<<< ini data inbox')
        
        async function prosesTransaksi(kode_inbox, time){
          try {
            let resInbox = await inbox.findOne({
              where:{
                kode: kode_inbox
              }
            })
            console.log(resInbox.status)
            console.log("status table inbox",resInbox.status)
            if(resInbox.status == 56 /*sudah melebihi batas transaksi*/ 
              || resInbox.status == 64 
              || resInbox.status == 40 ){
              inboxController.resOutBox(null, resInbox.kode).then(response => {
                            console.log(response)
                            res.status(200).json(response)
              })              
            }else if(resInbox.status == 22){
              async function resTransaksi(kode_inbox, time){
                console.log(`cek status transaksi yang ke ${time}`)
                let responseTransaksi = await transaksi.findOne({
                  where:{
                    kode_inbox
                  }
                })
                let status = responseTransaksi.status
                console.log(`status transaksi ${status}`)
                if(status == 40 || status == 20 || status == 55){
                  inboxController.resOutBox(responseTransaksi.kode, null).then(response => {
                    console.log(response[0])
                    res.status(200).json(response)
                  })
                }else{
                  console.log('kode transaksi >>>',responseTransaksi.kode)
                  if(time == 10){
                    let hasilTransaksi = await transaksi.findOne({
                      where:{
                        kode : responseTransaksi.kode
                      }
                    })
                    res.status(400).json(hasilTransaksi)
                    // let status = responseTransaksi.status
                    // inboxController.resOutBox(responseTransaksi.kode, null).then(response => {
                    //   console.log(response[0])
                    //   res.status(200).json(response)
                    // })
                  }else{
                    time++
                    setTimeout(() => {
                      resTransaksi(kode_inbox, time)
                    }, 1000);
                  }
                }
              }
              resTransaksi(resInbox.kode, 1)
            }else if(resInbox.status == 42){
              res.status(401).json({pesan:"Format Salah"})
            }else{
              time++
              setTimeout(() => {
                prosesTransaksi(resInbox.kode, time)
              }, 500);
            }
          } catch (error) {
            next(error)
          }
        }
        prosesTransaksi(result.kode, 1)
      } else {
        console.log('saldo tidak cukup')
        res.status(400).json({pesan:"saldo tidak cukup"})
      }
    } catch (error) {
      // res.send(error);
      console.log(error)
      res.status(500).json(error)
    }
  }

  static async inboxTrxId(req, res, next) {
    try {
      let user = req.logedInUser 
       
      let reseller = await pengirim.findOne({ 
        where: { 
          kode_reseller: user.kode_reseller, 
          tipe_pengirim: 'Y' 
        }, 
        include: "reseller", 
      }); 
             
      let combine = [ 
        req.body.code_product, 
        req.body.destiny, 
        req.body.pin, 
      ].join("."); 
        
      let data = inboxController.formatJson(reseller.reseller.kode, reseller.pengirim, combine + "#QTY" + req.body.qty + "#TID" + gtTrxid() + "." + req.body.partner_reff + "." + req.body.inquiry_reff + ".remark");
        
      let result = await inbox.create(data); 

      async function getResponse(kode_inbox, time) {
        try {
          let resInbox = await inbox.findOne({
            where:{
              kode: kode_inbox
            }
          })
          console.log(resInbox.status)
          console.log("status table inbox",resInbox.status)
          if(resInbox.status == 56 /*sudah melebihi batas transaksi*/ 
            || resInbox.status == 64 
            || resInbox.status == 40 ){
            inboxController.resOutBox(null, resInbox.kode).then(response => {
                          console.log(response)
                          res.status(200).json(response)
            })              
          }else if(resInbox.status == 22){
            async function resTransaksi(kode_inbox, time){
              console.log(`cek status transaksi yang ke ${time}`)
              let responseTransaksi = await transaksi.findOne({
                where:{
                  kode_inbox
                }
              })
              let status = responseTransaksi.status
              console.log(`status transaksi ${status}`)
              if(status == 40 || status == 20 || status == 55){
                inboxController.resOutBox(responseTransaksi.kode, null).then(response => {
                  console.log(response[0])
                  res.status(200).json(response[0])
                })
              }else{
                console.log('kode transaksi >>>',responseTransaksi.kode)
                if(time == 10){
                  let hasilTransaksi = await transaksi.findOne({
                    where:{
                      kode : responseTransaksi.kode
                    }
                  })
                  res.status(400).json(hasilTransaksi)
                  // let status = responseTransaksi.status
                  // inboxController.resOutBox(responseTransaksi.kode, null).then(response => {
                  //   console.log(response[0])
                  //   res.status(200).json(response)
                  // })
                }else{
                  time++
                  setTimeout(() => {
                    resTransaksi(kode_inbox, time)
                  }, 1000);
                }
              }
            }
            resTransaksi(resInbox.kode, 1)
          }else if(resInbox.status == 42){
            res.status(401).json({pesan:"Format Salah"})
          }else if(resInbox.status == 61){
            inboxController.resOutBox(null, resInbox.kode).then(response => {
              console.log(response[0])
              res.status(400).json(response[0])
            })
          }else{
            time++
            setTimeout(() => {
              getResponse(resInbox.kode, time)
            }, 500);
          }
        } catch (error) {
          next(error)
        }
      }
      getResponse(result.kode, 1)
    } catch (error) {
      res.send(error);
    }
  }

  static async inboxTrxInq(req, res, next) {
    try {
      let user = req.logedInUser
      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        'INQ',
        req.body.code_product,
        req.body.destiny,
        reseller.reseller.pin
      ].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine + "#TID" + gtTrxid()
      );

      let result = await inbox.create(data);
      console.log(`status awal di table inbox ${result.status}`)
      async function getResponse(kodeInbox, timeCek){
        console.log(`cek status table inbox yang ke ${timeCek}`)
        let resInbox = await inbox.findOne({
          where:{
            kode: kodeInbox
          }
        })
        if(resInbox.status == 56 || resInbox.status == 64){ // respon table inbox
          console.log(`status di table inbox ${resInbox.status}`)
          let resOutbox = await outbox.findOne({
            where: {
              kode_inbox: resInbox.kode
            }
          })
          res.status(400).json(resOutbox)
        }else if(resInbox.status == 22){ // respon table inbox
          console.log(`status di table inbox ${resInbox.status}`)
          async function getResTransaksi(kode_inbox, timeCekTransaksi){
            console.log(`cek status di table transaksi yang ke ${timeCekTransaksi}`)
            let resTransaksi = await transaksi.findOne({
              where: {
                kode_inbox
              }
            })
            console.log(resTransaksi.status,'<<<<<<<<<<')
            if(resTransaksi.status == 40 || resTransaksi.status == 20){
              let resOutbox = await outbox.findAll({
                where: {
                  kode_transaksi: resTransaksi.kode
                }
              })
              console.log(resOutbox[resOutbox.length-1])
              res.status(200).json(resOutbox[resOutbox.length-1])
            }else{
              if(timeCekTransaksi == 20){
                if(resTransaksi.status == 2){
                  res.status(200).json({"pesan":"Transaksi Anda Dalam Proses, Silahkan Cek Menu History atau Notification secara berkala"})
                }else{
                  let resOutbox = await outbox.findAll({
                    where: {
                      kode_transaksi: resTransaksi.kode
                    }
                  })
                  console.log(resOutbox[resOutbox.length-1])
                  res.status(200).json(resOutbox[resOutbox.length-1])
                }
              }else{
                setTimeout(() => {
                  timeCekTransaksi ++
                  getResTransaksi(resInbox.kode, timeCekTransaksi)
                }, 1000);
              }
            }
          }
          getResTransaksi(resInbox.kode, 1)
        }else if (resInbox.status == 43){
          console.log(resInbox.kode)
          let resOutbox = await outbox.findOne({
            where: {
              kode_inbox: resInbox.kode
            }
          })
          console.log(resOutbox)
          res.status(400).json(resOutbox)
        } else {
          setTimeout(() => {
            timeCek ++
            getResponse(kodeInbox, timeCek)
          }, 1000);
        }
      }
      getResponse(result.kode, 1)
    } catch (error) {
      res.send(error);
    }
  }

  static async inboxTrxPay(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        "PAY",
        req.body.code_product,
        req.body.destiny,
        reseller.reseller.pin,
      ].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine + "#TID" + gtTrxid()
      );

      let result = await inbox.create(data);
      console.log(`status awal di table inbox ${result.status}`)
      async function getResponse(kodeInbox, timeCek){
        console.log(`cek status table inbox yang ke ${timeCek}`)
        let resInbox = await inbox.findOne({
          where:{
            kode: kodeInbox
          }
        })
        if(resInbox.status == 56 || resInbox.status == 64){ // respon table inbox
          console.log(`status di table inbox ${resInbox.status}`)
          let resOutbox = await outbox.findOne({
            where: {
              kode_inbox: resInbox.kode
            }
          })
          res.status(400).json(resOutbox)
        }else if(resInbox.status == 22){ // respon table inbox
          console.log(`status di table inbox ${resInbox.status}`)
          async function getResTransaksi(kode_inbox, timeCekTransaksi){
            console.log(`cek status di table transaksi yang ke ${timeCekTransaksi}`)
            let resTransaksi = await transaksi.findOne({
              where: {
                kode_inbox
              }
            })
            console.log(resTransaksi.status,'<<<<<<<<<<')
            if(resTransaksi.status == 40 || resTransaksi.status == 20 || resTransaksi.status == 43 /*saldo tidak cukup */){
              let resOutbox = await outbox.findAll({
                where: {
                  kode_transaksi: resTransaksi.kode
                }
              })
              console.log(resOutbox[resOutbox.length-1])
              console.log(resOutbox[resOutbox.length-1].kode_transaksi, '<<<<<<< ini kode transaksi yang dikirim ke Flutter')
              res.status(200).json(resOutbox[resOutbox.length-1])
            }else{
              if(timeCekTransaksi == 20){
                let resOutbox = await outbox.findAll({
                  where: {
                    kode_transaksi: resTransaksi.kode
                  }
                })
                console.log(resOutbox[resOutbox.length-1])
                res.status(200).json(resOutbox[resOutbox.length-1])
              }else{
                setTimeout(() => {
                  timeCekTransaksi ++
                  getResTransaksi(resInbox.kode, timeCekTransaksi)
                }, 1000);
              }
            }
          }
          getResTransaksi(resInbox.kode, 1)
        }else if (resInbox.status == 43 || resInbox.status == 46){
          console.log(resInbox.kode)
          let resOutbox = await outbox.findOne({
            where: {
              kode_inbox: resInbox.kode
            }
          })
          console.log(resOutbox)
          res.status(400).json(resOutbox)
        } else {
          setTimeout(() => {
            timeCek ++
            getResponse(kodeInbox, timeCek)
          }, 1000);
        }
      }
      getResponse(result.kode, 1)
    } catch (error) {
      console.log(error)
      res.send(error);
    }
  }

  static async inboxTrxFun(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        "FUN",
        req.body.code_product,
        req.body.destiny,
        req.body.pin,
      ].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine + "#TID" + req.body.trxid
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  // masih gagal
  static async inboxBalance(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp, tipe_pengirim: 'Y'
        },
        include: "reseller",
      });

      let combine = [
        "TRFLINTAS",
        reseller.kode_reseller,
        req.body.nominal,
        req.body.pin,
      ].join(".");

      let data = inboxController.formatJson(
        reseller.kode_reseller,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async inboxBalanceCross(req, res, next) {
    try {
      let {destiny, nominal, pin} = req.body
      let newNominal = Number(nominal.replace(/[^0-9]/g, ""))
      let user = req.logedInUser
      let reseller
      let resellerUpline = await pengirim.findOne({
        where: {
        kode_reseller: user.kode_reseller,
        // tipe_pengirim: "Y"
        },
        include: "reseller",
      });
      console.log(destiny)
      if(destiny[0] == '+'){
        reseller = await pengirim.findOne({
          where: {
          pengirim: destiny,
          },
        })
      }else{
        let newString = destiny.replace(destiny[0], "");
        reseller = await pengirim.findOne({
          where: {
          pengirim: "+62"+newString,
          },
        });
      }

      if(resellerUpline.reseller.pin != pin){
        res.status(200).json({rc:'02',pesan:"PIN Anda Salah"})
      } else if (resellerUpline.reseller.saldo > newNominal) {
        let combine = [
          "TRFLINTAS",
          reseller.kode_reseller,
          newNominal,
          pin,
        ].join(".");
       
        let data = inboxController.formatJson(resellerUpline.reseller.kode, resellerUpline.pengirim, combine);
        let result = await inbox.create(data);
        console.log(`status awal inbox ${result.status}`)
        async function cekStatusInbox(kodeInbox, timeCek) {
          let result = await inbox.findOne({
            where: {
              kode: kodeInbox
            }
          })
          if(result.status == 21){
            let result = await outbox.findOne({
              where: {
                kode_inbox: kodeInbox
              }
            })
            res.status(200).json({rc:"00", pesan:result.pesan})
            console.log(result.pesan)
          }else if(result.status == 40){
            let result = await outbox.findOne({
              where: {
                kode_inbox: kodeInbox
              }
            })
            res.status(200).json({rc:"02", pesan:result.pesan})
            console.log(result.pesan)
          }else{
            timeCek++
            console.log(`cek status inbox yang ke ${timeCek}`)
            setTimeout(() => {
              cekStatusInbox(kodeInbox, timeCek)
            }, 500);
          }
        }
        cekStatusInbox(result.kode, 1)
      } else {
        res.status(200).json({rc:'01',pesan:"Saldo Anda Tidak Cukup"});
      }
    } catch (error) {
      res.send(error);
    }
  }

  static async exchangeCommission(req, res, next) {
    try {
      let user = req.logedInUser
      let nominal = req.body.nominal.replace(/[^0-9]/g,'')
      console.log(nominal)
      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });
      let combine = ["TUKAR", nominal, req.body.pin].join(".");
      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      async function cekStatusInbox(kodeInbox, timeCek) {
        let result = await inbox.findOne({
          where: {
            kode: kodeInbox
          }
        })
        if(result.status == 20){
          let result = await outbox.findOne({
            where: {
              kode_inbox: kodeInbox
            }
          })
          res.status(200).json({rc:20, pesan:result.pesan})
          console.log(result.pesan)
        }else if(result.status == 40 || result.status == 44 || result.status == 51){
          console.log(result.status)
          let data = await outbox.findOne({
            where: {
              kode_inbox: kodeInbox
            }
          })
          console.log(data.pesan)
          res.status(200).json({rc:result.status, pesan:result.pesan})
        }else{
          timeCek++
          console.log(`cek status inbox yang ke ${timeCek}`)
          setTimeout(() => {
            cekStatusInbox(kodeInbox, timeCek)
          }, 500);
        }
      }
      cekStatusInbox(result.kode, 1)
      // console.log(result);
      // res.send(result);
    } catch (error) {
      console.log(error);
    }
  }

  static async exchangeCommissiontodeposit(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = "TUKAR";

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async exchangePoin(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = ["TUKARPOIN", req.body.code, req.body.pin].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async changeIp(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = ["IPADDRESS", req.body.newip, req.body.pin].join("*");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async changeLevelDownline(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        "UL",
        reseller.reseller.kode,
        reseller.reseller.kode_level,
        req.body.pin,
      ].join("*");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async changeMarkupDownline(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        "MARKUP",
        reseller.reseller.kode_reseller,
        req.body.markup,
        req.body.pin,
      ].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async changeMarkupProduct(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine =
        "MP." + reseller.reseller.kode + ".{" + req.body.kodeproduk + "=" + req.body.markup + ".}" + req.body.pin;

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async changeAllMarkupProduk(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = "MP2." + req.body.code_product + "=" + req.body.markup + ".}" + req.body.pin;

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async changeName(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = ["UN", req.body.name, req.body.pin].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async changeOid(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = ["UBAHOID", req.body.oid, req.body.pin].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async changeIpPassword(req, res, next) {
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = [
        "GP",
        req.body.oldpassword,
        req.body.newpassword,
        reseller.reseller.pin,
      ].join("*");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  }

  static async resetPin(req, res, next) {
    // console.log(req.body.oldpin, req.body.newpin, req.body.ulangipinbaru)
    try {
      let user = req.logedInUser

      let reseller = await pengirim.findOne({
        where: {
          pengirim: user.notelp,
        },
        include: "reseller",
      });

      let combine = ["GP", req.body.oldpin, req.body.newpin].join(".");

      let data = inboxController.formatJson(
        reseller.reseller.kode,
        reseller.pengirim,
        combine
      );

      let result = await inbox.create(data);
      async function getRespon(kode, i){
        let data = await inbox.findOne({where: {kode}})
        if (data.status != result.status){
          if(data.status == 49){
            let resOutbox = await outbox.findOne({where:{kode_inbox:data.kode}})
            console.log(resOutbox.pesan)
            res.status(401).json(resOutbox)
          }else if (data.status == 21){
            let resOutbox = await outbox.findOne({where:{kode_inbox:data.kode}})
            console.log(resOutbox.pesan)
            res.status(200).json(resOutbox)
          }
        }else{
          i++
          console.log('cek perubahan status table inbox ke', i)
          setTimeout(() => {
            getRespon(kode, i)
          }, 500);
        }
      }
      getRespon(result.kode, 1)
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = inboxController;

// function getResponse(kode_transaksi) {
//   if (status == 2) {
//     console.log('>>>>>>>>>>>>> MENUNGGU JAWABAN <<<<<<<<<<<<<')
//     setTimeout(() => {
//       menungguTransaksi(status, timeCek)
//     }, 500);
//   } else {
//     outbox.findAll({
//       where: {
//         kode_transaksi: kode_transaksi
//       },
//       order: [
//         ['tgl_entri', 'desc']
//       ]
//     }).then((response) => {
//       if (response.length > 3) {
//         console.log(response[0])
//         res.status(200).json(response[0])
//       } else {
//         setTimeout(() => {
//           getResponse(kode_transaksi)
//         }, 500);
//       }
//     }).catch((error) => {
//       console.log(error)
//       res.status(200).json(error)
//     })
//   }
// }
// getResponse(kode_transaksi)

