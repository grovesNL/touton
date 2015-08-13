#!/usr/bin/env node
var touton = require('../src/touton.js'),
	argv = require('minimist')(process.argv.slice(2));

argv.expression = argv._.join();
if (argv.hasOwnProperty('input')) {
	argv.input = JSON.parse(JSON.stringify(argv.input));
}
touton(argv);
