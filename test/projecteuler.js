var touton = require('../src/touton.js'),
	assert = require('assert'),
	output,
	logger = function (stream) {output += stream; };
describe('Project Euler Answers', function () {
	it('Problem 1', function () {
		output = '';
		touton({expression: 'smr^Z3X*X.moX,3 5', print: logger});
		assert.equal(output, '233168');
	});
	it('Problem 2', function () {
		output = '';
		touton({expression: 'sf.sf34X.moX2', print: logger});
		assert.equal(output, '4613732');
	});
	it('Problem 3', function () {
		output = '';
		touton({expression: 'MM.pd600851475143', print: logger});
		assert.equal(output, '6857');
	});
	it('Problem 4', function () {
		this.timeout(0);
		output = '';
		touton({expression: '=Zr999MMfCmZX*XmZYYx.ipx', print: logger});
		assert.equal(output, '906609');
	});
	it('Problem 5', function () {
		output = '';
		touton({expression: '.lctr21', print: logger});
		assert.equal(output, '232792560');
	});
	it('Problem 6', function () {
		output = '';
		touton({expression: '=Ztrh*ZZ-^sZ2smZX^X2', print: logger});
		assert.equal(output, '25164150');
	});
	it('Problem 7', function () {
		output = '';
		touton({expression: 'P.sp+1$tk', print: logger});
		assert.equal(output, '104743');
	});
	it('Problem 8', function () {
		this.timeout(0);
		output = '';
		touton({expression: 'MMmr$skXu<B<Xri13YZ*QYQZ', print: logger, input: "7316717653133062491922511967442657474235534919493496983520312774506326239578318016984801869478851843858615607891129494954595017379583319528532088055111254069874715852386305071569329096329522744304355766896648950445244523161731856403098711121722383113622298934233803081353362766142828064444866452387493035890729629049156044077239071381051585930796086670172427121883998797908792274921901699720888093776657273330010533678812202354218097512545405947522435258490771167055601360483958644670632441572215539753697817977846174064955149290862569321978468622482839722413756570560574902614079729686524145351004748216637048440319989000889524345065854122758866688116427171479924442928230863465674813919123162824586178664583591245665294765456828489128831426076900422421902267105562632111110937054421750694165896040807198403850962455444362981230987879927244284909188845801561660979191338754992005240636899125607176060588611646710940507754100225698315520005593572972571636269561882670428252483600823257530420752963450"});
		assert.equal(output, '23514624000');
	});
	it('Problem 10', function () {
		this.timeout(0);
		output = '';
		touton({expression: 's.sp148933', print: logger});
		assert.equal(output, '142913828922');
	});
	it('Problem 12', function () {
		this.timeout(0);
		output = '';
		touton({expression: 'W>500l.adXkX,e.stY+Y1YX', print: logger});
		assert.equal(output, '76576500');
	});
	it('Problem 14', function () {
		this.timeout(0);
		output = '';
		touton({expression: '=Ymr$sMXl.scXIYMMY', print: logger});
		assert.equal(output, '837799');
	});
	it('Problem 15', function () {
		output = '';
		touton({expression: '.cn40 20', print: logger});
		assert.equal(output, '137846528820');
	});
});