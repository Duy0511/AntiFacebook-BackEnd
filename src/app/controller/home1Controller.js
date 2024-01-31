const { poolPromise } = require("../../db/mysql.js");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
class homeController {
  getuserData = async (req, res, next) => {
    // session này nó lấy từ trình duyệt về chứ không phải backend
    if(req.session.username){
      console.log(req.session.username)
      const pool = await poolPromise;
      const result = await pool.query(`SELECT IMAGE FROM ACCOUNT WHERE ID = ${req.session._id}`)
      return res.status(200).json({
        valid : true,
        username : req.session.username,
        image : result.recordset[0].IMAGE
      })
    }else{
      return res.status(201).json({
        valid : false,
      })
    }
  }
  pushDataPost = async (req, res, next) => {
    // console.log(req.body.image)
    const data = {
      id : req.session._id,
      content : req.body.content,
      image : req.body.image
    }
    try {
    const pool = await poolPromise;
        const result = await pool.query(
          `INSERT INTO Posts (post_id, user_id, content, image_url) 
          VALUES((SELECT COUNT(*) FROM Posts WHERE user_id = ${data.id}) + 1,${data.id},  N'${data.content}','${data.image}')`
        )
      return res.status(201).json({
      code : 1000,
      status : 'success',
      message : 'Đăng bài thành công',
      data
    })
    }catch(err){
    console.log(err);
    return res.status(500).json({
      code: 1006,
      status : fail,
      message: 'Lỗi server',
    });
    }
  }
  getDataPost = async(req,res,next) =>{
    try {
      const pool = await poolPromise;
      const result = await pool.query(`SELECT * FROM Posts`)
      const result2 = await pool.query(`SELECT GETDATE() AS CurrentDateTime;`)
      res.json({
        data: result.recordset,
        currentDate : result2.recordset[0].CurrentDateTime
      })
    } catch (error) {
      
    }
  }
  getCommentPost = async(req,res,next) =>{
    try{
      const pool = await poolPromise;
      const result = await pool.query(
      `select c.*,a.[IMAGE],u.username from Comment c
      left JOIN Users u on u.user_id = c.user_id
      left JOIN ACCOUNT a on a.ID = u.user_id  `)
      res.json({
        code : 1000,
        status : 'success',
        data : result.recordset,
      })
    }catch(error){
      console.log(error)
      res.status(401).json({
        status : 'fail',
        code : 1005,
        message : error
      })
    }
  }
  pushDataComment = async(req,res,next) =>{//push data and get comment new
    const {postID,comment} = req.body 
    const userID = req.session._id
    console.log(userID,postID,comment)
    try{
      const pool = await poolPromise;
      const result = await pool.query(`INSERT INTO Comment (comment_id,user_id,comment,post_id) 
      VALUES(
        (SELECT COUNT(*) FROM Comment WHERE user_id = ${userID} AND post_id = ${postID}) +1,
        '${userID}',
        '${comment}',
        '${postID}'
      )
      
      select top 1 c.*,a.[IMAGE],u.username from Comment c
      left JOIN Users u on u.user_id = c.user_id 
      left JOIN ACCOUNT a on a.ID = u.user_id   
      where c.user_id = '${userID}'
      and c.post_id = '${postID}'
      ORDER BY c.comment_id DESC;
      `)
      console.log(result.recordset[0])
      res.status(201).json({
        code : 1000,
      status : 'success',
      message : 'Binh luan thành công',
      data:{
        comment_id : result.recordset[0].comment_id,
        user_id : result.recordset[0].user_id,
        post_id : result.recordset[0].post_id,
        comment : result.recordset[0].comment,
        IMAGE : result.recordset[0].IMAGE,
        created_at : result.recordset[0].created_at,
        username : result.recordset[0].username
      }
      })
    }catch(error){
      console.error(error)
      res.status(400).json({
        code : 1005,
        status: fail,
        message : error
      })
    }
  }
  getReactionPosts = async(req,res,next) =>{
    try{
      const pool = await poolPromise;
      const result = await pool.query(
      `select * from Reactions`)
      console.log(result)
      res.status(200).json({
        code : 1000,
        status : 'success',
        data : result.recordset,
      })
      
    }catch(error){
      res.status(400).json({
        code : 1005,
        status : 'fail',
      })
    }
  }
  pushReactionsPosts = async(req,res,next) =>{
    try{
      const pool = await poolPromise;
      const {postID,reactionName,userID} = req.body
      const result = await pool.query(
      `INSERT INTO Reactions (reactions_id,post_id,reactions_name,user_id)
      VALUES (
        SELCT COUNT (*) FROM Reactions + 1,
        ${postID},
        ${reactionName},
        ${userID}
      )
       `)
      res.status(200).json({
        code : 1000,
        status : 'success',
        data : result.recordset,
      })
    }catch(error){
      res.status(400).json({
        code : 1005,
        status : 'fail',
      })
    }
  }
}
module.exports = new homeController()









