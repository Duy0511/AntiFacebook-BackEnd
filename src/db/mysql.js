// var mysql = require('mysql');
// bị nhầm mysql khác mssql , mysql dùng để kết nối với my sql và xampp không kết nối được với sql sever
const sql = require('mssql')
const dotenv = require('dotenv');
const { connection } = require('mongoose');
dotenv.config();
const sqlConfig ={
  host: process.env.DB_HOST,
  port: 1433,
  server: 'localhost',
  user: 'sa',
  password: '123456',
  database: 'facebook',
  options: {
    trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,// phải để cái này là true ko thì bị self certificate
  }
}
function connect() {
  try {
   // make sure that any items are correctly URL encoded in the connection string
  sql.connect(sqlConfig)
   .then(console.log('Kết nối thành công vào SQL Server'))
   .then(pool =>{
    return pool.request()
    // xong la no tat di luon roi
    

   })
  } catch (err) {
    json =  {
      code : 1001,
      message : err.message
    }
  }
 }
// khac nhau giua connectionPool va connection

//                                              connection
// Mỗi lần bạn muốn thực hiện truy vấn đến cơ sở dữ liệu, bạn phải tạo một kết nối mới đến cơ sở dữ liệu.
// Sau khi hoàn thành truy vấn, bạn phải đóng kết nối đến cơ sở dữ liệu để giải phóng tài nguyên và trả lại kết nối vào pool.
//                                              connectionPool
// Một connection pool là một tập hợp các kết nối được tạo trước và được quản lý bởi một thư viện hoặc framework.
// Khi bạn muốn thực hiện một truy vấn, bạn không cần tạo kết nối mới, mà bạn có thể mượn một kết nối từ pool. Sau khi hoàn thành truy vấn, bạn trả lại kết nối vào pool thay vì đóng nó.
// Connection pool tự động quản lý số lượng kết nối trong pool, và có thể tái sử dụng chúng để giảm độ trễ và tối ưu hóa hiệu suất.

// nhu duoi day tao connection pool vao bien pool promise
// de co the truy van nhieu lan
 const poolPromise = new sql.ConnectionPool(sqlConfig)
 .connect()
 .then(pool => {
   return pool;
 })
 .catch(err => console.log('Database error, mal Config: ', err));

// (async () => {
//  const pool = await poolPromise;
//  console.log(pool);
// })();
// muốn xem biến đó thì phải dùng async để promise nó hoàn thành xong đã thì mới xem được giá trị biến đó
module.exports = {connect,poolPromise};