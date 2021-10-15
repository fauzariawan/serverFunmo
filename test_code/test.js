// // console.log('ini pertama')
// // myFunction()
// // function myFunction() {
// //     setTimeout(function(){ alert("Hello"); }, 3000);
// //   }

// // function hitungMarkup(nilai) {
// //   return new Promise(function(resolve, reject) {
// //     if(nilai > 1){
// //       resolve('berhasil')
// //     }else{
// //       reject('gagal')
// //     }
// //   })
// // }

// // let hasil = hitungMarkup(1)
// // console.log(typeof hasil)
// // console.log(hitungMarkup(1))
// const qrcode = require('qrcode-terminal');
// const { Client } = require('whatsapp-web.js');
// const client = new Client();

// client.on('qr', (qr) => {
//     // console.log('QR RECEIVED', qr);
//     qrcode.generate(qr, {small: true});
// });

// client.on('ready', () => {
//     console.log('Client is ready!');
// });

// client.on('message', message => {
// 	console.log(message.body);
// });



// client.initialize();

// let str = 'FUN001'
// cekSpasi = str.includes(" "),
// cekDash = str.includes("-")
// cekDoubleKode = str.split("+")
// // let cleanPlus = str.split('+')
// let result = str.substr(3, str.length)
// let num = Number(result)
// console.log(num)

var arr = [{
    "updated_at": "2012-01-01T06:25:24Z",
    "foo": "1"
  },
  {
    "updated_at": "2012-01-09T11:25:13Z",
    "foo": "3"
  },
  {
    "updated_at": "2012-01-05T04:13:24Z",
    "foo": "2"
  }
]

arr.sort(function(a, b) {
  var keyA = new Date(a.updated_at),
    keyB = new Date(b.updated_at);
  // Compare the 2 dates
  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
});

console.log(arr);