(function () {
	'use strict';
	var touton = function (options) {
		var variables = {},
			print = function (output) {
				console.log(output);
			};

		function error(errorText) {
			print(errorText);
			throw new Error(errorText);
		}

		/*eslint-disable no-unused-vars*/
		var environment = (function () {
		/*eslint-enable no-unused-vars*/
			var $e = {},
				printedAlready = false;

			function isNumber(value) {
				return typeof value === 'number';
			}

			function isString(value) {
				return typeof value === 'string';
			}

			function isArray(value) {
				return Array.isArray(value);
			}

			function isBoolean(value) {
				return typeof value === 'boolean';
			}

			function isRegex(value) {
				return Object.prototype.toString.call(value) === '[object RegExp]';
			}

			function getTypeError(functionName, parameters) {
				var errorText;
				parameters = JSON.stringify(Array.prototype.slice.call(parameters));
				errorText = functionName + '(' + parameters.substring(1, parameters.length - 1) + '): the provided argument type combination is unsupported';
				error(errorText);
				return errorText;
			}

			function flatten(a) {
				return [].concat.apply([], a);
			}

			function deepCopy(a) {
				return JSON.parse(JSON.stringify(a));
			}

			function range(a, b) {
				var i,
					result = [];
				if (b === undefined) {
					// one argument
					if (isNumber(a)) {
						// range
						if (a > 0) {
							for (i = 0; i < a; i++) {
								result.push(i);
							}
						} else if (a < 0) {
							for (i = a; i < 0; i++) {
								result.push(i);
							}
						}
						return result;
					}
					if (isString(a)) {
						// range
						for (i = 0; i < a.length; i++) {
							result.push(a[i]);
						}
						return result;
					}
					if (isArray(a)) {
						// range
						return a;
					}
					error('Unhandled value type for \'' + a + '\'.');
				}

				// two arguments
				if (isNumber(a) && isNumber(b)) {
					// range
					if (a < b) {
						for (i = a; i < b; i++) {
							result.push(i);
						}
					} else if (b > a) {
						for (i = b; i < a; i++) {
							result.push(i);
						}
					}
					return result;
				}

				error('Unhandled value type for \'' + a + '\' and \'' + b + '\'.');
			}

			function cartesianProduct(a, b) {
				var result = [],
					i,
					j;
				if (isArray(a) && isArray(b)) {
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < b.length; j++) {
							result.push(flatten([a[i], b[j]]));
						}
					}
					return result;
				}
				if (isString(a) && isString(b)) {
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < b.length; j++) {
							result.push(a[i] + b[j]);
						}
					}
					return result;
				}
				if (isArray(a) && isNumber(b)) {
					for (i = 0; i < a.length; i++) {
						result.push(a[i] * b);
					}
					return result;
				}
				if (isNumber(a) && isArray(b)) {
					for (i = 0; i < b.length; i++) {
						result.push(b[i] * a);
					}
					return result;
				}
				error('Cannot determine Cartesian product for \'' + a + '\' and \'' + b + '\'');
			}

			function isPrime(a) {
				var i,
					max = Math.sqrt(a);
				if ((a < 2) || (a % 2 === 0 && a !== 2)) {
					return false;
				}
				for (i = 2; i <= max; i++) {
					if (a % i === 0) {
						return false;
					}
				}
				return true;
			}

			$e.and = function (a, b) {
				return a && b;
			};

			function greatestCommonDivisor(a, b) {
				var temp;
				if (a < 0) {
					a = -a;
				}
				if (b < 0) {
					b = -b;
				}
				if (b > a) {
					temp = a;
					a = b;
					b = temp;
				}
				for (;;) {
					if (b === 0) {
						return a;
					}
					a %= b;
					if (a === 0) {
						return b;
					}
					b %= a;
				}
			}

			$e.mod = function (a, b) {
				var i,
					result = [];
				if (isNumber(a) && isNumber(b)) {
					// modulus
					return a % b;
				}
				if (isNumber(a) && isArray(b)) {
					// element-wise modulus
					for (i = 0; i < b.length; i++) {
						result.push(a % b[i]);
					}
					return result;
				}
				if (isArray(a) && isNumber(b)) {
					// element-wise modulus
					for (i = 0; i < a.length; i++) {
						result.push(a[i] % b);
					}
					return result;
				}
				error(getTypeError('t.mod', [a, b]));
			};

			$e.multiplyRepeat = function (a, b) {
				var i,
					result = [];
				if ((isNumber(a) || isBoolean(a)) && (isNumber(b) || isBoolean(b))) {
					// multiply
					return a * b;
				}
				if (isArray(a) && isNumber(b)) {
					// element-wise multiply
					for (i = 0; i < a.length; i++) {
						result.push(a[i] * b);
					}
					return result;
				}
				if (isNumber(a) && isArray(b)) {
					// element-wise multiply
					for (i = 0; i < b.length; i++) {
						result.push(b[i] * a);
					}
					return result;
				}
				if ((isArray(a) && isArray(b)) || (isString(a) && isString(b))) {
					// Cartesian product
					return cartesianProduct(a, b);
				}
				if (isString(a) && isNumber(b)) {
					// repeat
					return $e.repeat(a, b);
				}
				error(getTypeError('t.multiply', [a, b]));
			};

			$e.addConcat = function (a, b) {
				if ((isNumber(a) || isString(a)) && (isNumber(b) || isString(b))) {
					// add
					return a + b;
				}
				if (isArray(a) && isArray(b)) {
					// concatenate
					return a.concat(b);
				}
				if (isArray(a) && (isNumber(b) || isString(b))) {
					// push
					a = deepCopy(a);
					a.push(b);
					return a;
				}
				if ((isNumber(a) || isString(a)) && isArray(b)) {
					// unshift
					b = deepCopy(b);
					b.unshift(a);
					return b;
				}
				error(getTypeError('t.addConcat', [a, b]));
			};

			$e.pair = function (a, b) {
				return [a, b];
			};

			$e.subtractRemove = function (a, b) {
				var result,
					index;
				if (isNumber(a) && isNumber(b)) {
					// subtract
					return a - b;
				}
				if (isArray(a) && (isNumber(b) || isString(b))) {
					// remove
					result = deepCopy(a);
					index = result.indexOf(b);
					if (index > -1) {
						result.splice(index, 1);
					}
					return result;
				}
				error(getTypeError('t.subtractRemove', [a, b]));
			};

			$e.isPalindrome = function (a) {
				var i,
					value,
					len;
				if (isNumber(a) || isString(a) || isArray(a)) {
					if (isNumber(a)) {
						value = a.toString(10);
					} else {
						value = a;
					}
					len = value.length;
					for (i = 0; i < parseInt(len / 2, 10); i++) {
						if (value[i] !== value[len - i - 1]) {
							return false;
						}
					}
					return true;
				}
				error(getTypeError('t.isPalindrome', [a]));
			};

			$e.primeDecomposition = function (a) {
				var i,
					max = Math.sqrt(a),
					primes;
				if (isNumber(a)) {
					// prime decomposition
					if (a < 2) {
						return [];
					}
					if (isPrime(a)) {
						return [a];
					}
					primes = [];
					for (i = 2; i <= max; i++) {
						if (isPrime(i) && a % i === 0) {
							primes.push(i);
							a /= i;
							max = Math.sqrt(a);
							i--;
						}
					}
					if (a !== 1) {
						primes.push(a);
					}
					return primes;
				}
				error(getTypeError('t.primeDecomposition', [a]));
			};

			$e.allDivisors = function (a) {
				var i,
					small,
					large;
				if (isNumber(a)) {
					// all divisors
					if (a < 0) {
						a = -a;
					}
					small = [];
					large = [];
					for (i = 1; i < Math.sqrt(a); i++) {
						if (a % i === 0) {
							small.push(i);
							large.push(a / i);
						}
					}
					if (a % Math.sqrt(a) === 0) {
						small.push(Math.sqrt(a));
					}
					large.reverse();
					return small.concat(large);
				}
				error(getTypeError('t.allDivisors', [a]));
			};

			$e.combinations = function (a, b) {
				var i,
					result;
				if (isNumber(a) && isNumber(b)) {
					result = 1;
					for (i = 1; i <= b; i++) {
						result *= (a - i + 1) / i;
					}
					return result;
				}
				error(getTypeError('t.combinations', [a, b]));
			};

			$e.greatestCommonDivisor = function (a) {
				var i,
					result;
				if (isArray(a)) {
					// greatest common divisor
					result = a[0];
					for (i = 1; i < a.length; i++) {
						result = greatestCommonDivisor(result, a[i]);
					}
					return result;
				}
				error(getTypeError('t.greatestCommonDivisor', [a]));
			};
			
			$e.leastCommonMultiple = function (a) {
				var i,
					result;
				if (isArray(a)) {
					// least common multiple
					result = a[0];
					for (i = 1; i < a.length; i++) {
						result = Math.abs(result * a[i]) / greatestCommonDivisor(result, a[i]);
					}
					return result;
				}
				error(getTypeError('t.leastCommonMultiple', [a]));
			};

			$e.multipleOf = function (a, b) {
				var i;
				if (isNumber(a) && isNumber(b)) {
					// multiple of
					return Math.abs(a % b) === 0;
				}
				if (isNumber(a) && isArray(b)) {
					// multiple of any
					for (i = 0; i < b.length; i++) {
						if (Math.abs(a % b[i]) === 0) {
							return true;
						}
					}
					return false;
				}
				if (isArray(a) && isNumber(b)) {
					// multiple of all
					for (i = 0; i < b.length; i++) {
						if (Math.abs(a % b[i]) !== 0) {
							return false;
						}
					}
					return true;
				}
				error(getTypeError('t.multipleOf', [a, b]));
			};

			$e.collatz = function (a) {
				var value,
					result = [];
				if (isNumber(a)) {
					// Collatz
					if (a === 0) {
						return [1];
					}
					if (a < 0) {
						a = -a;
					}
					value = a;
					result.push(value);
					while (value != 1) {
						if (value % 2 === 0) {
							value /= 2;
						} else {
							value = 3 * value + 1;
						}
						result.push(value);
					}
					return result;
				}
				error(getTypeError('t.collatz', [a]));
			};

			$e.fibonacci = function (a) {
				var i,
					result = [];
				if (isNumber(a)) {
					// Fibonacci
					result.push(0);
					if (a === 0) {
						return result;
					}
					result.push(1);
					if (a === 1) {
						return result;
					}
					for (i = 2; i < a; i++) {
						result.push(result[i - 2] + result[i - 1]);
					}
					return result;
				}
				error(getTypeError('t.fibonacci', [a]));
			};

			$e.primes = function (a) {
				var i,
					result = [];
				if (isNumber(a)) {
					// primes
					i = 0;
					while (result.length < a) {
						i++;
						if (isPrime(i)) {
							result.push(i);
						}
					}
					return result;
				}
				error(getTypeError('t.primes', [a]));
			};

			$e.triangles = function (a) {
				var i,
					current,
					result = [];
				if (isNumber(a)) {
					// triangles
					i = 0;
					current = 0;
					while (result.length < a) {
						i++;
						current += i;
						result.push(current);
					}
					return result;
				}
				error(getTypeError('t.triangles', [a]));
			};

			$e.uniques = function (a) {
				var i,
					result = [];
				if (isArray(a)) {
					// uniques
					for (i = 0; i < a.length; i++) {
						if (result.indexOf(a[i]) === -1) {
							result.push(a[i]);
						}
					}
					return result;
				}
				error(getTypeError('t.uniques', [a]));
			};

			$e.divideSplit = function (a, b) {
				var i,
					result = [];
				if (isNumber(a) && isNumber(b)) {
					// divide
					return a / b;
				}
				if (isArray(a) && isArray(b)) {
					// element-wise divide
					for (i = 0; i < (a.length < b.length ? a.length : b.length); i++) {
						result.push(a[i] / b[i]);
					}
					return result;
				}
				if (isNumber(a) && isArray(b)) {
					// element-wise divide
					for (i = 0; i < b.length; i++) {
						result.push(a / b[i]);
					}
					return result;
				}
				if (isArray(a) && isNumber(b)) {
					// element-wise divide
					for (i = 0; i < a.length; i++) {
						result.push(a[i] / b);
					}
					return result;
				}
				if (isString(a) && isString(b)) {
					// split
					return a.split(b);
				}
				if (isNumber(a) && isString(b)) {
					// split into groups
					for (i = 0; i < b.length; i += a) {
						result.push(b.substr(i, a));
					}
					return result;
				}
				error(getTypeError('t.divideSplit', [a, b]));
			};

			$e.pow = function (a, b) {
				var i,
					result;
				if (isNumber(a) && isNumber(b)) {
					// power
					return Math.pow(a, b);
				}
				if ((isNumber(a) && isArray(b)) || (isNumber(a) && isString(b))) {
					// repeated Cartesian product
					result = [];
					if (a > 0) {
						result = 1;
					}
					for (i = 0; i < a; i++) {
						result = cartesianProduct(b, result);
					}
					return result;
				}
				error(getTypeError('t.pow', [a, b]));
			};

			$e.lessThanLowerSlice = function (a, b) {
				if ((isNumber(a) || isString(a)) && (isNumber(b) || isString(b))) {
					// less than
					return a < b;
				}
				if (isArray(a) && isNumber(b)) {
					// lower slice
					return a.slice(0, b);
				}
				error(getTypeError('t.lessThanLowerSlice', [a, b]));
			};

			$e.greaterThanUpperSlice = function (a, b) {
				if ((isNumber(a) || isString(a)) && (isNumber(b) || isString(b))) {
					// greater than
					return a > b;
				}
				if (isArray(a) && isNumber(b)) {
					if (a.length - b < 0) {
						return [];
					}
					return a.slice(a.length - b, a.length);
				}
				error(getTypeError('t.greaterThanUpperSlice', [a, b]));
			};

			$e.ternary = function (a, b, c) {
				if (isBoolean(b)) {
					return b ? a : c;
				}
				error(getTypeError('t.ternary', [a, b, c]));
			};

			$e.getLookupIndex = function (a, b) {
				if (isNumber(a) && (isArray(b) || isString(b))) {
					// read value at index
					return b[a];
				}
				error(getTypeError('t.getLookupIndex', [a, b]));
			};

			$e.all = function (a, b) {
				if (isString(a) || isNumber(a) || isArray(a)) {
					// any
					return $e.range(a).every(b);
				}
				error(getTypeError('t.all', [a, b]));
			};

			$e.leftShiftRotate = function (a, b) {
				var i;
				if (isNumber(a) && (isString(b) || isArray(b))) {
					if (isArray(b)) {
						b = deepCopy(b);
					}
					// circular left shift
					for (i = 0; i < a; i++) {
						b.unshift(b.pop());
					}
					return b;
				}
				if (isNumber(a) && isNumber(b)) {
					// binary left shift
					return b << a;
				}
				error(getTypeError('t.leftShiftRotate', [a, b]));
			};

			$e.rightShiftRotate = function (a, b) {
				var i;
				if (isNumber(a) && (isString(b) || isArray(b))) {
					if (isArray(b)) {
						b = deepCopy(b);
					}
					// circular right shift
					for (i = 0; i < a; i++) {
						b.push(b.shift());
					}
					return b;
				}
				if (isNumber(a) && isNumber(b)) {
					// binary right shift
					return b >> a;
				}
				error(getTypeError('t.rightShiftRotate', [a, b]));
			};

			$e.changeCaseFlatten = function (a) {
				var i,
					result;
				if (isString(a)) {
					// change case
					result = '';
					for (i = 0; i < a.length; i++) {
						if (a[i] === a[i].toLowerCase()) {
							result += a[i].toUpperCase();
						} else {
							result[i] += a[i].toLowerCase();
						}
					}
					return result;
				}
				if (isArray(a)) {
					// flatten
					return flatten(a);
				}
				error(getTypeError('t.changeCaseFlatten', [a]));
			};

			$e.factorial = function (a) {
				var value = 1,
					i;
				if (isNumber(a)) {
					// factorial
					for (i = 2; i <= a; i++) {
						value *= i;
					}
					return value;
				}
				error(getTypeError('t.factorial', [a]));
			};

			$e.sign = function (a) {
				if (isNumber(a)) {
					// sign
					return Math.sign(a);
				}
				error(getTypeError('t.sign', [a]));
			};

			$e.pickRandom = function (a) {
				if (isArray(a)) {
					// pick random
					return a[Math.floor(Math.random() * a.length)];
				}
				error(getTypeError('t.pickRandom', [a]));
			};

			$e.acos = function (a) {
				if (isNumber(a)) {
					// inverse cosine
					return Math.acos(a);
				}
				error(getTypeError('t.acos', [a]));
			};

			$e.max = function (a) {
				var i,
					result;
				if (isArray(a)) {
					// maximum
					result = -Infinity;
					for (i = 0; i < a.length; i++) {
						if (a[i] > result) {
							result = a[i];
						}
					}
					return result;
				}
				error(getTypeError('t.max', [a]));
			};

			$e.radix = function (a, b) {
				var result,
					i;
				if (isNumber(a) && isNumber(b)) {
					// base 10 to base a
					return b.toString(a);
				}
				if (isString(a) && isNumber(b)) {
					// base a to base 10
					return parseInt(a, b);
				}
				if (isNumber(a) && isString(b)) {
					// character codes of string in base a
					result = [];
					for (i = 0; i < b.length; i++) {
						result.push(b[i].charCodeAt(0).toString(a));
					}
					return result;
				}
				if (isNumber(a) && isArray(b)) {
					// string representation in base a
					result = '';
					for (i = 0; i < b.length; i++) {
						result += String.fromCharCode(parseInt(b[i], a));
					}
					return result;
				}
				error(getTypeError('t.radix', [a, b]));
			};

			$e.asin = function (a) {
				if (isNumber(a)) {
					// inverse sine
					return Math.asin(a);
				}
				error(getTypeError('t.asin', [a]));
			};

			$e.atan2 = function (a, b) {
				if (isNumber(a) && isNumber(b)) {
					// inverse tangent
					return Math.atan2(a, b);
				}
				error(getTypeError('t.atan2', [a, b]));
			};

			$e.ceil = function (a) {
				if (isNumber(a)) {
					// ceil
					return Math.ceil(a);
				}
				error(getTypeError('t.ceil', [a]));
			};

			$e.floor = function (a) {
				if (isNumber(a)) {
					// floor
					return Math.floor(a);
				}
				error(getTypeError('t.floor', [a]));
			};

			$e.abs = function (a) {
				if (isNumber(a)) {
					// absolute value
					return Math.abs(a);
				}
				error(getTypeError('t.abs', [a]));
			};

			$e.clamp = function (a, b, c) {
				if (isNumber(a) && isNumber(b) && isNumber(c)) {
					// clamp
					if (b < a) {
						b = a;
					} else if (b > c) {
						b = c;
					}
					return b;
				}
				error(getTypeError('t.clamp', [a, b, c]));
			};

			$e.cos = function (a) {
				if (isNumber(a)) {
					// cosine
					return Math.cos(a);
				}
				error(getTypeError('t.cos', [a]));
			};

			$e.min = function (a) {
				var i,
					result;
				if (isArray(a)) {
					// minimum
					result = Infinity;
					for (i = 0; i < a.length; i++) {
						if (a[i] < result) {
							result = a[i];
						}
					}
					return result;
				}
				error(getTypeError('t.min', [a]));
			};

			$e.round = function (a) {
				var result,
					i;
				if (isNumber(a) || isString(a)) {
					// round
					return Math.round(a);
				}
				if (isArray(a)) {
					// round
					result = deepCopy(a);
					for (i = 0; i < result.length; i++) {
						result[i] = Math.round(result[i]);
					}
					return result;
				}
				error(getTypeError('t.round', [a]));
			};

			$e.sqrt = function (a) {
				if (isNumber(a)) {
					// square root
					return Math.sqrt(a);
				}
				error(getTypeError('t.sqrt', [a]));
			};

			$e.random = function () {
				// random
				return Math.random();
			};

			$e.sin = function (a) {
				if (isNumber(a)) {
					// sine
					return Math.sin(a);
				}
				error(getTypeError('t.sin', [a]));
			};

			$e.tan = function (a) {
				if (isNumber(a)) {
					// tangent
					return Math.tan(a);
				}
				error(getTypeError('t.tan', [a]));
			};

			$e.popRegex = function (a) {
				if (isArray(a)) {
					// pop
					return a.pop();
				}
				if (isString(a)) {
					// regular expression
					return new RegExp(a);
				}
				error(getTypeError('t.popRegex', [a]));
			};

			$e.replace = function (a, b, c) {
				if ((isString(a) || isRegex(a)) && isString(b) && isString(c)) {
					// replace
					return b.replace(a, c);
				}
				error(getTypeError('t.replace', [a, b, c]));
			};

			$e.unwrap = function (a) {
				if (isArray(a)) {
					// unwrap
					if (a.length === 1) {
						return a[0];
					}
					return a;
				}
				error(getTypeError('t.unwrap', [a]));
			};

			$e.evaluate = function (a) {
				// evaluate
				return eval(a);
			};

			$e.negate = function (a) {
				if (isNumber(a)) {
					// negate
					return -a;
				}
				if (isArray(a)) {
					// reverse
					return deepCopy(a).reverse();
				}
				if (isString(a)) {
					// reverse
					var reversed = '', i;
					for (i = a.length - 1; i >= 0; i--) {
						reversed += a[i];
					}
					return reversed;
				}
				error(getTypeError('t.negate', [a]));
			};

			$e.setLookupIndex = function (a, b, c) {
				if (isArray(a) && isNumber(b) && (isNumber(c) || isString(c) || isArray(c) || isBoolean(c))) {
					// set value at index
					a[b] = c;
					return a;
				}
				if (isString(a) && isNumber(b) && (isNumber(c) || isString(c) || isArray(c) || isBoolean(c))) {
					// set value at index
					return a.substring(0, b) + c + a.substring(b + 1, a.length);
				}
				error(getTypeError('t.setLookupIndex', [a, b, c]));
			};

			$e.any = function (a, b) {
				if (isString(a) || isNumber(a) || isArray(a)) {
					// any
					return $e.range(a).some(b);
				}
				error(getTypeError('t.any', [a, b]));
			};

			$e.charCode = function (a) {
				if (isString(a)) {
					// character code
					return a.charCodeAt(0);
				}
				error(getTypeError('t.charCode', [a]));
			};

			$e.expEnd = function (a) {
				if (isNumber(a)) {
					// exponential
					return Math.exp(a);
				}
				if (isArray(a) || isString(a)) {
					// end
					return a[a.length - 1];
				}
				error(getTypeError('t.expEnd', [a]));
			};

			$e.filter = function (a, b) {
				if (isString(a) || isNumber(a) || isArray(a)) {
					// filter
					return $e.range(a).filter(b);
				}
				error(getTypeError('t.filter', [a, b]));
			};

			$e.indexOf = function (a, b) {
				if ((isArray(a) || isString(a)) && (isNumber(b) || isString(b))) {
					// index of
					return a.indexOf(b);
				}
				error(getTypeError('t.indexOf', [a, b]));
			};

			$e.head = function (a) {
				if (isNumber(a)) {
					// increment
					return a + 1;
				}
				if (isArray(a) || (isString(a))) {
					// head
					return a[0];
				}
				error(getTypeError('t.head', [a]));
			};

			$e.join = function (a, b) {
				var i,
					result;
				if (isArray(a) && (isString(b) || isNumber(b))) {
					// join
					result = '';
					for (i = 0; i < a.length - 1; i++) {
						result += a[i].toString() + b.toString();
					}
					result += a[i];
					return result;
				}
				error(getTypeError('t.join', [a, b]));
			};

			$e.lnLength = function (a) {
				if (isNumber(a)) {
					// natural log
					return Math.log(a);
				}
				if (isArray(a) || isString(a)) {
					// length
					return a.length;
				}
				error(getTypeError('t.lnLength', [a]));
			};

			$e.map = function (a, b) {
				if (isString(a) || isNumber(a) || isArray(a)) {
					// map
					return $e.range(a).map(b);
				}
				error(getTypeError('t.map', [a, b]));
			};

			$e.print = function (a, b) {
				// write to output stream
				var result = a;
				if (result === undefined) {
					result = '';
				}
				if (isArray(a)) {
					a = JSON.stringify(a);
				}
				if (b && printedAlready) {
					print('\n' + a);
				} else {
					printedAlready = true;
					print(a);
				}
				return result;
			};

			$e.equal = function (a, b) {
				// stringify allows for nested array comparisons by value (no support for object/function comparisons)
				return JSON.stringify(a) === JSON.stringify(b);
			};

			$e.range = function (a) {
				if (isNumber(a) || isString(a) || isArray(a)) {
					// range
					return range(a);
				}
				error(getTypeError('t.range', [a]));
			};

			$e.sum = function (a) {
				var i,
					result;
				if (isArray(a)) {
					// sum
					if (a.every(function(v){ return isNumber(v); })) {
						result = 0;
					} else {
						result = '';
					}
					for (i = 0; i < a.length; i++) {
						result += a[i];
					}
					return result;
				}
				error(getTypeError('t.sum', [a]));
			};

			$e.tail = function (a) {
				if (isNumber(a)) {
					// decrement
					return a - 1;
				}
				if (isArray(a) || isString(a)) {
					// tail
					if (a.length === 2) {
						// unwrap because a single element will be returned
						return a[1];
					}
					return a.slice(1, a.length);
				}
				error(getTypeError('t.tail', [a]));
			};

			$e.reduce = function (a, b) {
				if (isString(a) || isNumber(a) || isArray(a)) {
					// reduce
					return $e.range(a).reduce(b);
				}
				error(getTypeError('t.reduce', [a, b]));
			};

			$e.elementWiseAdd = function (a, b) {
				var i,
					result = [];
				if (isArray(a)) {
					// element-wise add
					if (isArray(b)) {
						for (i = 0; i < (a.length < b.length ? a.length : b.length); i++) {
							result.push(a[i] + b[i]);
						}
						return result;
					}
					if (isNumber(b) || isString(b)) {
						for (i = 0; i < a.length; i++) {
							result.push(a[i] + b);
						}
						return result;
					}
				}
				error(getTypeError('t.elementWiseAdd', [a, b]));
			};

			$e.or = function (a, b) {
				return a || b;
			};

			$e.compare = function (a, b) {
				if (isString(a) && isString(b)) {
					// numeric collation is used by left padding shortest string with NUL
					if (a.length > b.length) {
						b = $e.repeat(String.fromCharCode(0), a.length - b.length) + b;
					} else if (b.length > a.length) {
						a = $e.repeat(String.fromCharCode(0), b.length - b.length) + a;
					}
				}
				if ((isString(a) && isString(b)) || (isNumber(a) && isNumber(b))) {
					if (a < b) {
						return -1;
					}
					if (a > b) {
						return 1;
					}
					if (a === b) {
						return 0;
					}
				}
				error(getTypeError('t.compare', [a, b]));
			};

			$e.repeat = function (a, b) {
				var i = 1;
				if (isString(a) && isNumber(b)) {
					while (i < b) {
						a += a;
						i += i;
					}
					return a.substr(0, b);
				}
				error(getTypeError('t.repeat', [a, b]));
			};

			return $e;
		}());

		function lexer(expression, operators) {
			var character,
				previousCharacter,
				position = 0,
				number,
				string,
				tokens = [],
				eof = false;

			function read() {
				character = expression[++position];
				if (position >= expression.length) {
					eof = true;
				}
				return character;
			}

			function peek(amount) {
				amount = amount || 1;
				return expression.substr(position + 1, amount);
			}

			function addToken(type, value, printable) {
				tokens.push({type: type, value: value, printable: printable, splat: value === ':'});
			}

			function isOperator(value) {
				return operators.hasOwnProperty(value);
			}

			function isDigit(value) {
				return (/[0-9]/).test(value);
			}

			function isWhiteSpace(value) {
				return (/\s/).test(value);
			}

			function isQuote(value) {
				return value === '"';
			}

			function isEscaped(value) {
				return value === '\\';
			}

			function isVariable(value) {
				return variables.hasOwnProperty(value);
			}

			while (position < expression.length) {
				previousCharacter = expression[position - 1];
				character = expression[position];
				if (isWhiteSpace(character)) { // whitespace
					read();
				} else if (isEscaped(previousCharacter)) { // escaped
					addToken('string', character, !isWhiteSpace(previousCharacter));
					read();
				} else if (isVariable(character + peek(2))) { // three character variables
					addToken('variable', character + peek(2), !isWhiteSpace(previousCharacter));
					read();
					read();
					read();
				} else if (isOperator(character + peek(2))) { // three character operators
					addToken('operator', character + peek(2), !isWhiteSpace(previousCharacter));
					read();
					read();
					read();
				} else if (isOperator(character + peek(1))) { // two character operators
					addToken('operator', character + peek(1), !isWhiteSpace(previousCharacter));
					read();
					read();
				} else if (isOperator(character)) { // one character operators
					addToken('operator', character, !isWhiteSpace(previousCharacter));
					read();
				} else if (isVariable(character)) { // one character variables
					addToken('variable', character, !isWhiteSpace(previousCharacter));
					read();
				} else if (isDigit(character)) { // number
					number = character;
					while (isDigit(read()) && !eof) {
						number += character;
					}
					if (character === '.' && isDigit(peek(1))) {
						do {
							number += character;
						} while (isDigit(read()) && !eof);
					}
					number = parseFloat(number);
					if (!isFinite(number)) {
						error('Unable to represent number.');
					}
					addToken('number', number, !isWhiteSpace(previousCharacter));
				} else if (isQuote(character)) { // string
					string = '';
					while ((!isQuote(read()) || (isQuote(character) && isEscaped(previousCharacter))) && !eof) {
						if (isQuote(character) && isEscaped(previousCharacter)) {
							string += '"';
						} else {
							string += character;
						}
					}
					read();
					addToken('string', '"' + string + '"', !isWhiteSpace(previousCharacter));
				} else {
					error('Unable to recognize token "' + character + '"');
				}
			}
			return tokens;
		}

		function createOperators() {
			var $o = {},
				getVariable;

			getVariable = (function () {
				var characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz',
					indexes = [0];

				return function nextVariable() {
					var i,
						j,
						returnValue = '_';
					for (i = 0; i < indexes.length; i++) {
						returnValue += characters[indexes[i]];
					}
					variables[returnValue] = 0;
					for (i = indexes.length - 1; i >= 0; i--) {
						if (indexes[i] < characters.length - 1) {
							indexes[i]++;
							for (j = i + 1; j < indexes.length; j++) {
								indexes[j] = 0;
							}
							return returnValue;
						}
					}
					for (i = 0; i < indexes.length; i++) {
						indexes[i] = 0;
					}
					indexes.push(0);
					return returnValue;
				};
			}());

			// operators
			function operator(symbol, functionName, arity, printable, lastPrintable, expression) {
				$o[symbol] = {functionName: functionName, arity: arity, printable: printable, lastPrintable: lastPrintable, expression: expression};
			}

			operator('!', null, 1, true, -1, function (a) { return '(!' + a + ')'; });
			operator('%', 't.mod', 2, true, -1, function (a, b) { return 't.mod(' + a + ',' + b + ')'; });
			operator('&', 't.and', 2, true, -1, function (a, b) { return 't.and(' + a + ',' + b + ')'; });
			operator('*', 't.multiplyRepeat', 2, true, -1, function (a, b) { return 't.multiplyRepeat(' + a + ',' + b + ')'; });
			operator('+', 't.addConcat', 2, true, -1, function (a, b) { return 't.addConcat(' + a + ',' + b + ')'; });
			operator(',', 't.pair', 2, true, -1, function (a, b) { return 't.pair(' + a + ',' + b + ')'; });
			operator('-', 't.subtractRemove', 2, true, -1, function (a, b) { return 't.subtractRemove(' + a + ',' + b + ')'; });
			operator('.ad', 't.allDivisors', 1, true, -1, function (a) { return 't.allDivisors(' + a + ')'; });
			operator('.cn', 't.combinations', 2, true, -1, function (a, b) { return 't.combinations(' + a + ',' + b + ')'; });
			operator('.gc', 't.greatestCommonDivisor', 1, true, -1, function (a) { return 't.greatestCommonDivisor(' + a + ')'; });
			operator('.ip', 't.isPalindrome', 1, true, -1, function (a) { return 't.isPalindrome(' + a + ')'; });
			operator('.lc', 't.leastCommonMultiple', 1, true, -1, function (a) { return 't.leastCommonMultiple(' + a + ')'; });
			operator('.mo', 't.multipleOf', 2, true, -1, function (a, b) { return 't.multipleOf(' + a + ',' + b + ')'; });
			operator('.pd', 't.primeDecomposition', 1, true, -1, function (a) { return 't.primeDecomposition(' + a + ')'; });
			operator('.sc', 't.collatz', 1, true, -1, function (a) { return 't.collatz(' + a + ')'; });
			operator('.sf', 't.fibonacci', 1, true, -1, function (a) { return 't.fibonacci(' + a + ')'; });
			operator('.sp', 't.primes', 1, true, -1, function (a) { return 't.primes(' + a + ')'; });
			operator('.st', 't.triangles', 1, true, -1, function (a) { return 't.triangles(' + a + ')'; });
			operator('.un', 't.uniques', 1, true, -1, function (a) { return 't.uniques(' + a + ')'; });
			operator('/', 't.divideSplit', 2, true, -1, function (a, b) { return 't.divideSplit(' + a + ',' + b + ')'; });
			operator(':', null, 1, false, -1, function (a) { return a; });
			operator(';', null, 0, false, -1, function () { return ';'; });
			operator('<', 't.lessThanLowerSlice', 2, true, -1, function (a, b) { return 't.lessThanLowerSlice(' + a + ',' + b + ')'; });
			operator('=', null, 2, false, -1, function (a, b) { return a + '=' + b + ';'; });
			operator('>', 't.greaterThanUpperSlice', 2, true, -1, function (a, b) { return 't.greaterThanUpperSlice(' + a + ',' + b + ')'; });
			operator('?', 't.ternary', 3, true, -1, function (a, b, c) { return 't.ternary(' + a + ',' + b + ',' + c + ')'; });
			operator('@', 't.getLookupIndex', 2, true, -1, function (a, b) { return 't.getLookupIndex(' + a + ',' + b + ')'; });
			operator('A', 't.all', 3, true, -1, function (a, b, c) { return 't.all(' + a + ',function(' + b + '){return ' + c + ';})'; });
			operator('B<', 't.leftShiftRotate', 2, true, -1, function (a, b) { return 't.leftShiftRotate(' + a + ',' + b + ')'; });
			operator('B>', 't.rightShiftRotate', 2, true, -1, function (a, b) { return 't.rightShiftRotate(' + a + ',' + b + ')'; });
			operator('C', 't.changeCaseFlatten', 1, true, -1, function (a) { return 't.changeCaseFlatten(' + a + ')'; });
			operator('E', null, 3, false, 3, function (a, b, c) {
				var i = getVariable(),
					enumerable = getVariable();
				return enumerable + '=t.range(' + a + ');for(' + i + '=0;' + i + '<' + enumerable + '.length;' + i + '++){' + b + '=' + enumerable + '[' + i + '];' + c + '}';
			});
			operator('F', null, 4, false, 4, function (a, b, c, d) {
				var max = getVariable();
				return max + '=' + c + ';for(' + b + '=' + a + ';' + b + '<' + max + ';' + b + '++){' + d + '}';
			});
			operator('Gb', null, 0, false, -1, function () { return 'break;'; });
			operator('Gc', null, 0, false, -1, function () { return 'continue;'; });
			operator('Gp', null, 1, true, -1, function (a) { return 't.pickRandom(' + a + ')'; });
			operator('I', 't.indexOf', 2, true, -1, function (a, b) { return 't.indexOf(' + a + ',' + b + ')'; });
			operator('M!', 't.factorial', 1, true, -1, function (a) { return 't.factorial(' + a + ')'; });
			operator('M_', 't.sign', 1, true, -1, function (a) { return 't.sign(' + a + ')'; });
			operator('MC', 't.acos', 1, true, -1, function (a) { return 't.acos(' + a + ')'; });
			operator('MM', 't.max', 1, true, -1, function (a) { return 't.max(' + a + ')'; });
			operator('MR', 't.radix', 2, true, -1, function (a, b) { return 't.radix(' + a + ',' + b + ')'; });
			operator('MS', 't.asin', 1, true, -1, function (a) { return 't.asin(' + a + ')'; });
			operator('MT', 't.atan2', 2, true, -1, function (a, b) { return 't.atan2(' + a + ',' + b + ')'; });
			operator('M]', 't.ceil', 1, true, -1, function (a) { return 't.ceil(' + a + ')'; });
			operator('M[', 't.floor', 1, true, -1, function (a) { return 't.floor(' + a + ')'; });
			operator('Ma', 't.abs', 1, true, -1, function (a) { return 't.abs(' + a + ')'; });
			operator('Mb', 't.clamp', 3, true, -1, function (a, b, c) { return 't.clamp(' + a + ',' + b + ',' + c + ')'; });
			operator('Mc', 't.cos', 1, true, -1, function (a) { return 't.cos(' + a + ')'; });
			operator('Mm', 't.min', 1, true, -1, function (a) { return 't.min(' + a + ')'; });
			operator('Mo', 't.round', 1, true, -1, function (a) { return 't.round(' + a + ')'; });
			operator('Mq', 't.sqrt', 1, true, -1, function (a) { return 't.sqrt(' + a + ')'; });
			operator('Mr', 't.random', 0, true, -1, function () { return 't.random()'; });
			operator('Ms', 't.sin', 1, true, -1, function (a) { return 't.sin(' + a + ')'; });
			operator('Mt', 't.tan', 1, true, -1, function (a) { return 't.tan(' + a + ')'; });
			operator('P', 't.popRegex', 1, true, -1, function (a) { return 't.popRegex(' + a + ')'; });
			operator('Q', 't.evaluate', 1, true, -1, function (a) { return 't.evaluate(' + a + ')'; });
			operator('R', 't.replace', 3, true, -1, function (a, b, c) { return 't.replace(' + a + ',' + b + ',' + c + ')'; });
			operator('U', 't.unwrap', 1, true, -1, function (a) { return 't.unwrap(' + a + ')'; });
			operator('W', null, 2, false, -1, function (a, b) { return 'while(' + a + '){' + b + '}'; });
			operator('\\', null, 1, true, -1, function (a) { return '\'' + a + '\''; });
			operator('^', 't.pow', 2, true, -1, function (a, b) { return 't.pow(' + a + ',' + b + ')'; });
			operator('_', 't.negate', 1, true, -1, function (a) { return 't.negate(' + a + ')'; });
			operator('`', 't.setLookupIndex', 3, true, -1, function (a, b, c) { return 't.setLookupIndex(' + a + ',' + b + ',' + c + ')'; });
			operator('a', 't.any', 3, true, -1, function (a, b, c) { return 't.any(' + a + ',function(' + b + '){return ' + c + ';})'; });
			operator('b', null, 3, false, 3, function (a, b, c) {
				var max = getVariable();
				return max + '=' + b + ';for(' + a + '=0;' + a + '<' + max + ';' + a + '++){' + c + '}';
			});
			operator('c', 't.charCode', 1, true, -1, function (a) { return 't.charCode(' + a + ')'; });
			operator('d', null, 3, false, -1, function (a, b, c) {
				var i = getVariable(),
					max = getVariable();
				return max + '=' + a + ';for(' + i + '=0;' + i + '<' + max + ';' + i + '++){' + b + '=' + c + ';}';
			});
			operator('e', 't.expEnd', 1, true, -1, function (a) { return 't.expEnd(' + a + ')'; });
			operator('f', 't.filter', 3, true, -1, function (a, b, c) { return 't.filter(' + a + ',function(' + b + '){return ' + c + ';})'; });
			operator('h', 't.head', 1, true, -1, function (a) { return 't.head(' + a + ')'; });
			operator('j', 't.join', 2, true, -1, function (a, b) { return 't.join(' + a + ',' + b + ')'; });
			operator('k', null, 3, false, -1, function (a, b, c) {
				var expand = getVariable();
				return expand + '=' + b + ';' + a + '=' + expand + '[0];' + c + '=' + expand + '[1];';
			});
			operator('l', 't.lnLength', 1, true, -1, function (a) { return 't.lnLength(' + a + ')'; });
			operator('m', 't.map', 3, true, -1, function (a, b, c) { return 't.map(' + a + ',function(' + b + '){return ' + c + ';})'; });
			operator('p', 't.print', 1, false, -1, function (a) { return 't.print(' + a + ',false);'; });
			operator('q', 't.equal', 2, true, -1, function (a, b) { return 't.equal(' + a + ',' + b + ')'; });
			operator('r', 't.range', 1, true, -1, function (a) { return 't.range(' + a + ')'; });
			operator('s', 't.sum', 1, true, -1, function (a) { return 't.sum(' + a + ')'; });
			operator('t', 't.tail', 1, true, -1, function (a) { return 't.tail(' + a + ')'; });
			operator('u', 't.reduce', 4, true, -1, function (a, b, c, d) {return 't.reduce(' + a + ',function(' + b + ',' + c + '){return ' + d + ';})'; });
			operator('v', 't.elementWiseAdd', 2, true, -1, function (a, b) { return 't.elementWiseAdd(' + a + ',' + b + ')'; });
			operator('w', null, 1, true, -1, function (a) { return '[' + a + ']'; });
			operator('|', 't.or', 2, true, -1, false, function (a, b) { return 't.or(' + a + ',' + b + ')'; });
			operator('~', 't.compare', 2, true, -1, function (a, b) { return 't.compare(' + a + ',' + b + ')'; });
			return $o;
		}

		function compiler(tokens, operators) {
			var stack = [],
				token,
				args,
				i,
				variable,
				output = '',
				lastArg,
				referencedVariables = [];

			// remove unreferenced variables
			for (i = 0; i < tokens.length; i++) {
				if (tokens[i].type === 'variable' && referencedVariables.indexOf(tokens[i].value) === -1) {
					referencedVariables.push(tokens[i].value);
				}
			}
			for (variable in variables) {
				if (variables.hasOwnProperty(variable) && referencedVariables.indexOf(variable) === -1) {
					delete variables[variable];
				}
			}

			while (tokens.length > 0) {
				token = tokens.pop();
				if (token.type === 'operator' && operators[token.value]) { // operator
					args = [];
					for (i = 0; i < operators[token.value].arity; i++) {
						if (stack.length === 0) {
							error('Operator \'' + token.value + '\' (position ' + tokens.length +  ') has arity of ' + operators[token.value].arity + ' (not ' + args.length + ')');
						}
						lastArg = stack.pop();
						if (lastArg.splat) {
							args.push(lastArg.value);
							break;
						}
						if (!operators[token.value].printable && operators[token.value].lastPrintable === args.length + 1) {
							if (lastArg.printable) {
								lastArg.value = 't.print(' + lastArg.value + ',true);';
							}
						}
						args.push(lastArg.value);
					}
					if (args.length === 1 && lastArg.splat) {
						if (operators[token.value].functionName === null) {
							error('Operator \'' + token.value + '\' (position ' + tokens.length +  ') cannot be used with splat operator');
						} else {
							stack.push({type: 'expression', value: operators[token.value].functionName + '.apply(this,' + args[0] + ')', printable: operators[token.value].printable && token.printable, splat: token.splat});
						}
					} else {
						stack.push({type: 'expression', value: operators[token.value].expression.apply(null, args), printable: operators[token.value].printable && token.printable, splat: token.splat});
					}
				} else { // operand
					stack.push(token);
				}
			}

			output += '(function(t';
			for (variable in variables) {
				if (variables.hasOwnProperty(variable)) {
					output += ',' + variable;
				}
			}
			output += '){';
			for (i = stack.length - 1; i >= 0; i--) {
				if (stack[i].printable) {
					output += 't.print(' + stack[i].value + ',true);';
				} else {
					output += stack[i].value;
				}
			}
			output += '}(environment';
			for (variable in variables) {
				if (variables.hasOwnProperty(variable)) {
					output += ',' + JSON.stringify(variables[variable]);
				}
			}
			output += '));';
			return output;
		}

		function evaluate(options) {
			if (!options) {
				return;
			}
			options.input = options.input || [];
			options.debug = options.debug || false;
			print = options.print || function (output) { console.log(output); };

			var compiled,
				operators = createOperators();

			// variables
			variables = {
				N: '\n',
				X: 0,
				Y: 1,
				Z: 10,
				x: [],
				y: ' ',
				z: 'abcdefghijklmnopqrstuvwxyz',
				$hw: 'Hello, world!',
				$tt: 'Touton',
				// constants
				$ec: 2.718281828459045,
				$gr: 1.618033988749895,
				$pi: 3.141592653589793,
				$pc: 1.4142135623730951,
				$rh: 0.7071067811865476,
				$tk: 1e4,
				$hk: 1e5,
				// SI prefixes
				$sy: 1e-24,
				$sz: 1e-21,
				$sa: 1e-18,
				$sf: 1e-15,
				$sp: 1e-12,
				$sn: 1e-9,
				$su: 1e-6,
				$sm: 1e-3,
				$sc: 1e-2,
				$sd: 1e-1,
				$sh: 1e2,
				$sk: 1e3,
				$sM: 1e6,
				$sG: 1e9,
				$sT: 1e12,
				$sP: 1e15,
				$sE: 1e18,
				$sZ: 1e21,
				$sY: 1e24
			};

			if (options.input.length === 0) {
				variables.i = 0;
			} else if (options.input.length === 1) {
				variables.i = options.input[0];
			} else {
				variables.i = options.input;
			}

			compiled = compiler(lexer(options.expression, operators), operators);
			if (options.debug) {
				print(compiled + '\n');
			}
			eval(compiled);
		}

		return evaluate(options);
	};

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') { // node
		module.exports = touton;
	} else if (typeof define === 'function' && define.amd) { // amd
		define([], function () {
			return touton;
		});
	} else if (typeof window !== 'undefined') { // browser
		window.touton = touton;
	}
}());