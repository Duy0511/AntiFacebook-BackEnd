
const {poolPromise}= require('../../db/mysql.js');
const session = require('express-session')
const cookieParser = require('cookie-parser');
class dataController {
    homeData = async (req, res, next) =>{
        try{
            if(!req.session.NAME){
                res.redirect('/login')
            }else{
                console.log(req.session.NAME)
                const pool =await poolPromise
                const result =await pool.request()
                    // .input('input_parameter', sql.Int, value)
                    .query(`SELECT * FROM ACCOUNT WHERE EMAIL = '${email}'`)
                const user = result.recordset[0];
                res.json({
                    name : user.NAME,
                    password : user.PASSWORD,
                    email : user.EMAIL,
                    image : user.IMAGE,
                    token : user.TOKEN,
                    idblock : user.IDBLOCK
                })
            } 
        }catch(err){
            res.status(401).json({
                code : 1005,
                status:'fail',
                message : err.message,
            })
        }
                          
}
}

module.exports = new dataController();
