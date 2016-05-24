var _ = require('lodash');
var debug = require('debug')('config');
var config = {};


module.exports = (obj)=>{
    if (!obj)
    obj = config;
    
    debug('constructor');
    config = _.defaults(obj,{command : process.env.run_command  || 'echo define your command here'}, {reset:()=>{}});
    debug(JSON.stringify(config));
    return config;

};
