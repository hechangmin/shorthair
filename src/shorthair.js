/**
 *
 * css3-selector
 *
 * 参考：http://www.w3.org/TR/css3-selectors/#w3cselgrammar
 * 参考：http://www.w3.org/TR/css3-selectors/
 *
 */
var shorthair = (function(){

    var jcon = require('jcon');


    //css3-selector基本正则定义
    var nonascii = jcon.regex(/[^\0-\177]/);
    var unicode = jcon.regex(/\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?/);
    var nmchar = jcon.regex(/[_a-z0-9-]/).or(nonascii, escape);
    var nmstart = jcon.regex(/[_a-z]/).or(nonascii, escape);
    var ident = jcon.regex(/[-]?/).seq(nmstart,nmchar.many());
    var name = nmchar.least(1);
    var escape = unicode.or(jcon.regex(/\\[^\n\r\f0-9a-f]/));
    var num = jcon.regex(/[0-9]+|[0-9]*\.[0-9]+/);
    var nl = jcon.regex(/\n|\r\n|\r|\f/);
    var string1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many(), jcon.string('"'));
    var string2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many(), jcon.string('"'));
    var string = string1.or(string2);
    var invalid1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many());
    var invalid2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many());
    var invalid = invalid1.or(invalid2);
    var w = jcon.regex(/[ \t\r\n\f]*/);

    //var D = d.or(jcon.regex(/\\0{0,4}(44|64)(\r\n|[ \t\r\n\f])?/));
    var O = jcon.string('o').or(jcon.regex(/\\0{0,4}(4f|6f)(\r\n|[ \t\r\n\f])?/)).or(jcon.string('\\o'));
    var T = jcon.string('t').or(jcon.regex(/\\0{0,4}(54|74)(\r\n|[ \t\r\n\f])?/)).or(jcon.string('\\t'));


    //css3-selector词法单元定义
    var S = jcon.regex(/[ \t\r\n\f]+/);
    var INCLUDES = jcon.string('~=');
    var DASHMATCH = jcon.string('|=');
    var PREFIXMATCH = jcon.string('^=');
    var SUFFIXMATCH = jcon.string('$=');
    var SUBSTRINGMATCH = jcon.string('*=');
    var IDENT = ident;
    var STRING = string;
    var FUNCTION = ident.seq(jcon.string('('));
    var NUMBER = num;
    var HASH = jcon.string('#').seq(name);
    var PLUS = w.seq(jcon.string('+'));
    var GREATER = w.seq(jcon.string('>'));
    var COMMA = w.seq(jcon.string(','));
    var TILDE = w.seq(jcon.string('~'));
    var NOT = jcon.string(':not(');
    var ATKEYWORD = jcon.string('@').seq(ident);
    var INVALID = invalid;
    var PERCENTAGE = num.seq(jcon.string('%'));
    var DIMENSION = num.seq(ident);
    var CDO = jcon.string('<!--');
    var CDC = jcon.string('-->');

    var IGNORE = jcon.regex(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//);





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
