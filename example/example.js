(function(){
    var shorthair = require('../src/shorthair');

    //解析树
    var selParseTree = shorthair.parse('*.content>div a[link^="http://www.taobao.com"]:not([target=_blank]):first-child');

    //转换为语法树
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
            value: '[link^="http://www.taobao.com"]',
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
                    value: '"http://www.taobao.com"'
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
    ]) && console.log(JSON.stringify(selAstTree, null, '  '));



}());
