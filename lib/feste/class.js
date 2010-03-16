"use strict";
/*global TTT*/
(function(){

  var Class = TTT.Class = function(/*varargs*/){
    var constructor;
    if(arguments[0] instanceof Function){
      constructor = Array.shift.apply(arguments);
    }

    var Base;
    if(arguments[0] instanceof Function){
      Base = Array.shift.apply(arguments);
    }

    var mixins;
    if(arguments[0] instanceof Array){
      mixins = Array.shift.apply(arguments);
    }

    var methods = {};
    if(arguments[0] instanceof Object &&
       !(arguments[0] instanceof Function)){
      methods = Array.shift.apply(arguments);
    }

    var options = {};
    if(arguments[0] instanceof Object &&
       !(arguments[0] instanceof Function)){
      options = Array.shift.apply(arguments);
    }

    if(constructor === undefined){
      constructor = function(){};
    }

    var scope = options.scope;
    if(scope === undefined){
      if(this instanceof Function){
        scope = this;
      } else {
        scope = TTT;
      }
    }

    var name = options.name;
    if(name === undefined){
      name = constructor.name;
    }
    if(name === undefined || name.match(/^\s*$/)){
      throw new Error("implement blank name for new Class");
    }

    constructor.toString = (function(){
      var string = scope.toString() + "." + name;
      return function(){return string;};
    }());

    if (Base) {
      constructor.prototype = new Base();
    } else {
      constructor.prototype = {};
    }

    var method;
    if (mixins) {
      for(var i in mixins){
        var mixin = mixins[i].prototype;
        for(method in mixin){
          constructor.prototype[method] = mixin[method];
        }
      }
    }

    for(method in methods){
      constructor.prototype[method] = methods[method];
    }

    return constructor;
  };

  Class.toString = (function(){
    var string = TTT.toString() + ".Class";
    return function(){return string;};
  }());

  Class.Subscope = function Subscope(fn, parent_class){
    parent_class = parent_class || this;
    var root_subscope = Subscope;
    var name = fn.name;
    if (!name) {
      throw new Error("implement");
    }
    var cls = function Class() {
      var v = parent_class.apply(fn,arguments); 
      return v;
    };
    cls.toString = (function(){
      var string = fn.toString() + ".Class";
      return function(){return string;};
    }());
    cls.Subscope = root_subscope;
    cls._Subscope = function Subscope(fn, parent_class) {
      parent_class = parent_class || cls;
      return root_subscope.call(fn, parent_class);
    };
    fn.Class = cls;
  };

}());