/**
 * example
 *
 * selector 1: div.class#id
 *
 * selector 2: a[link^="http://"]
 *
 * selector 3: ul.news>li:nth-child(2n-1)
 *
 * selector 4: *.content>div a[link^="http://"]:not([target=_blank]):first-child
 *
 *
 */
(function(){

    var shorthair = require('../src/shorthair');


    var selector = 'div.class#id';
    var selParseTree = shorthair.parse(selector);
    var selAstTree = selParseTree.ast();
    JSON.stringify(selAstTree) === JSON.stringify([
        {
            type: 'element_name',
            value: 'div'
        },
        {
            type: 'class',
            value: '.class'
        },
        {
            type: 'hash',
            value: '#id'
        },
    ]) ? console.log(selector + ' PASSED!') : console.log(JSON.stringify(selAstTree, null, '  '));


    var selector = 'a[link^="http://"]';
    var selParseTree = shorthair.parse(selector);
    var selAstTree = selParseTree.ast();
    JSON.stringify(selAstTree) === JSON.stringify([
        {
            type: 'element_name',
            value: 'a'
        },
        {
            type: 'attrib',
            value: '[link^="http://"]',
            childs: [
                {
                    type: 'name',
                    value: 'link'
                },
                {
                    type: 'operator',
                    value: '^='
                },
                {
                    type: 'value',
                    value: '"http://"'
                },
            ]
        }
    ]) ? console.log(selector + ' PASSED!') : console.log(JSON.stringify(selAstTree, null, '  '));


    var selector = 'ul.news>li:nth-child(2n-1)';
    var selParseTree = shorthair.parse(selector);
    var selAstTree = selParseTree.ast();
    JSON.stringify(selAstTree) === JSON.stringify([
        {
            type: 'element_name',
            value: 'ul'
        },
        {
            type: 'class',
            value: '.news'
        },
        {
            type: 'combinator',
            value: '>'
        },
        {
            type: 'element_name',
            value: 'li'
        },
        {
            type: 'pseudo',
            value: ':nth-child(2n-1)',
            childs: [
                {
                    type: 'expression',
                    value: '2n-1'
                },
            ]
        }
    ]) ? console.log(selector + ' PASSED!') : console.log(JSON.stringify(selAstTree, null, '  '));



    var selector = '*.content>div a[link^="http://"]:not([target=_blank]):first-child';
    var selParseTree = shorthair.parse(selector);
    var selAstTree = selParseTree.ast();
    JSON.stringify(selAstTree) === JSON.stringify([
        {
            type: 'universal',
            value: '*'
        },
        {
            type: 'class',
            value: '.content'
        },
        {
            type: 'combinator',
            value: '>'
        },
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
            value: 'a'
        },
        {
            type: 'attrib',
            value: '[link^="http://"]',
            childs: [
                {
                    type: 'name',
                    value: 'link'
                },
                {
                    type: 'operator',
                    value: '^='
                },
                {
                    type: 'value',
                    value: '"http://"'
                },
            ]
        },
        {
            type: 'negation',
            value: ':not([target=_blank])',
            childs: [
                {
                    type: 'attrib',
                    value: '[target=_blank]',
                    childs: [
                        {
                            type: 'name',
                            value: 'target'
                        },
                        {
                            type: 'operator',
                            value: '='
                        },
                        {
                            type: 'value',
                            value: '_blank'
                        }
                    ]
                }
            ]
        },
        {
            type: 'pseudo',
            value: ':first-child'
        }
    ]) ? console.log(selector + ' PASSED!') : console.log(JSON.stringify(selAstTree, null, '  '));



}());
