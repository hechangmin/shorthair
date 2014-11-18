/**
 *
 * 针对css3-selector编写测试用例
 *
 */
module.exports = (function(){

    var shorthair = require('../src/shorthair');


    return {
        tag: function(test){
            test.deepEqual(shorthair.parse('div').value, ['div'], 'tag ok!');
            test.done();
        },
        pseudo: function(test){
            test.deepEqual(shorthair.parse('div:first-child').value, ['div',':first-child'], 'tag ok!');
            test.done();
        },
        cls: function(test){
            test.deepEqual(shorthair.parse('div.title:first-child').value, ['div','.title',':first-child'], 'tag ok!');
            test.done()
        }
    };

}());
