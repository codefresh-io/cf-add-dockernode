var express = require('express');

var app = express();

app.post('/node/:ip/:account', (req, res)=>{

});
app.listen(3000, (err)=>{
 if (err)
 {
   console.log('cant connect');
   return process.exit(err);
 }
  console.log('succesfully connected');

})
