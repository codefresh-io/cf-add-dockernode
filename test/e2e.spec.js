var request = require('superagent');
var assert = require('assert');
var proxyquire =  require('proxyquire');
var debug = require('debug')('e2e');
var util  = require('util');

describe('test create node', ()=>{
  debugger;
   afterEach(()=>{
     process.env.run_command = undefined;
     console.log('resetting...');

   });



   it('test config from process env', (done)=>{
     process.env.run_command = 'ansible';
     var p =  new Promise((resolve, reject) => {
       //var config = proxyquire('../config',{command: 'ansible'});
       var config = require('../config');
       assert.equal(config.command , 'ansible');
       resolve(config.command);
     });
     p.then(()=>{done()}).catch((err)=>{done(err);});
   })
   it('test config default', (done)=>{

     var p =  new Promise((resolve, reject) => {
       var config = require('../config');

       assert.equal(config.command , 'echo define your command here');
       resolve(config.command);
     });
     p.then(()=>{done()}).catch((err)=>{done(err);});
   })
   it.only('add new node', (done)=>{
     request
     .post('localhost:3000/api/v1/node/test?dnsname=oleg&&ip=123.123.123.123')
     .set('Accept', 'application/json')
     .end(function(err, res){
     if (err)
       return done(err);
       done();
   });
   })
});
