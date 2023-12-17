const {poolPromise} = require('../../db/mysql')
class imagePostControler {
    post =  async (req, res,next) => {
        try {
          const {name, email, password ,deviceId } = req.body;
          const pool = await poolPromise
          const result = await pool.request()
          .query(`SELECT * FROM ACCOUNT WHERE email = '${email}'`)
          //truy van luon luc request
          // Kiểm tra xem tên người dùng đã tồn tại hay chưa
      
          if (result.recordset.length > 0) {
             res.status(400).json({
              code : 9996,
              status : 'fail',
              message : 'Người dùng đã tồn tại',
            })
          }else{
            // Nếu tên người dùng không tồn tại, thêm người dùng mới vào cơ sở dữ liệu
            const registerQuery = `INSERT INTO ACCOUNT (name,email, password , uuid) VALUES ('${name}','${email}', '${password}' , '${deviceId}')`;
            await pool.request()
            .query(registerQuery);
        
             res.status(200).json({
              code: 1000,
              status : 'success',
              message : 'Đăng ký thành công',
              data:{
                name,
                email,
                password,
                deviceId
              }
          })
          }
        } catch (error) {
          res.status(401).json({
            code : 1005,
            status:'fail',
            message : error.message,
        })
        }
    } 
}