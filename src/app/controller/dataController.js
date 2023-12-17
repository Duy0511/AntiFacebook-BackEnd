
const {poolPromise}= require('../../db/mysql.js');
const session = require('express-session')
const cookieParser = require('cookie-parser');
class dataController {
    loginCheck = async (req, res, next) =>{
        try{
           const { email, password } = req.body;
            
                    const pool =await poolPromise
                    const result =await pool.request()
                        // .input('input_parameter', sql.Int, value)
                        .query(`SELECT * FROM ACCOUNT WHERE EMAIL = '${email}'`)
                    
            const user = result.recordset[0];
            
            function correctPassword(cadidatePassword,userPassword) {
                
                return cadidatePassword === userPassword ? true : false;
            }
            if(!!user && correctPassword(password,user.PASSWORD)){
                req.session.username = user.NAME; 
                
                res.status(200).json({
                    username : req.session.username,
                    code : 1000,
                    status : 'success',
                    message : 'Đăng nhập thành công',
                })
                
            }else{
                throw new Error('Sai mật khẩu hoặc tài khoản')
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
