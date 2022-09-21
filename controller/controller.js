

const con = require('../model/model')
const randomstring = require("randomstring");
const fs = require('fs');



exports.home = (req,res) =>{
    con.query("SELECT * FROM users",function (err, result) {
        if (err) {
            res.status(500)
        }else{
            // console.log(result);
            res.status(200).json(result)
        }
   
      });
     
 
}
exports.login = (req,res) =>{
  console.log(req.body);
  con.query("SELECT * FROM users WHERE email = ? AND  password = ?", [req.body.email,req.body.password],function (err, result) {
    if (err){
      console.log("errrrrrrrr")
       return  res.status(401).json({status:false,text:" อีเมลหรือรหัสผ่านไม่ถูกต้องกรุณากรอกข้อมูลใหม่อีกรั้ง",AUTH:""})
    }else{
      // console.log(result);
      if(result.length > 0){
        return   res.status(200).json({status:true,text:"login success!",AUTH:result[0].id,role:result[0].role})
      }else{
        return  res.status(401).json({status:false,text:" อีเมลหรือรหัสผ่านไม่ถูกต้องกรุณากรอกข้อมูลใหม่อีกรั้ง",AUTH:"",role:0})
      }

    }

  
  
  
  });
 

 
}

exports.register= (req,res) =>{
  console.log(req.body);
  var role = 0
  con.query("INSERT INTO users (email,password,firstname,lastname,role) VALUES (?,?,?,?,?)", 
  [
  req.body.email,
  req.body.password,
  req.body.firstname,
  req.body.lastname,
  role
],function (err, result){
  if (err){
    return  res.status(401).json({status:false,text:" อีเมลหรือรหัสผ่านไม่ถูกต้องกรุณากรอกข้อมูลใหม่อีกรั้ง",AUTH:"",role:""})
 }else{
   console.log(result);
 return   res.status(200).json({status:true,text:"login success!",AUTH:result.insertId,role:role})
 }

  })
}

exports.updateprofile_withImage= (req,res) =>{
  console.log(req.body )
  const file = req.files.image
  var filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(50)+".jpg"

  if (fs.existsSync(filename_random )) {
    filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
    file.mv(filename_random)
  }else{
    file.mv(filename_random)
  }
  // console.log(filename_random.split('/public')[1])
  con.query("UPDATE users SET email = ? , firstname =  ? , lastname = ? , image_profile = ? WHERE id = ? " ,
  [req.body.email , req.body.firstname , req.body.lastname, filename_random.split('/public')[1],  req.body.id ],function (err, result){
    if(err){
      console.log(err)
      return  res.status(401).json({status:false,text:"ผิดพลาด"})
    }else{
      console.log(result)
      res.status(200).json({status:true,text:"อัพเดตสำเร็จ"})
    }

  })
}
exports.updateprofile_noImage =(req,res) =>{
  console.log(req.body)
  con.query("UPDATE users SET email = ? , firstname =  ? , lastname = ? WHERE id = ? " ,
  [req.body.email , req.body.firstname , req.body.lastname, req.body.id ],function (err, result){
    if(err){
      console.log(err)
      return  res.status(401).json({status:false,text:"ผิดพลาด"})
    }else{
      console.log(result)
      res.status(200).json({status:true,text:"อัพเดตสำเร็จ"})
    }

  })
 }
 exports.profile =(req,res) =>{
  con.query("SELECT * FROM users WHERE id = ?",[req.body.id],function (err, result) {
    if (err) {
        res.status(500)
    }else{
        console.log(result);
        res.status(200).json({email:result[0].email,name:result[0].name,
          firstname:result[0].firstname,
          lastname:result[0].lastname,
          image_profile:result[0].image_profile
        
        })
    }

  });
 }
 exports.search = (io)=>{
  var search  =  "pack"
  io.on('connection', (socket) => {
    console.log("New connection "+socket.id);

    // io.emit("result",search );
      socket.on('search',(data)=>{
       var sql = "SELECT * FROM users WHERE firstname LIKE '"+data+"%' OR  lastname LIKE '"+data+"%'"
        con.query(sql ,function (err, result){
          if(err){
            console.log(err)
            
          }else{
        
            if(result.length > 0){
              console.log(result)
            return   io.emit("result",result);
            }
          
          }
      
        })
        console.log(data);
      })
  
      // socket.on('disconnect', (s) => {
      //   console.log("disconnection id :"+socket.id);
      // })
  
  })
 }
 // app.set('socketio',io)
