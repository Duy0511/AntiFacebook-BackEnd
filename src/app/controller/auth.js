const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const config = process.env;
const verifyToken = (req, res, next) => {
  req.session._test = "test";
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
    // lấy token thông qua 1 trong 3 , cái thứ nhất lấy qua body , cái thứ 2 lấy qua url, cái thứ 3 set headers
    // ví dụ cái thứ nhất thì biết rồi sẽ truyền thông qua body
    // cái thứ 3 thì dùng 
//    axios.get(url, {
//   headers: {
//     'x-access-token': token
//   }
// })
  if (!token) {
    return res.status(403).json({
        status : "fail",
        message: "Cần nhập token vào"
    });
  }
  try {
      const decoded = jwt.verify(token, config.TOKEN_KEY,(err)=>{
        if(err){
        if(err.name === 'TokenExpiredError'){
          const payload = jwt.verify(token, config.TOKEN_KEY, {ignoreExpiration: true} );
          const userid = payload.userId
          const email = payload.email
          const refreshToken = jwt.sign({
            userid: userid,
            email: email
        }, config.TOKEN_KEY, {
            expiresIn: '10m'
        })
        req.body.token = refreshToken
        return jwt.verify(refreshToken, config.TOKEN_KEY)
        }
        }
          return jwt.verify(token, config.TOKEN_KEY)
      }) 
    // console.log(token, config.TOKEN_KEY) 
    req.user.decoded = decoded;
    // console.log(user)
    req.session._id1 = decoded.userid
    console.log(decoded.userid)
    return res.status(200).json({    
        code: 1000,
        status: "success",
        message: "Đăng nhập thành công",
        data: {
          id: decoded.userid,
          email: decoded.email,
        },
      });
      
  } catch (err) {
    console.log(err);
    return res.status(401).json({
        status : "fail",
        message: err.message,
    })
  }
};

module.exports = verifyToken;