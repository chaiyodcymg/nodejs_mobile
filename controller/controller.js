

const con = require('../model/model')
var CryptoJS = require("crypto-js");

exports.home = (req,res) =>{
    con.query("SELECT * FROM users",function (err, result) {
        if (err) {
            res.status(500)
        }else{
            console.log(result);
            res.status(200).json(result)
        }
   
      });
     
 
}
exports.login = (req,res) =>{
  // console.log(req.body);
  con.query("SELECT * FROM users WHERE email = ? AND  password = ?", [req.body.email,req.body.pass], function (err, result) {
    if (err) {
      res.status(500)
    }else{
      console.log(result);
      res.json({status:true,text:"login success!",XAUTH:result[0].id})
    }

    // res.cookie("XAUTH",md5(result[0].id),{ httpOnly: true });
   
  });
 

  // res.send('Cookie have been saved successfully');
}

exports.register = async (req,res)=>{
await  con.query("INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?, ?)",
  [req.body.username,req.body.password,req.body.name,req.body.email],function (err, result){
    if (err) {
      if(err.errno == 1062){
        res.status(500).json({status:false,text:"มีผู้ใช้อีเมลหรือชื่อผู้ใช้งานนี้อยู่แล้ว กรุณาใส่อีเมลหรือชื่อผู้ใช้อื่น"})
      }
     
    }else{
      let encrypted = CryptoJS.AES.encrypt(result.insertId.toString(), "ID_user").toString()
      var encoded = CryptoJS.enc.Base64.parse(encrypted).toString(CryptoJS.enc.Hex);

      res.status(201).json({status:true,text:"register success!",XAUTH:encoded.toString()})
    }
  });



}