

const con = require('../model/model')


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
  con.query("SELECT * FROM users WHERE email = ? AND  password = ?", [req.body.email,req.body.pass],function (err, result) {
    if (err) throw err;
    console.log(result);
 
    // res.cookie("XAUTH",md5(result[0].id),{ httpOnly: true });
    res.json({status:true,text:"login success!",XAUTH:md5(result[0].id)})
  });
 

  // res.send('Cookie have been saved successfully');
}