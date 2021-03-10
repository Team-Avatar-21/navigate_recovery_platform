// this test file is for app.js

const assert = require('chai').assert;  // bring in assertion library
//const sayHello = require('../app').sayHello;   // choose function you're wanting to test
//const addNumbers = require('../app').addNumbers;

const app = require('../app');          // bring in app.js file 

// Results
sayHelloResult = app.sayHello();
addNumbersResult = app.addNumbers(5,5);

describe('App', function(){         // (file name, function testing)
    describe('sayHello', function() {  // can nest the test groups by nesting with describe
        it('sayHello should return hello', function(){  // (description of what youre wanting to test, function you're testing)
        // let result = app.sayHello();   
        assert.equal(sayHelloResult, 'hello'); 
       
        // assert.equal(app(), 'hello');       // using assert.equal, (value you're eanting to test, 'what it should return' )
        });
    
        it('sayHello should return type string', function(){     // testing return type
        // let result = app.sayHello();
        assert.typeOf(sayHelloResult, 'string');
        });
    });
    
    describe('addNumbers', function(){
        it('addNumbers should be above 5', function(){
            // let result = app.addNumbers(5,5);
            assert.isAbove(addNumbersResult, 5);
       });
    
       it('addNumbers should return type number', function(){
            // let result = app.addNumbers(5,5);
            assert.typeOf(addNumbersResult, 'number');
        });
    });
});