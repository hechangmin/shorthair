/**
 *
 * shorthair
 *
 * 严格遵循W3C标准的css3-selector的parser的基于jcon的js实现
 *
 * 词法及文法参考：http://www.w3.org/TR/css3-selectors/#w3cselgrammar
 * 解析器组合子：https://github.com/takumi4ichi/jcon
 *
 *  -- (该项目给最爱的动漫NANA，希望矢泽爱大人早日康复!)
 *
 */
var shorthair = (function(){

    var jcon = require('jcon');


    //css3-selector基本正则定义
    var nonascii = jcon.regex(/[^\0-\177]/).type('nonascii');
    var unicode = jcon.regex(/\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?/).type('unicode');
    var nmchar = jcon.regex(/[_a-z0-9-]/).or(nonascii, escape).type('nmchar');
    var nmstart = jcon.regex(/[_a-z]/).or(nonascii, escape).type('nmstart');
    var ident = jcon.regex(/[-]?/).seq(nmstart, nmchar.many()).type('ident');
    var name = nmchar.least(1).type('name');
    var escape = unicode.or(jcon.regex(/\\[^\n\r\f0-9a-f]/)).type('escape');
    var num = jcon.regex(/[0-9]+|[0-9]*\.[0-9]+/).type('num');
    var nl = jcon.regex(/\n|\r\n|\r|\f/).type('nl');
    var string1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many(), jcon.string('"')).type('string1');
    var string2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many(), jcon.string('"')).type('string2');
    var string = string1.or(string2).type('string');
    var invalid1 = jcon.string('"').seq(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).many()).type('invalid1');
    var invalid2 = jcon.string("'").seq(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).many()).type('invalid2');
    var invalid = invalid1.or(invalid2).type('invalid');
    var w = jcon.regex(/[ \t\r\n\f]*/).type('w');

    //var D = d.or(jcon.regex(/\\0{0,4}(44|64)(\r\n|[ \t\r\n\f])?/));
    var O = jcon.string('o').or(jcon.regex(/\\0{0,4}(4f|6f)(\r\n|[ \t\r\n\f])?/)).or(jcon.string('\\o'));
    var T = jcon.string('t').or(jcon.regex(/\\0{0,4}(54|74)(\r\n|[ \t\r\n\f])?/)).or(jcon.string('\\t'));


    //css3-selector词法单元定义
    var S = jcon.regex(/[ \t\r\n\f]+/).type('S');
    var INCLUDES = jcon.string('~=').type('INCLUDES');
    var DASHMATCH = jcon.string('|=').type('DASHMATCH');
    var PREFIXMATCH = jcon.string('^=').type('PREFIXMATCH');
    var SUFFIXMATCH = jcon.string('$=').type('SUFFIXMATCH');
    var SUBSTRINGMATCH = jcon.string('*=').type('SUBSTRINGMATCH');
    var IDENT = ident;
    var STRING = string;
    var FUNCTION = ident.seq(jcon.string('(')).type('FUNCTION');
    var NUMBER = num;
    var HASH = jcon.string('#').seq(name).type('HASH');
    var PLUS = w.seq(jcon.string('+')).type('PLUS');
    var GREATER = w.seq(jcon.string('>')).type('GREATER');
    var COMMA = w.seq(jcon.string(',')).type('COMMA');
    var TILDE = w.seq(jcon.string('~')).type('TILDE');
    var NOT = jcon.string(':not(').type('NOT');
    var ATKEYWORD = jcon.string('@').seq(ident).type('ATKEYWORD');
    var INVALID = invalid;
    var PERCENTAGE = num.seq(jcon.string('%')).type('PERCENTAGE');
    var DIMENSION = num.seq(ident).type('DIMENSION');
    var CDO = jcon.string('<!--').type('CDO');
    var CDC = jcon.string('-->').type('CDC');

    var IGNORE = jcon.regex(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//).type('IGNORE');


    var negation_arg = jcon.lazy(function(){
        return jcon.or(type_selector, universal, HASH, cls, attrib, pseudo);
    }).type('negation_arg');

    var negation = jcon.seq(NOT, S.many().skip(), negation_arg, S.many().skip(), jcon.string(')')).type('negation');


    var namespace_prefix = jcon.seq( jcon.or(IDENT, jcon.string('*')).possible(), jcon.string('|')).lookhead(IDENT).type('namespace_prefix');

    var expression = jcon.seq( 
        jcon.or(PLUS, jcon.string('-'), DIMENSION, NUMBER, STRING, IDENT),
        S.many().skip()
    ).least(1).type('expression');

    var functional_pseudo = jcon.seq(FUNCTION, S.many().skip(), expression, jcon.string(')')).type('functional_pseudo');
    
    var pseudo = jcon.seq(jcon.string(':'), jcon.string(':').possible(), jcon.or(functional_pseudo, IDENT)).type('pseudo');

    var attrib = jcon.seq(jcon.string('['), S.many().skip(), namespace_prefix.possible(), IDENT.setAst('name'), S.many().skip(),
        jcon.seq(
            jcon.or(PREFIXMATCH, SUFFIXMATCH, SUBSTRINGMATCH, jcon.string('='), INCLUDES, DASHMATCH).setAst('operator'),
            S.many().skip(),
            jcon.or(IDENT, STRING).setAst('value'),
            S.many().skip()
        ).possible(), jcon.string(']')).type('attrib').setAst();

    var cls = jcon.seq(jcon.string('.'), IDENT).type('class').setAst();

    var universal = jcon.seq(namespace_prefix.possible(), jcon.string('*')).type('universal').setAst();

    var element_name = IDENT.type('element_name').setAst();


    var type_selector = jcon.seq(namespace_prefix.possible(), element_name).type('type_selector');

    var simple_selector_sequence = jcon.or(
        jcon.seq(
            jcon.or(type_selector, universal),
            jcon.or(HASH, cls, attrib, negation, pseudo).many()
        ).flat(),
        jcon.or(HASH, cls, attrib, negation, pseudo).least(1)
    ).type('simple_selector_sequence');

    var combinator = jcon.or(
        jcon.seq(S.many().skip(), PLUS, S.many().skip()),
        jcon.seq(S.many().skip(), GREATER, S.many().skip()),
        jcon.seq(S.many().skip(), TILDE, S.many().skip()),
        S.least(1)
    ).type('combinator');

    var selector = jcon.seq(
        simple_selector_sequence,
        jcon.seq(combinator, simple_selector_sequence).flat().many().flat()
    ).flat().type('selector');

    var selectors_group = jcon.seq(
        selector,
        jcon.seq(COMMA, S.many().skip(), selector).many()
    ).flat().type('selectors_group');


    return selectors_group;

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
