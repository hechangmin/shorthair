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
    var nonascii = jcon.regex(/[^\0-\177]/);
    var unicode = jcon.regex(/\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?/);
    var nmchar = jcon.regex(/[_a-z0-9-]/).or(nonascii, escape);
    var nmstart = jcon.regex(/[_a-z]/).or(nonascii, escape);
    var ident = jcon.regex(/[-]?/).seqJoin(nmstart, nmchar.manyJoin());
    var name = nmchar.least(1);
    var escape = unicode.or(jcon.regex(/\\[^\n\r\f0-9a-f]/));
    var num = jcon.regex(/[0-9]+|[0-9]*\.[0-9]+/);
    var nl = jcon.regex(/\n|\r\n|\r|\f/);
    var string1 = jcon.string('"').seqJoin(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).manyJoin(), jcon.string('"'));
    var string2 = jcon.string("'").seqJoin(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).manyJoin(), jcon.string('"'));
    var string = string1.or(string2);
    var invalid1 = jcon.string('"').seqJoin(jcon.regex(/[^\n\r\f\\"]/).or(nl, nonascii, escape).manyJoin());
    var invalid2 = jcon.string("'").seqJoin(jcon.regex(/[^\n\r\f\\']/).or(nl, nonascii, escape).manyJoin());
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
    var FUNCTION = ident.seqJoin(jcon.string('('));
    var NUMBER = num;
    var HASH = jcon.string('#').seqJoin(name);
    var PLUS = w.seqJoin(jcon.string('+'));
    var GREATER = w.seqJoin(jcon.string('>'));
    var COMMA = w.seqJoin(jcon.string(','));
    var TILDE = w.seqJoin(jcon.string('~'));
    var NOT = jcon.string(':not(');
    var ATKEYWORD = jcon.string('@').seqJoin(ident);
    var INVALID = invalid;
    var PERCENTAGE = num.seqJoin(jcon.string('%'));
    var DIMENSION = num.seqJoin(ident);
    var CDO = jcon.string('<!--');
    var CDC = jcon.string('-->');

    var IGNORE = jcon.regex(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//);


    var negation_arg = jcon.or(type_selector, universal, HASH, cls, attrib, pseudo);

    var negation = jcon.seqJoin(NOT, S.manyJoin(), negation_arg, S.manyJoin(), jcon.string(')'));


    var namespace_prefix = jcon.seqJoin( jcon.or(IDENT, jcon.string('*')).possible(), jcon.string('|'));

    var expression = jcon.seqJoin( 
        jcon.or(PLUS, jcon.string('-'), DIMENSION, NUMBER, STRING, IDENT),
        S.manyJoin()
    ).least(1);

    var functional_pseudo = jcon.seqJoin(FUNCTION, S.manyJoin(), expression, jcon.string(')'));
    
    var pseudo = jcon.seqJoin(jcon.string(':'), jcon.string(':').possible(), jcon.or(IDENT, functional_pseudo));

    var attrib = jcon.seqJoin(jcon.string('['), S.manyJoin(), namespace_prefix.possible(), IDENT, S.manyJoin(),
        jcon.seqJoin(
            jcon.or(PREFIXMATCH, SUFFIXMATCH, SUBSTRINGMATCH, jcon.string('='), INCLUDES, DASHMATCH),
            S.manyJoin(),
            jcon.or(IDENT, STRING),
            S.manyJoin()
        ).possible(), jcon.string(']'));

    var cls = jcon.seqJoin(jcon.string('.'), IDENT);

    var universal = jcon.seqJoin(namespace_prefix.possible(), jcon.string('*'));

    var element_name = IDENT;


    var type_selector = jcon.seqJoin(namespace_prefix.possible(), element_name);

    var simple_selector_sequence = jcon.or(
        jcon.seq(
            jcon.or(type_selector, universal),
            jcon.or(HASH, cls, attrib, pseudo, negation).many()
        ).process(flat),
        jcon.or(HASH, cls, attrib, pseudo, negation).least(1)
    );

    var combinator = jcon.or(
        jcon.seqJoin(PLUS, S.manyJoin()),
        jcon.seqJoin(GREATER, S.manyJoin()),
        jcon.seqJoin(TILDE, S.manyJoin()),
        S.least(1)
    );

    var selector = jcon.seq(
        simple_selector_sequence,
        jcon.seq(combinator, simple_selector_sequence).process(flat).many().process(flat)
    ).process(flat);

    var selectors_group = jcon.seq(
        selector,
        jcon.seq(COMMA, S.manyJoin(), selector).many()
    ).process(flat);

    function flat(result){
        if(!!result.success && result.value instanceof Array){
            var values = [];
            for(var i=0,len=result.value.length; i<len; i++){
                if(result.value[i] instanceof Array){
                    values = values.concat(result.value[i]);
                }else{
                    values.push(result.value[i]);
                }
            }
            result.value = values;
        }
    }


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
