var touton = require('../src/touton.js'),
	assert = require('assert'),
	output,
	logger = function (stream) {output += stream; };
describe('Code Golf Answers', function () {
	it('53799/calculating-waves', function () {
		output = '';
		touton({expression: 'kXiYdYX/v+hXXt+XeX2X', input: [[2, 1, 2, 3, 4, 5], 1], print: logger});
		assert.equal(output, '[1.5,2,2,3,4,4.5]');
	});
	it('53812/make-the-mexican-wave', function () {
		output = '';
		touton({expression: 'E+zt_zXRXzCX', print: logger});
		assert.equal(output, 'Abcdefghijklmnopqrstuvwxyz\naBcdefghijklmnopqrstuvwxyz\nabCdefghijklmnopqrstuvwxyz\nabcDefghijklmnopqrstuvwxyz\nabcdEfghijklmnopqrstuvwxyz\nabcdeFghijklmnopqrstuvwxyz\nabcdefGhijklmnopqrstuvwxyz\nabcdefgHijklmnopqrstuvwxyz\nabcdefghIjklmnopqrstuvwxyz\nabcdefghiJklmnopqrstuvwxyz\nabcdefghijKlmnopqrstuvwxyz\nabcdefghijkLmnopqrstuvwxyz\nabcdefghijklMnopqrstuvwxyz\nabcdefghijklmNopqrstuvwxyz\nabcdefghijklmnOpqrstuvwxyz\nabcdefghijklmnoPqrstuvwxyz\nabcdefghijklmnopQrstuvwxyz\nabcdefghijklmnopqRstuvwxyz\nabcdefghijklmnopqrStuvwxyz\nabcdefghijklmnopqrsTuvwxyz\nabcdefghijklmnopqrstUvwxyz\nabcdefghijklmnopqrstuVwxyz\nabcdefghijklmnopqrstuvWxyz\nabcdefghijklmnopqrstuvwXyz\nabcdefghijklmnopqrstuvwxYz\nabcdefghijklmnopqrstuvwxyZ\nabcdefghijklmnopqrstuvwxYz\nabcdefghijklmnopqrstuvwXyz\nabcdefghijklmnopqrstuvWxyz\nabcdefghijklmnopqrstuVwxyz\nabcdefghijklmnopqrstUvwxyz\nabcdefghijklmnopqrsTuvwxyz\nabcdefghijklmnopqrStuvwxyz\nabcdefghijklmnopqRstuvwxyz\nabcdefghijklmnopQrstuvwxyz\nabcdefghijklmnoPqrstuvwxyz\nabcdefghijklmnOpqrstuvwxyz\nabcdefghijklmNopqrstuvwxyz\nabcdefghijklMnopqrstuvwxyz\nabcdefghijkLmnopqrstuvwxyz\nabcdefghijKlmnopqrstuvwxyz\nabcdefghiJklmnopqrstuvwxyz\nabcdefghIjklmnopqrstuvwxyz\nabcdefgHijklmnopqrstuvwxyz\nabcdefGhijklmnopqrstuvwxyz\nabcdeFghijklmnopqrstuvwxyz\nabcdEfghijklmnopqrstuvwxyz\nabcDefghijklmnopqrstuvwxyz\nabCdefghijklmnopqrstuvwxyz\naBcdefghijklmnopqrstuvwxyz\nAbcdefghijklmnopqrstuvwxyz');
	});
	it('54076/is-7-l8r-than-9-is-seven-later-than-nine', function () {
		output = '';
		touton({expression: '~:_/i\\-', input: ['Xv-Y0'], print: logger});
		assert.equal(output, 1);
	});
});