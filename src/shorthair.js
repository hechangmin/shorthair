var shorthair = (function(){

    var jcon = require('jcon');

    var parser = jcon.string('hello');

    return parser;

}());

(function(identifier, mod){
    var isAmd = typeof define === 'function',
    isCommonJs = typeof module === 'object' && !!module.exports;

    if (isAmd) {
        define(mod);
    } else if (isCommonJs) {
        module.exports = mod;
    }

}('shorthair', shorthair));
