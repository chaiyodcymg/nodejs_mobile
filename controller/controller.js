

const con = require('../model/model')
const randomstring = require("randomstring");
const fs = require('fs');
const toSQLDate = require('js-date-to-sql-datetime');
const CryptoJS = require("crypto-js");

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
  const encrypted_password = CryptoJS.MD5(req.body.password.toString()).toString()
  con.query("SELECT * FROM users WHERE email = ? AND  password = ?", [req.body.email, encrypted_password ],function (err, result) {
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
  let image_profile = "images/user.png"
  const encrypted_password = CryptoJS.MD5(req.body.password.toString()).toString()
  con.query("INSERT INTO users (email,password,firstname,lastname,role,image_profile) VALUES (?,?,?,?,?,?)", 
  [
  req.body.email,
  encrypted_password,
  req.body.firstname,
  req.body.lastname,
  role,
  image_profile
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
  [req.body.email , req.body.firstname , req.body.lastname, filename_random.split('/public/')[1],  req.body.id ],function (err, result){
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
 exports.insertnews =(req,res) =>{
  var news = req.body;
  
  if (!news) {
    return res
      .status(400)
      .send({ error: true, message: "Please fill infomation " });
  }else{
    if(req.files){

      const file = req.files.image
      var filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
    
      if (fs.existsSync(filename_random )) {
        filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
        file.mv(filename_random)
      }else{
        file.mv(filename_random)
      }
      con.query(
        "INSERT INTO cat_news (title, image, detail, user_id) "+ 
        "VALUES (?,?,?,?)",[news.title, filename_random.split('/public/')[1], news.detail, news.user_id], function (error, result) {
          if (error) throw error;
          return res.send(result);
        });
    }
  }

   
}

 exports.news =(req,res) =>{

  con.query('SELECT * FROM cat_news WHERE del_status = "N" ',function (error, result) {
    if (error) {
      res.status(500)
     }else{
      console.log(result);
      res.status(200).json(result)
    
     }
    })
  }
 exports.editnews =(req,res) =>{
  var news_id = req.body.id

  // var   update_at =  toSQLDate(new Date())
  // update.update_at = update_at
  if(!news_id){
    return res.status(500)
  }else{
    if(req.files){

      const file = req.files.image
      var filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
    
      if (fs.existsSync(filename_random )) {
        filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
        file.mv(filename_random)
      }else{
        file.mv(filename_random)
      }
     
      con.query(
        "UPDATE cat_news SET  title = ?, image = ?, detail = ?  WHERE id = ?",[req.body.title,filename_random.split('/public/')[1],req.body.detail,news_id] , function (error, result) {
          if (error) {
            res.status(500)
          }else{
            console.log(result);
            res.status(200).json(result)
          };
        })
    }
  }
 
 }

 exports.softdelnews =(req,res) =>{
  let news_id = req.params.id;
  var update = req.body
  update.del_status = 'Y'

  if (!news_id || !update) {
    return res.status(500).send({ error: true, message: 'Please provide news_id' }); }

  con.query("UPDATE cat_news SET ? WHERE cat_news.id = ?",[update,news_id] , function (error, result) {
      if (error) {
        throw error;
      }
      console.log(result);
      return res.send({ error: false, data: result, message: 'News has been deleted successfully.' });
    })
 }


 exports.profile =(req,res) =>{
  if(req.body.id != undefined){
    con.query("SELECT * FROM users WHERE id = ?",[parseInt(req.body.id) ],function (err, result) {
      if (err) {
          res.status(500)
      }else{
          
          if(result != null){
            console.log("email = ",result);
            res.status(200).json({
              email:result[0].email,
              name:result[0].name,
              firstname:result[0].firstname,
              lastname:result[0].lastname,
              image_profile:result[0].image_profile
            
            })
          }
      
      }
  
    });
  }
  
 }
 exports.search = (req,res) =>{
  var search  =  req.query.data

var sql = "SELECT post_info.id,post.type, post_info.* FROM post_info JOIN post ON post_info.post_id = post.id"+
" WHERE post.del_status = 'N' AND  post.status = 1 AND post_info.name LIKE '%"+search+"%' OR post_info.species LIKE '%"+search+"%' OR post_info.color LIKE '%"+search+"%'"
      //  var sql = "SELECT * FROM post_info WHERE name LIKE '%"+search+"%' OR  species LIKE '"+search+"%'"
        con.query(sql,function (err, result){
          if(err){
            console.log(err)
            
          }else{
            
            if(result.length > 0){
              console.log(result)
            res.json(result)
            }else{
              res.json({})
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
  if(req.files){
    const file = req.files.image
    var filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
  
    if (fs.existsSync(filename_random )) {
      filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
      file.mv(filename_random)
    }else{
      file.mv(filename_random)
    }
 
  con.query(
    "INSERT INTO post (status, type, user_id) VALUES (?,?,?)",[parseInt(info.status), parseInt(info.type), parseInt(info.user_id)] , function (error, results, fields) {
      if (error) throw error;
      var post_id = parseInt(results.insertId)
    con.query(
      "INSERT INTO post_info (name, gender, color, vaccine, date_vaccine, species, more_info, image, house_no, street, sub_district, district, province, post_address, firstname, lastname, phone, email, line_id, facebook, post_id) "+ 
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[info.name, info.gender, info.color, info.vaccine, info.date_vaccine, info.species, info.more_info, filename_random.split('/public/')[1], info.house_no, info.street, info.sub_district, info.district, info.province, info.post_address, info.firstname, info.lastname, info.phone, info.email, info.line_id, info.facebook,  post_id] , function (error, result, fields) {
        if (error) throw error;
        return res.send(result);
      });
    })
}
 }

 exports.insertcatlost= (req,res) =>{
  var info = req.body;
  
  if (!info) {
    return res
      .status(400)
      .send({ error: true, message: "Please fill infomation " });
  }
  if(req.files){

    const file = req.files.image
    var filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
  
    if (fs.existsSync(filename_random )) {
      filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
      file.mv(filename_random)
    }else{
      file.mv(filename_random)
    }

  con.query(
    "INSERT INTO post (status, type, user_id) VALUES (?,?,?)",[parseInt(info.status), parseInt(info.type), parseInt(info.user_id)] , function (error, results) {
      if (error) throw error;
      var post_id = parseInt(results.insertId)
     
    con.query(
      "INSERT INTO post_info (name, gender, color, vaccine, date_vaccine, species, more_info, image, house_no, street, sub_district, district, province, post_address, date, notice_point, place_to_found, firstname, lastname, phone, email, line_id, facebook, post_id) "+ 
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",[info.name, info.gender, info.color, info.vaccine, info.date_vaccine, info.species, info.more_info, filename_random.split('/public/')[1], info.house_no, info.street, info.sub_district, info.district, info.province, info.post_address, info.date, info.notice_point, info.place_to_found, info.firstname, info.lastname, info.phone, info.email, info.line_id, info.facebook,  post_id] , function (error, result, fields) {
        if (error) throw error;
        return res.send(result);
      });
    })
  }
 }



 exports.mypost =(req,res) =>{
  var id = req.params.id;

  con.query('SELECT post_info.id , post.type, post_info.* FROM post_info JOIN post ON post_info.post_id = post.id WHERE post.del_status = "N" AND post.user_id = ?',parseInt(id),function (error, result) {
      if (error) 
      {
        console.log(error);
        res.status(500)
      }
      else{
        console.log(result.length);
        res.status(200).json(result)
      
      };
      });
 }

 exports.allpost = (req,res) => {
  con.query('SELECT post_info.id , post.type , post_info.* FROM post_info JOIN post ON post_info.post_id = post.id WHERE post.status = 0 AND post.del_status = "N"',function (error, result) {
    if (error) 
    {
      console.log(error);
      res.status(500)
    }
    else{
   
      res.status(200).json(result)
    
    };
    });
 }

exports.softdel = (req,res) => {
  var id = req.params.id;

  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide id' }); 
  }

  con.query("UPDATE post JOIN post_info ON post.id = post_info.post_id SET post.del_status = 'Y' WHERE post_info.id = ?",parseInt(id) , function (error, results, fields) {
      if (error) {
        throw error;
      }
      console.log(results);
      return res.send({ error: false, data: results, message: 'Post has been deleted successfully.' });
    })
}
 // app.set('socketio',io)

 exports.newshome= (req,res) => {
  con.query("SELECT * FROM cat_news WHERE del_status = 'N' ORDER BY create_at DESC LIMIT 1",function (error, result) {
    if (error) 
    {
      res.status(500)
    }
    else{
      console.log(result[0]);
      res.status(200).json(result[0])
    };
    });
 }

 exports.homefindhouse = (req, res) => {
  con.query("SELECT post_info.id , post_info.* FROM post_info JOIN post ON post_info.post_id = post.id WHERE post.type = 0  AND post.status = 1 AND post.del_status = 'N' ORDER BY created_at DESC LIMIT 2" ,function (error, result) {
    if (error) 
    {
      console.log(error);
      res.status(500)
    }
    else{
      console.log(result);
      res.status(200).json(result)
    
    };
    });
 }

 exports.homecatlost = (req,res) => {
con.query("SELECT post_info.id , post_info.* FROM post_info JOIN post ON post_info.post_id = post.id WHERE (post.type = 1 OR post.type = 2) AND post.status = 1 AND post.del_status = 'N' ORDER BY created_at DESC LIMIT 2" ,function (error, result) {
    if (error) 
    {
      console.log(error);
      res.status(500)
    }
    else{
      console.log(result);
      res.status(200).json(result)
    
    };
    });
 }

 exports.denypost = (req,res) => {
  var id = req.params.id;

  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide id' }); 
  }

  con.query("UPDATE post JOIN post_info ON post.id = post_info.post_id SET post.status = 2 WHERE post_info.id = ?",parseInt(id) , function (error, results, fields) {
      if (error) {
        throw error;
      }
      console.log(results);
      return res.send({ error: false, data: results, message: 'Post has been updated successfully.' });
    })
 }

 exports.acceptpost = (req,res) => {
  var id = req.params.id;

  if (!id) {
    return res.status(400).send({ error: true, message: 'Please provide id' }); 
  }

  con.query("UPDATE post JOIN post_info ON post.id = post_info.post_id SET post.status = 1 WHERE post_info.id = ?",parseInt(id) , function (error, results, fields) {
      if (error) {
        throw error;
      }
      console.log(results);
      return res.send({ error: false, data: results, message: 'Post has been accept successfully.' });
    })
 }

 exports.more_findhouse = (req,res) => {
  con.query("SELECT post_info.id , post_info.* FROM post_info JOIN post ON post_info.post_id = post.id WHERE post.type = 0  AND post.status = 1 AND post.del_status = 'N' ORDER BY created_at DESC" ,function (error, result) {
    if (error) 
    {
      console.log(error);
      res.status(500)
    }
    else{
      console.log(result);
      res.status(200).json(result)
    
    };
    });
 }



 exports.more_catlost = (req,res) => {
  con.query("SELECT post_info.id , post_info.* FROM post_info JOIN post ON post_info.post_id = post.id WHERE (post.type = 1 OR post.type = 2) AND post.status = 1 AND post.del_status = 'N'ORDER BY created_at DESC" ,function (error, result) {
    if (error) 
    {
      console.log(error);
      res.status(500)
    }
    else{
      console.log(result);
      res.status(200).json(result)
    
    };
    });
 }


 exports.updatePostFindhouse =  (req,res) => {
  var  post_id = req.body.post_id;
  var info = req.body;

  if (! post_id || !info ) {
    return res.status(400).send({  message: 'Please provide data ' });
   }else{
    if(req.files){

      const file = req.files.image
      var filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(50)+".jpg"
    
      if (fs.existsSync(filename_random )) {
        filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
        file.mv(filename_random)
      }else{
        file.mv(filename_random)
      }
      info.image =  filename_random.split('/public/')[1]
      console.log( info);
      delete info['type']; 
      delete info['status'];
        con.query("UPDATE post_info SET ? WHERE post_id = ?",[info,  post_id.toString()] , function (error, result) {
            if (error) throw error;
            console.log(result);
            return res.send(result);
          });
      
      
   
      }
   }


}
exports.updateLostCat =  (req,res) => {
  var  post_id = req.body.post_id;
  var info = req.body;

  if (! post_id || !info ) {
    return res.status(400).send({  message: 'Please provide data ' });
   }else{
    if(req.files){

      const file = req.files.image
      var filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(50)+".jpg"

      if (fs.existsSync(filename_random )) {
        filename_random = __dirname.split('/controller')[0]+"/public/images/"+randomstring.generate(60)+".jpg"
        file.mv(filename_random)
      }else{
        file.mv(filename_random)
      }
      info.image =  filename_random.split('/public/')[1]
      console.log( info);

      delete info['status'];
      con.query("UPDATE post SET type = ? WHERE id = ?",[ info.type.toString() ,  post_id.toString()] , function (error, result) {
        if (error) throw error;
        delete info['type'];
        con.query("UPDATE post_info SET ? WHERE post_id = ?",[info,  post_id.toString()] , function (error, result) {
          if (error) throw error;
          console.log(result);
          return res.send(result);
        });
      });
      
      }
   }
}
