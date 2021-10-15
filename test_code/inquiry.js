const axios = require('axios')

function file_get_contents(filename) {
    axios({
        url:'https://www.bukalapak.com/'
    }).then((data)=>{
        let tes = data.data
        let token = tes.split("access_token")
        let token1 = token[1]
        let hasil = token1.slice(3,46)
        console.log(hasil)
        // let pelanggan = {
        //     customer_number:'50171180313',
        //     product_id:'PLNPREPAID'
        // };
        // return axios({
        //     method:'post',
        //     url:`https://api.bukalapak.com/electricities/prepaid-inquiries?access_token=${hasil}`,
        //     headers:{
        //         'content-type':'application/json'
        //     },
        //     data:{
        //         customer_number:'50171180313',
        //         product_id:'PLNPREPAID'
        //     }
        // })
    })
    // .then((response)=>{
    //     console.log(response.status)
    // })
    .catch((error)=>{
        console.log(error)
    })
}

file_get_contents()