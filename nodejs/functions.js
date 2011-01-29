var sys = require('sys');

/**
 * Formats the chat log to be prepended with a date and separator. Similar
 * to irssi messages when received.
 * @param {string} message The message to format.
 */
chatlog = function (message) {
  var date = new Date();
  return date.getHours() + ':' +
      date.getMinutes() + ':' +
      date.getSeconds() + ' -!- ' + message;
};

/**
 * Logging into the servers console.
 * @Override
 */
syslog = function (message){
  sys.log('\033[0;32m' + message + '\033[0m');
};

/**
 * Allow functions to be binding to the scope defined. Small hack where we want
 * to append the argument array with custom arguments.
 *
 * @param {Object} scope The scope to bind agains.
 * @param {Array<?>} extraargs If binding requires extra arguments than defined
 *                             in the original prototype
 */
Function.prototype.bind = function (scope, extraargs) {
  var _function = this;
  return function() {
    var args = arguments;
    if (extraargs) {
      args = extraargs.concat(arguments[0]);
    }
    return _function.apply(scope, args);
  };
};

if (Function.introspect === undefined) {
  Function.introspect = function (func) {
    var functionName,
      functionArgs = '',
      functionArgNames = [],
      functionCode,
      functionIsNative = false,
      regexResult;

    var functionCode = func.toString();

    if (functionCode.indexOf('(') !== -1) {
      // Grep function's name, if any.
      regexResult = /function ([^(]+)/.exec(functionCode);
      if (regexResult !== null) {
        functionName = regexResult[1];
        //functionName = functionName.replace(/\s*(.*)\s*/,'$1');
        functionName = functionName.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      }
      // Grep functions args, if any.
      regexResult = /\((.*\w.*)\)/.exec(functionCode);
      if (regexResult !== null) {
        functionArgs = regexResult[1];
        //  Toss whitespace.
        functionArgs = functionArgs.replace(/\s/g,'');
        functionArgNames = functionArgs.split(',');
      }

      // Strip 'function(){' portion off code string.
      functionCode = functionCode.substring(functionCode.indexOf('{')+1, functionCode.lastIndexOf('}'));
      //  Trim whitespace.
      functionCode = functionCode.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

      if (functionCode === '[native code]') {
        functionIsNative = true;
      }
    } else {
      // QUIRK
      // For TypeError.toString(), IE6-7 return '[object Error]' while IE8 returns just 'Error'.
      // Fortunately IE6-8 support TypeError.name, which return 'TypeError'.
      functionName = func.name;
      functionCode = '[native code]';
      functionIsNative = true;
    }

    return {name:functionName, argNames:functionArgNames, args:functionArgs, code:functionCode, isNative:functionIsNative};
  };
}
