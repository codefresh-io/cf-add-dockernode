var express = require('express');
var router = express.Router();
var shell = require('shelljs/global');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/v1/node/:account', function(req, res, next) {
  console.log(`${req.param.account}`)
  var config = require('../config')({command : process.env.command});
  /*var version = exec(config.command, {silent:true}).stdout;
  var child = exec('some_long_running_process', {async:true});
  child.stdout.on('data', function(data) {
    console.log('data:' + data);
  });*/

  exec(config.command, function(code, stdout, stderr) {
   console.log('Exit code:', code);
   console.log('Program output:', stdout);
   console.log('Program stderr:', stderr);

   res.send('ok');
 });
});

module.exports = router;
