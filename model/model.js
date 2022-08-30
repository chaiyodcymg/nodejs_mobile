const mysql = require('mysql');

module.exports = con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"nodejs_mobile"
  });
  
 con.connect(function(err) {
    if (err){
        console.log(err);
    }else{
        console.log("Connected!");
       
    }

});
  
