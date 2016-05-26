var express = require('express');
var router  = express.Router();
var shell   = require('shelljs/global');
var debug   = require('debug')('run_command');
var assert  = require('assert');
var util    = require('util');
var fs      = require('fs');
var path    = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/v1/node/:account?', function(req, res, next) {
//  console.log(`${req.params.account}`)
  //ansible acountName ip DNSname (optional)
  var config = require('../config');
  //process.env.run_command = 'echo';
  assert(config);
  debug('executing command: '  + config.command);
  var ip  = req.query.ip;
  var dns = req.query.dnsname;
  /*var version = exec(config.command, {silent:true}).stdout;
  var child = exec('some_long_running_process', {async:true});
  child.stdout.on('data', function(data) {
    console.log('data:' + data);
  });*/

  var runCommand = util.format('%s %s %s %s', config.command, req.params.account , ip, dns)

  exec(runCommand, function(code, stdout, stderr) {
   console.log('Exit code:', code);
   console.log('Program output:', stdout);
   console.log('Program stderr:', stderr);

   if (code == 0) { 
     res.send('OK\n');
   }
   else {
     res.send('\n' + stdout + '\n' + stderr + '\nFAILED');
   }
 });
});

router.get('/init', function(req, res, next) {
  fs.readFile(path.join(__dirname, '../codefresh-init.sh'), 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
      res.send(data);
    });
});

module.exports = router;
