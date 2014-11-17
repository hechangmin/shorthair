/**
 *
 * 针对css3-selector编写测试用例
 *
 */
module.exports = (function(){

    var shorthair = require('../src/shorthair');


    return {
        tag: function(test){
            console.log(JSON.stringify(shorthair.parse('hello.a.b>a.b b').value));
            //test.equal(shorthair.parse('hello').value, 'hello', 'tag ok!');
            test.done();
        }
    };

}());
