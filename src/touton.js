(function () {
	'use strict';
	var touton = function (options) {
		var print = function (output) {
			console.log(output);
		};

		function error(errorText) {
			print(errorText);
			throw new Error(errorText);
		}

		/*eslint-disable no-unused-vars*/
		var environment = (function () {
		/*eslint-enable no-unused-vars*/
			var $e = {};

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

			$e.normalize = function (a) {
				if (isArray(a)) {
					if (a.length === 1) {
						if (isArray(a[0])) {
							return a[0].slice(0);
						}
						return a[0];
					}
					return a.slice(0);
				}
				return a;
			};

			$e.mod = function (a, b) {
				a = $e.normalize(a);
				b = $e.normalize(b);
				if (isNumber(a) && isNumber(b)) {
					// modulus
					return a % b;
				}
				error(getTypeError('t.mod', [a, b]));
			};

			$e.multiplyRepeat = function (a, b) {
				var i,
					result = [],
					j;
				a = $e.normalize(a);
				b = $e.normalize(b);
				if (isNumber(a) && isNumber(b)) {
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
				if (isArray(a) && isArray(b)) {
					// cartesian product
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < b.length; j++) {
							result.push(a[i] * b[j]);
						}
					}
					return result;
				}
				if (isString(a) && isString(b)) {
					// cartesian product
					for (i = 0; i < a.length; i++) {
						for (j = 0; j < b.length; j++) {
							result.push(a[i] + b[j]);
						}
					}
					return result;
				}
				if (isString(a) && isNumber(b)) {
					// repeat
					return $e.repeat(a, b);
				}
				error(getTypeError('t.multiply', [a, b]));
			};

			$e.addConcat = function (a, b) {
				var result;
				a = $e.normalize(a);
				b = $e.normalize(b);
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
					result = a;
					result.push(b);
					return result;
				}
				if ((isNumber(a) || isString(a)) && isArray(b)) {
					// unshift
					result = b;
					b.unshift(a);
					return result;
				}
				error(getTypeError('t.addConcat', [a, b]));
			};

			$e.subtractRemove = function (a, b) {
				var result,
					index;
				a = $e.normalize(a);
				b = $e.normalize(b);
				if (isNumber(a) && isNumber(b)) {
					// subtract
					return a - b;
				}
				if (isArray(a) && (isNumber(b) || isString(b))) {
					// remove
					index = a.indexOf(b);
					if (index > -1) {
						result = a;
						result.splice(index, 1);
					}
					return result;
				}
				error(getTypeError('t.subtractRemove', [a, b]));
			};

			$e.divideSplit = function (a, b) {
				var i,
					result = [];
				a = $e.normalize(a);
				b = $e.normalize(b);
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
				error(getTypeError('t.divideSplit', [a, b]));
			};

			$e.pow = function (a, b) {
				a = $e.normalize(a);
				b = $e.normalize(b);
				if (isNumber(a) && isNumber(b)) {
					// power
					return Math.pow(a, b);
				}
				error(getTypeError('t.pow', [a, b]));
			};

			$e.lessThanLowerSlice = function (a, b) {
				a = $e.normalize(a);
				b = $e.normalize(b);
				if ((isNumber(a) || isString(a)) && (isNumber(b) && isString(b))) {
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
				a = $e.normalize(a);
				b = $e.normalize(b);
				if ((isNumber(a) || isString(a)) && (isNumber(b) && isString(b))) {
					// greater than
					return a < b;
				}
				if (isArray(a) && isNumber(b)) {
					if (a.length - b < 0) {
						return [];
					}
					return a.slice(a.length - b, a.length);
				}
				error(getTypeError('t.greaterThanUpperSlice', [a, b]));
			};

			$e.getLookupIndex = function (a, b) {
				a = $e.normalize(a);
				b = $e.normalize(b);
				if ((isArray(a) || isString(a)) && isNumber(b)) {
					// read value at index
					return a[b];
				}
				error(getTypeError('t.getLookupIndex', [a, b]));
			};

			$e.flatten = function (a) {
				a = $e.normalize(a);
				if (isArray(a)) {
					// flatten
					return [].concat.apply([], a);
				}
				error(getTypeError('t.flatten', [a]));
			};

			$e.changeCase = function (a) {
				var i,
					result;
				a = $e.normalize(a);
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
				error(getTypeError('t.changeCase', [a]));
			};

			$e.factorial = function (a) {
				var value = 1,
					i;
				a = $e.normalize(a);
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
				a = $e.normalize(a);
				if (isNumber(a)) {
					// sign
					return Math.sign(a);
				}
				error(getTypeError('t.sign', [a]));
			};

			$e.pickRandom = function (a) {
				a = $e.normalize(a);
				if (isArray(a)) {
					// pick random
					return a[Math.floor(Math.random() * a.length)];
				}
				error(getTypeError('t.pickRandom', [a]));
			};

			$e.acos = function (a) {
				a = $e.normalize(a);

				if (isNumber(a)) {
					// inverse cosine
					return Math.acos(a);
				}
				error(getTypeError('t.acos', [a]));
			};

			$e.max = function (a) {
				a = $e.normalize(a);

				if (isArray(a)) {
					// maximum
					return Math.max.apply(null, $e.normalize(a));
				}
				error(getTypeError('t.max', [a]));
			};

			$e.radix = function (a, b) {
				a = $e.normalize(a);
				b = $e.normalize(b);
				if ((isNumber(a) || isString(a)) && isNumber(b)) {
					// radix
					return a.toString(b);
				}
				error(getTypeError('t.radix', [a, b]));
			};

			$e.asin = function (a) {
				a = $e.normalize(a);
				if (isNumber(a)) {
					// inverse sine
					return Math.asin(a);
				}
				error(getTypeError('t.asin', [a]));
			};

			$e.atan2 = function (a, b) {
				a = $e.normalize(a);
				b = $e.normalize(b);
				if (isNumber(a) && isNumber(b)) {
					// inverse tangent
					return Math.atan2(a, b);
				}
				error(getTypeError('t.atan2', [a, b]));
			};

			$e.ceil = function (a) {
				a = $e.normalize(a);
				if (isNumber(a)) {
					// ceil
					return Math.ceil(a);
				}
				error(getTypeError('t.ceil', [a]));
			};

			$e.floor = function (a) {
				a = $e.normalize(a);
				if (isNumber(a)) {
					// floor
					return Math.floor(a);
				}
				error(getTypeError('t.floor', [a]));
			};

			$e.abs = function (a) {
				a = $e.normalize(a);
				if (isNumber(a)) {
					// absolute value
					return Math.abs(a);
				}
				error(getTypeError('t.abs', [a]));
			};

			$e.clamp = function (a, b, c) {
				a = $e.normalize(a);
				b = $e.normalize(b);
				c = $e.normalize(c);
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
				a = $e.normalize(a);
				if (isNumber(a)) {
					// cosine
					return Math.cos(a);
				}
				error(getTypeError('t.cos', [a]));
			};

			$e.min = function (a) {
				a = $e.normalize(a);
				if (isArray(a)) {
					// minimum
					return Math.min.apply(null, a);
				}
				error(getTypeError('t.min', [a]));
			};

			$e.round = function (a) {
				a = $e.normalize(a);
				if (isNumber(a)) {
					// round
					return Math.round(a);
				}
				error(getTypeError('t.round', [a]));
			};

			$e.sqrt = function (a) {
				a = $e.normalize(a);
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
				a = $e.normalize(a);
				if (isNumber(a)) {
					// sine
					return Math.sin(a);
				}
				error(getTypeError('t.sin', [a]));
			};

			$e.tan = function (a) {
				a = $e.normalize(a);
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
				a = $e.normalize(a);
				b = $e.normalize(b);
				c = $e.normalize(c);
				if ((isString(a) || isRegex(a)) && isString(b) && isString(c)) {
					// replace
					return b.replace(a, c);
				}
				error(getTypeError('t.replace', [a, b, c]));
			};

			$e.evaluate = function (a) {
				// evaluate
				return eval(a);
			};

			$e.negate = function (a) {
				a = $e.normalize(a);
				if (isNumber(a)) {
					// negate
					return -a;
				}
				if (isArray(a)) {
					// reverse
					return a.reverse();
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
				a = $e.normalize(a);
				b = $e.normalize(b);
				c = $e.normalize(c);
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

			$e.charCode = function (a) {
				a = $e.normalize(a);
				if (isString(a)) {
					// character code
					return a.charCodeAt(0);
				}
				error(getTypeError('t.charCode', [a]));
			};

			$e.expEnd = function (a) {
				a = $e.normalize(a);
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

			$e.indexOf = function (a, b) {
				a = $e.normalize(a);
				b = $e.normalize(b);
				if ((isArray(a) || isString(a)) && (isNumber(b) || isString(b))) {
					// index of
					return a.indexOf(b);
				}
				error(getTypeError('t.indexOf', [a, b]));
			};

			$e.head = function (a) {
				a = $e.normalize(a);
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
				a = $e.normalize(a);
				b = $e.normalize(b);
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
				a = $e.normalize(a);
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

			$e.print = function (a) {
				// write to output stream
				var result = $e.normalize(a);
				if (result === undefined) {
					result = '';
				}
				print(a + '\n');
				return result;
			};

			$e.range = function (a) {
				var i,
					result = [];
				a = $e.normalize(a);
				if (isNumber(a)) {
					// range
					for (i = 0; i < a; i++) {
						result.push(i);
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
				error(getTypeError('t.range', [a]));
			};

			$e.sum = function (a) {
				var i,
					result;
				a = $e.normalize(a);
				if (isArray(a)) {
					// sum
					result = '';
					for (i = 0; i < a.length; i++) {
						result += a[i];
					}
					return result;
				}
				error(getTypeError('t.sum', [a]));
			};

			$e.tail = function (a) {
				a = $e.normalize(a);
				if (isNumber(a)) {
					// decrement
					return a - 1;
				}
				if (isArray(a) || isString(a)) {
					// tail
					return a.slice(1, a.length);
				}
				error(getTypeError('t.tail', [a]));
			};

			$e.elementWiseAdd = function (a, b) {
				var i,
					result = [];
				a = $e.normalize(a);
				b = $e.normalize(b);
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

			$e.compare = function (a, b) {
				a = $e.normalize(a);
				b = $e.normalize(b);
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
				a = $e.normalize(a);
				b = $e.normalize(b);
				if (isString(a) && isString(b)) {
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

		function lexer(expression, operators, variables) {
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
				return expression[position + amount];
			}

			function addToken(type, value, printable) {
				tokens.push({type: type, value: value, printable: printable});
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
				} else if (isOperator(character + peek(1))) { // two character operators
					addToken('operator', character + peek(1), !isWhiteSpace(previousCharacter));
					read();
					read();
				} else if (isOperator(character)) { // single character operators
					addToken('operator', character, !isWhiteSpace(previousCharacter));
					read();
				} else if (isVariable(character)) { // variables
					addToken('variable', character, !isWhiteSpace(previousCharacter));
					read();
				} else if (isDigit(character)) { // number
					number = character;
					while (isDigit(read()) && !eof) {
						number += character;
					}
					if (character === '.') {
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
					error('Unable to recognize token.');
				}
			}
			return tokens;
		}

		function createOperators(variables) {
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
			function operator(symbol, arity, printable, lastPrintable, expression) {
				$o[symbol] = {arity: arity, printable: printable, lastPrintable : lastPrintable, expression: expression};
			}

			operator(';', 0, false, -1, function () { return ';'; });
			operator('!', 1, true, -1, function (a) { return '(!' + a + ')'; });
			operator('\\', 1, true, -1, function (a) { return '"' + a + '"'; });
			operator('&', 2, true, -1, false, function (a, b) { return '(' + a + '&&' + b + ')'; });
			operator('%', 2, true, -1, function (a, b) { return 't.mod(' + a + ',' + b + ')'; });
			operator('*', 2, true, -1, function (a, b) { return 't.multiplyRepeat(' + a + ',' + b + ')'; });
			operator('+', 2, true, -1, function (a, b) { return 't.addConcat(' + a + ',' + b + ')'; });
			operator(',', 2, true, -1, function (a, b) { return '[' + a + ',' + b + ']'; });
			operator('-', 2, true, -1, function (a, b) { return 't.subtractRemove(' + a + ',' + b + ')'; });
			operator('/', 2, true, -1, function (a, b) { return 't.divideSplit(' + a + ',' + b + ')'; });
			operator('^', 2, true, -1, function (a, b) { return 't.pow(' + a + ',' + b + ')'; });
			operator('<', 2, true, -1, function (a, b) { return 't.lessThanLowerSlice(' + a + ',' + b + ')'; });
			operator('=', 2, false, -1, function (a, b) { return a + '=' + b + ';'; });
			operator('>', 2, true, -1, function (a, b) { return 't.greaterThanUpperSlice(' + a + ',' + b + ')'; });
			operator('?', 3, true, -1, function (a, b, c) { return '(' + b + '?' + a + ':' + c + ')'; });
			operator('@', 2, true, -1, function (a, b) { return 't.getLookupIndex(' + a + ',' + b + ')'; });
			operator('A&', 1, true, -1, function (a) { return '(' + a + '[0]&&' + a + '[1])'; });
			operator('A%', 1, true, -1, function (a) { return 't.mod(' + a + '[0],' + a + '[1])'; });
			operator('A*', 1, true, -1, function (a) { return 't.multiplyRepeat(' + a + '[0],' + a + '[1])'; });
			operator('A+', 1, true, -1, function (a) { return 't.addConcat(' + a + '[0],' + a + '[1])'; });
			operator('A-', 1, true, -1, function (a) { return 't.subtractRemove(' + a + '[0],' + a + '[1])'; });
			operator('A/', 1, true, -1, function (a) { return 't.divideSplit(' + a + '[0],' + a + '[1])'; });
			operator('A^', 1, true, -1, function (a) { return 't.pow(' + a + '[0],' + a + '[1])'; });
			operator('A<', 1, true, -1, function (a) { return 't.lessThanLowerSlice(' + a + '[0],' + a + '[1])'; });
			operator('A=', 3, false, -1, function (a, b, c) { return a + '=' + b + '[0];' + c + '=' + b + '[1];'; });
			operator('A>', 1, true, -1, function (a) { return 't.greaterThanUpperSlice(' + a + '[0],' + a + '[1])'; });
			operator('A?', 2, true, -1, function (a, b) { return '(' + a + '?' + b + '[0]:' + b + '[1])'; });
			operator('AP', 1, true, -1, function (a) { return 't.pickRandom(' + a + ')'; });
			operator('Af', 1, true, -1, function (a) { return 't.flatten(' + a + ')'; });
			operator('Ai', 2, true, -1, function (a) { return '(' + a + '[0]===' + a + '[1])'; });
			operator('A|', 2, true, -1, function (a) { return '(' + a + '[0]||' + a + '[1])'; });
			operator('A~', 1, true, -1, function (a) { return 't.compare(' + a + '[0],' + a + '[1])'; });
			operator('C', 1, true, -1, function (a) { return 't.changeCase(' + a + ')'; });
			operator('E', 3, false, 3, function (a, b, c) {
				var i = getVariable(),
					enumerable = getVariable();
				return enumerable + '=t.range(' + a + ');for(' + i + '=0;' + i + '<' + enumerable + '.length;' + i + '++){' + b + '=' + enumerable + '[' + i + '];' + c + '}';
			});
			operator('F', 0, false, -1, function () { return 'false'; });
			operator('Gb', 0, false, -1, function () { return 'break;'; });
			operator('Gc', 0, false, -1, function () { return 'continue;'; });
			operator('I', 2, true, -1, function (a, b) { return 't.indexOf(' + a + ',' + b + ')'; });
			operator('M!', 1, true, -1, function (a) { return 't.factorial(' + a + ')'; });
			operator('M_', 1, true, -1, function (a) { return 't.sign(' + a + ')'; });
			operator('MC', 1, true, -1, function (a) { return 't.acos(' + a + ')'; });
			operator('MM', 1, true, -1, function (a) { return 't.max(' + a + ')'; });
			operator('MR', 2, true, -1, function (a, b) { return 't.radix(' + a + ',' + b + ')'; });
			operator('MS', 1, true, -1, function (a) { return 't.asin(' + a + ')'; });
			operator('MT', 2, true, -1, function (a, b) { return 't.atan2(' + a + ',' + b + ')'; });
			operator('M]', 1, true, -1, function (a) { return 't.ceil(' + a + ')'; });
			operator('M[', 1, true, -1, function (a) { return 't.floor(' + a + ')'; });
			operator('Ma', 1, true, -1, function (a) { return 't.abs(' + a + ')'; });
			operator('Mb', 3, true, -1, function (a, b, c) { return 't.clamp(' + a + ',' + b + ',' + c + ')'; });
			operator('Mc', 1, true, -1, function (a) { return 't.cos(' + a + ')'; });
			operator('Mm', 1, true, -1, function (a) { return 't.min(' + a + ')'; });
			operator('Mo', 1, true, -1, function (a) { return 't.round(' + a + ')'; });
			operator('Mq', 1, true, -1, function (a) { return 't.sqrt(' + a + ')'; });
			operator('Mr', 0, true, -1, function () { return 't.random()'; });
			operator('Ms', 1, true, -1, function (a) { return 't.sin(' + a + ')'; });
			operator('Mt', 1, true, -1, function (a) { return 't.tan(' + a + ')'; });
			operator('P', 1, true, -1, function (a) { return 't.popRegex(' + a + ')'; });
			operator('R', 3, true, -1, function (a, b, c) { return 't.replace(' + a + ',' + b + ',' + c + ')'; });
			operator('T', 0, false, -1, function () { return 'true'; });
			operator('V', 1, true, -1, function (a) { return 't.evaluate(' + a + ')'; });
			operator('_', 1, true, -1, function (a) { return 't.negate(' + a + ')'; });
			operator('`', 3, true, -1, function (a, b, c) { return 't.setLookupIndex(' + a + ',' + b + ',' + c + ')'; });
			operator('c', 1, true, -1, function (a) { return 't.charCode(' + a + ')'; });
			operator('d', 3, false, -1, function (a, b, c) {
				var i = getVariable(),
					max = getVariable();
				return max + '=' + a + ';for(' + i + '=0;' + i + '<' + max + ';' + i + '++){' + b + '=' + c + ';}';
			});
			operator('e', 1, true, -1, function (a) { return 't.expEnd(' + a + ')'; });
			operator('f', 4, false, 3, function (a, b, c, d) {
				var max = getVariable();
				return max + '=' + c + ';for(' + b + '=' + a + ';' + b + '<' + max + ';' + b + '++){' + d + '}';
			});
			operator('h', 1, true, -1, function (a) { return 't.head(' + a + ')'; });
			operator('j', 2, true, -1, function (a, b) { return 't.join(' + a + ',' + b + ')'; });
			operator('l', 1, true, -1, function (a) { return 't.lnLength(' + a + ')'; });
			operator('m', 3, true, 2, function (a, b, c) {
				return 't.range(' + a + ').map(function(' + b + '){return ' + c + ';})';
			});
			operator('p', 1, false, -1, function (a) { return 't.print(' + a + ');'; });
			operator('q', 2, true, -1, function (a, b) { return '(' + a + '===' + b + ')'; });
			operator('r', 1, true, -1, function (a) { return 't.range(' + a + ')'; });
			operator('s', 1, true, -1, function (a) { return 't.sum(' + a + ')'; });
			operator('t', 1, true, -1, function (a) { return 't.tail(' + a + ')'; });
			operator('u', 3, false, 2, function (a, b, c) {
				var max = getVariable();
				return max + '=' + b + ';for(' + a + '=0;' + a + '<' + max + ';' + a + '++){' + c + '}';
			});
			operator('v', 2, true, -1, function (a, b) { return 't.elementWiseAdd(' + a + ',' + b + ')'; });
			operator('w', 1, true, -1, function (a) { return '[' + a + ']'; });
			operator('|', 2, true, -1, false, function (a, b) { return '(' + a + '||' + b + ')'; });
			operator('~', 3, true, -1, function (a, b, c) { return 't.compare(' + a + ',' + b + ',' + c + ')'; });
			return $o;
		}

		function compiler(tokens, operators, variables) {
			var stack = [],
				token,
				args,
				i,
				output = '',
				variable,
				arg;

			while (tokens.length >  0) {
				token = tokens.pop();
				if (token.type === 'operator' && operators[token.value]) { // operator
					args = [];
					for (i = 0; i < operators[token.value].arity; i++) {
						if (stack.length === 0) {
							error('Operator \'' + token.value + '\' has arity of ' + operators[token.value].arity + ' (not ' + args.length + ')');
						}
						arg = stack.pop();
						if (!operators[token.value].printable && operators[token.value].lastPrintable === args.length + 1) {
							if (arg.printable) {
								arg.value = 't.print(' + arg.value + ');';
							}
						}
						args.push(arg.value);
					}
					stack.push({type: 'expression', value: operators[token.value].expression.apply(null, args), printable: operators[token.value].printable && token.printable});
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
			output += '){t=this;';
			for (i = stack.length - 1; i >= 0; i--) {
				if (stack[i].printable) {
					output += 't.print(' + stack[i].value + ');';
				} else {
					output += stack[i].value;
				}
			}
			output += '}.call(environment,0';
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

			var variables = {},
				operators = {},
				tokens = [],
				compiled;

			// variables
			if (options.input.length === 0) {
				variables.i = 0;
			} else if (options.input.length === 1) {
				variables.i = options.input[0];
			} else {
				variables.i = options.input.slice(0);
			}

			variables.X = 0;
			variables.Y = 1;
			variables.Z = 10;
			variables.x = [];
			variables.y = ' ';
			variables.z = 'abcdefghijklmnopqrstuvwxyz';

			operators = createOperators(variables);
			tokens = lexer(options.expression, operators, variables);
			compiled = compiler(tokens, operators, variables);
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