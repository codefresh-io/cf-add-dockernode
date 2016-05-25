var _ = require('lodash');
var debug = require('debug')('config');
var util  = require('util');
debug('loading config ... ');

var config = {};
config.command = process.env.run_command ;
config = _.defaults(config, {command :  'echo define your command here'});
debug(util.format('%j', config));
module.exports =  config;
