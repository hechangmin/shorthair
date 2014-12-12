/**
 *
 * 针对css3-selector编写测试用例
 *
 */


/**

    参考：http://www.w3.org/TR/css3-selectors/#selectors
 
    Pattern                 Meaning 
    E                       an element of type E    
    E[foo]                  an E element with a "foo" attribute 
    E[foo="bar"]            an E element whose "foo" attribute value is exactly equal to "bar"  
    E[foo~="bar"]           an E element whose "foo" attribute value is a list of whitespace-separated values, one of which is exactly equal to "bar"   
    E[foo^="bar"]           an E element whose "foo" attribute value begins exactly with the string "bar"
    E[foo$="bar"]           an E element whose "foo" attribute value ends exactly with the string "bar" 
    E[foo*="bar"]           an E element whose "foo" attribute value contains the substring "bar"   
    E[foo|="en"]            an E element whose "foo" attribute has a hyphen-separated list of values beginning (from the left) with "en"
    E:root                  an E element, root of the document  
    E:nth-child(n)          an E element, the n-th child of its parent  
    E:nth-last-child(n)     an E element, the n-th child of its parent, counting from the last one  
    E:nth-of-type(n)        an E element, the n-th sibling of its type  
    E:nth-last-of-type(n)   an E element, the n-th sibling of its type, counting from the last one  
    E:first-child           an E element, first child of its parent 
    E:last-child            an E element, last child of its parent  
    E:first-of-type         an E element, first sibling of its type 
    E:last-of-type          an E element, last sibling of its type  
    E:only-child            an E element, only child of its parent  
    E:only-of-type          an E element, only sibling of its type  
    E:empty                 an E element that has no children (including text nodes)    
    E:link
    E:visited               an E element being the source anchor of a hyperlink of which the target is not yet visited (:link) or already visited (:visited)    
    E:active
    E:hover
    E:focus                 an E element during certain user actions    
    E:target                an E element being the target of the referring URI  
    E:lang(fr)              an element of type E in language "fr" (the document language specifies how language is determined)  
    E:enabled
    E:disabled              a user interface element E which is enabled or disabled 
    E:checked               a user interface element E which is checked (for instance a radio-button or checkbox)   
    E::first-line           the first formatted line of an E element    
    E::first-letter         the first formatted letter of an E element  
    E::before               generated content before an E element   
    E::after                generated content after an E element    
    E.warning               an E element whose class is "warning" (the document language specifies how class is determined).    
    E#myid                  an E element with ID equal to "myid".   
    E:not(s)                an E element that does not match simple selector s  
    E F                     an F element descendant of an E element 
    E > F                   an F element child of an E element  
    E + F                   an F element immediately preceded by an E element   
    E ~ F                   an F element preceded by an E element   
**/



module.exports = (function(){

    var shorthair = require('../src/shorthair');

    var selector;

    return {
        basic_universal: function(test){
            selector = '*';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                }
            ], selector + ' PASSED');

            test.done();
        },
        basic_tag: function(test){


            selector = 'body';
            test.deepEqual(shorthair.parse(selector).rhs.map(function(r){return r.value}), ['body'], selector + ' PASSED');


            selector = 'div';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                }
            ], selector + ' PASSED');

            selector = 'p';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'p'
                }
            ], selector + ' PASSED');


            test.done();
        },
        basic_class: function(test){
            selector = '.class';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'class',
                    value: '.class'
                }
            ], selector + ' PASSED');

            selector = '*.class';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'class',
                    value: '.class'
                }
            ], selector + ' PASSED');

            selector = 'div.class';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'class',
                    value: '.class'
                }
            ], selector + ' PASSED');

            test.done();
        },
        basic_attr: function(test){

            selector = '*[test=value]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'attrib',
                    value: '[test=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');

            selector = '.class[test=value]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'class',
                    value: '.class'
                },
                {
                    type: 'attrib',
                    value: '[test=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');


            selector = '*.class[test=value]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'class',
                    value: '.class'
                },
                {
                    type: 'attrib',
                    value: '[test=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');


            selector = '*.class[test~=value]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'class',
                    value: '.class'
                },
                {
                    type: 'attrib',
                    value: '[test~=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '~='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');

            selector = '*.class[test^=value]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'class',
                    value: '.class'
                },
                {
                    type: 'attrib',
                    value: '[test^=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '^='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');

            selector = '*.class[test$=value]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'class',
                    value: '.class'
                },
                {
                    type: 'attrib',
                    value: '[test$=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '$='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');

            selector = '*.class[test*=value]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'class',
                    value: '.class'
                },
                {
                    type: 'attrib',
                    value: '[test*=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '*='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');

            selector = '*.class[test|=value]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'class',
                    value: '.class'
                },
                {
                    type: 'attrib',
                    value: '[test|=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '|='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');

            selector = '*.class[test \r|=value]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'class',
                    value: '.class'
                },
                {
                    type: 'attrib',
                    value: '[test|=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '|='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');


            selector = '*.class[test \r|= \rvalue]';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'class',
                    value: '.class'
                },
                {
                    type: 'attrib',
                    value: '[test|=value]',
                    childs: [
                        {
                            type: 'name',
                            value: 'test'
                        },
                        {
                            type: 'operator',
                            value: '|='
                        },
                        {
                            type: 'value',
                            value: 'value'
                        }
                    ]
                }
            ], selector + ' PASSED');

            test.done();
        },
        basic_pseudo_class: function(test){
            selector = '*:root';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':root'
                },
            ], selector + ' PASSED');

            selector = '*:first-child';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':first-child'
                },
            ], selector + ' PASSED');

            selector = '*:last-child';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':last-child'
                },
            ], selector + ' PASSED');

            selector = '*:only-child';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':only-child'
                },
            ], selector + ' PASSED');

            selector = '*:last-of-type';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':last-of-type'
                },
            ], selector + ' PASSED');

            selector = '*:only-of-type';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':only-of-type'
                },
            ], selector + ' PASSED');

            selector = '*:empty';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':empty'
                },
            ], selector + ' PASSED');

            selector = '*:link';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':link'
                },
            ], selector + ' PASSED');

            selector = '*:visited';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':visited'
                },
            ], selector + ' PASSED');

            selector = '*:actived';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':actived'
                },
            ], selector + ' PASSED');

            selector = '*:hover';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':hover'
                },
            ], selector + ' PASSED');

            selector = '*:focus';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':focus'
                },
            ], selector + ' PASSED');

            selector = '*:target';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':target'
                },
            ], selector + ' PASSED');

            selector = '*:lang(fr)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':lang(fr)',
                    childs: [
                        {
                            type: 'expression',
                            value: 'fr'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = '*:enabled';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':enabled'
                },
            ], selector + ' PASSED');

            selector = '*:disabled';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':disabled'
                },
            ], selector + ' PASSED');

            selector = '*:checked';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':checked'
                },
            ], selector + ' PASSED');

            selector = '*:nth-child(n)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':nth-child(n)',
                    childs: [
                        {
                            type: 'expression',
                            value: 'n'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = '*:nth-child(10)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':nth-child(10)',
                    childs: [
                        {
                            type: 'expression',
                            value: '10'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = '*:nth-child(n+1)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':nth-child(n+1)',
                    childs: [
                        {
                            type: 'expression',
                            value: 'n+1'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = '*:nth-child(2n+1)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':nth-child(2n+1)',
                    childs: [
                        {
                            type: 'expression',
                            value: '2n+1'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = '*:nth-child(even)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':nth-child(even)',
                    childs: [
                        {
                            type: 'expression',
                            value: 'even'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = '*:nth-child(odd)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':nth-child(odd)',
                    childs: [
                        {
                            type: 'expression',
                            value: 'odd'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = '*:nth-child(10n-1)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: ':nth-child(10n-1)',
                    childs: [
                        {
                            type: 'expression',
                            value: '10n-1'
                        }
                    ]
                },
            ], selector + ' PASSED');

            test.done();

        },
        basic_pseudo_element: function(test){

            selector = '*::first-line';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: '::first-line'
                },
            ], selector + ' PASSED');

            selector = '*::first-letter';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: '::first-letter'
                },
            ], selector + ' PASSED');

            selector = '*::before';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: '::before'
                },
            ], selector + ' PASSED');

            selector = '*::after';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'universal',
                    value: '*'
                },
                {
                    type: 'pseudo',
                    value: '::after'
                },
            ], selector + ' PASSED');

            test.done();
        },
        not: function(test){

            selector = 'div:not(a)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'negation',
                    value: ':not(a)',
                    childs: [
                        {
                            type: 'element_name',
                            value: 'a'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = 'div:not(#a)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'negation',
                    value: ':not(#a)',
                    childs: [
                        {
                            type: 'hash',
                            value: '#a'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = 'div:not(.cls)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'negation',
                    value: ':not(.cls)',
                    childs: [
                        {
                            type: 'class',
                            value: '.cls'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = 'div:not([test~=value])';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'negation',
                    value: ':not([test~=value])',
                    childs: [
                        {
                            type: 'attrib',
                            value: '[test~=value]',
                            childs: [
                                {
                                    type: 'name',
                                    value: 'test'
                                },
                                {
                                    type: 'operator',
                                    value: '~='
                                },
                                {
                                    type: 'value',
                                    value: 'value'
                                }
                            ]
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = 'div:not(:focus)';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'negation',
                    value: ':not(:focus)',
                    childs: [
                        {
                            type: 'pseudo',
                            value: ':focus'
                        }
                    ]
                },
            ], selector + ' PASSED');

            selector = 'div:not(:nth-child(2n+1))';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'negation',
                    value: ':not(:nth-child(2n+1))',
                    childs: [
                        {
                            type: 'pseudo',
                            value: ':nth-child(2n+1)',
                            childs: [
                                {
                                    type: 'expression',
                                    value: '2n+1'
                                }
                            ]
                        }
                    ]
                },
            ], selector + ' PASSED');

            test.done();

        },
        combinator: function(test){

            selector = 'div div';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'combinator',
                    value: ' '
                },
                {
                    type: 'element_name',
                    value: 'div'
                },
            ], selector + ' PASSED');


            selector = 'div + div';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'combinator',
                    value: '+'
                },
                {
                    type: 'element_name',
                    value: 'div'
                },
            ], selector + ' PASSED');

            selector = 'div ~ div';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'combinator',
                    value: '~'
                },
                {
                    type: 'element_name',
                    value: 'div'
                },
            ], selector + ' PASSED');

            selector = 'div > div';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'combinator',
                    value: '>'
                },
                {
                    type: 'element_name',
                    value: 'div'
                },
            ], selector + ' PASSED');

            selector = 'div>div';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'combinator',
                    value: '>'
                },
                {
                    type: 'element_name',
                    value: 'div'
                },
            ], selector + ' PASSED');

            selector = 'div > \t\rdiv';
            test.deepEqual(shorthair.parse(selector).ast(), [
                {
                    type: 'element_name',
                    value: 'div'
                },
                {
                    type: 'combinator',
                    value: '>'
                },
                {
                    type: 'element_name',
                    value: 'div'
                },
            ], selector + ' PASSED');

            test.done();
        }
    };

}());
