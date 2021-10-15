function errorHandling(err, req, res, next){
    // res.send(err.errors)
    if(err.name == 'login'){
        res.status(500).json({pesan:err.errors})
    }else if(err.name == 'register'){
        res.status(500).json({pesan:err.errors})
    }else if(err.name == 'SequelizeConnectionError'){
        res.status(500).json({"rc":"05","pesan":"GAGAL Koneksi ke DB "})
    }else{
        console.log("ini dari error handling")
        console.log(err)
        res.send(err)
    }
}

module.exports = errorHandling