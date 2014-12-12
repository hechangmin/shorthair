shorthair
=========


    娜娜，你知道吗，你就像一直野猫，活的高傲又自由，却背负着无法痊愈的伤口。

    粗线条的我，曾经认为这样很酷，却不知道那有多么的痛。

                                                        for NANA


使用文档
========


##shorthair是什么

shorthair是一个严格遵循w3c关于css3-selector的文法约定([@w3c selector grammar](http://www.w3.org/TR/css3-selectors/#w3cselgrammar))的语法解析器，基于[@jcon](https://github.com/takumi4ichi/jcon)项目实现。


##shorthair的功能列表

```javascript

(function(){
    var shorthair = require('../src/shorthair');

    //解析树
    var selParseTree = shorthair.parse(
        '*.content>div a[link^="http://"]:not([target=_blank]):first-child');

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
    ]) && console.log(JSON.stringify(selAstTree, null, '  '));



}());

```


##捐助开发者

目前作者尚无衣食之虞，该项目仅因个人兴趣所驱策开发。

如有意捐助，所有捐款将通过[@支付宝公益平台](https://love.alipay.com)转捐给NGO组织发起的[@关爱空巢老人行动](https://love.alipay.com/donate/itemDetail.htm?name=2012041015441866702)。



##关于作者

热爱编程，早些年混迹于各种编程论坛及qq群，一般被称呼cc。

热爱动漫，论坛id一般为takumi4ichi。

爱自由，也深知无往不在枷锁之中。

但有王尔德所言：我们都生活在阴沟里，但仍有人仰望星空。


曾就职于百度，奇虎360，目前就职于阿里巴巴集团无线事业部。

weibo: [@takumi4ichi](http://weibo.com/takumi4ichi)

e-mail: <takumi@ymail.com>
