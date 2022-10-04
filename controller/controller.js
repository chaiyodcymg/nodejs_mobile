

const con = require('../model/model')
const randomstring = require("randomstring");
const fs = require('fs');
const toSQLDate = require('js-date-to-sql-datetime');


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
        res.status(200).json({
          email:result[0].email,
          name:result[0].name,
          firstname:result[0].firstname,
          lastname:result[0].lastname,
          image_profile:result[0].image_profile
        
        })
    }

  });
 }
 exports.search = (req,res) =>{
  var search  =  req.query.data

console.log(req.query.data);

     
       var sql = "SELECT * FROM post_info WHERE name LIKE '%"+search+"%' OR  species LIKE '"+search+"%'"
        con.query(sql ,function (err, result){
          if(err){
            console.log(err)
            
          }else{
        
            if(result.length > 0){
              console.log(result)
            res.json(result)
            }
          
          }
      
        })
      //   console.log(data);
     
    
 
 }
 exports.insertfindhouse = (req,res) =>{
  var info = req.body;
  
  if (!info) {
    return res
      .status(400)
      .send({ error: true, message: "Please fill infomation " });
  }


  con.query(
    "INSERT INTO post (status, type, user_id) VALUES (?,?,?)",[parseInt(info.status), parseInt(info.type), parseInt(info.user_id)] , function (error, results, fields) {
      if (error) throw error;
      var post_id = parseInt(results.insertId)
    con.query(
      "INSERT INTO post_info (name, gender, color, vaccine, date_vaccine, species, more_info, image, house_no, street, sub_district, district, province, post_address, firstname, lastname, phone, email, line_id, facebook, post_id) "+ 
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[info.name, info.gender, info.color, info.vaccine, info.date_vaccine, info.species, info.more_info, info.image, info.house_no, info.street, info.sub_district, info.district, info.province, info.post_address, info.firstname, info.lastname, info.phone, info.email, info.line_id, info.facebook,  post_id] , function (error, result, fields) {
        if (error) throw error;
        return res.send(result);
      });
    })

    
  
    

 }
 // app.set('socketio',io)
