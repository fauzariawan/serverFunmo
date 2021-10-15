const {getKodeOperator} = require('../helper/getKodeOperator')

class operatorController{
    static async getKodeOperator(req, res, next){
        console.log(req.query.kriteria, req.query.kriteria2 )
        try {
            getKodeOperator(req.query.kriteria, req.query.kriteria2)
            .then((response)=>{
                res.status(200).json(response)
            })
            .catch((error) => {
                res.status(500).json(error)
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = operatorController