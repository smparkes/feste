"use strict";
(function(){

  var nil;
  var debug = (function(){return this;}()).debug;

  var Class = Feste.Class = function(/*...*/){
    var constructor;
    if (arguments[0] === nil || arguments[0] instanceof Function) {
      constructor = Array.prototype.shift.apply(arguments);
    }

    var Base;
    var mixins;
    if (arguments[0] === nil || arguments[0] instanceof Array) {
      mixins = Array.prototype.shift.apply(arguments);
      if (mixins && mixins.length > 0) {
        Base = mixins.shift();
      }
    }

    var methods = {};
    if (arguments[0] === nil ||
        ((arguments[0] instanceof Object) &&
         !(arguments[0] instanceof Array))) {
      methods = Array.prototype.shift.apply(arguments);
    }

    var options = {};
    if (arguments[0] instanceof Object &&
       !(arguments[0] instanceof Function)) {
      options = Array.prototype.shift.apply(arguments);
    }

    if (constructor === undefined) {
      if (Base) {
        constructor = function(/*...*/){
          Base.apply(this,arguments);
          for(var mixin_offset in mixins) {
            mixins[mixin_offset].apply(this,arguments);
          }
        };
      } else {
        constructor = function(){};
      }
    }

    var named_scope = true;
    var scope;

    if ("scope" in options) {
      named_scope = true;
      scope = options.scope;
    } else {
      if (this instanceof Function) {
        scope = this;
      } else {
        scope = Feste;
      }
    }

    var name = options.name;

    if (name === undefined) {
      name = constructor.name;
    }

    if (!(name === undefined || name.match(/^\s*$/))) {
      constructor.toString = (function () {
        var string;
        string = ( scope ? (scope + ".") : "" ) + name;
        return function () {
          return string;
        };
      }());
    }

    if (Base) {
      constructor.prototype = new Base();
      constructor.prototype.constructor = constructor;
    }

    var method;
    if (mixins) {
      for (var i in mixins) {
        var mixin = mixins[i].prototype;
        for (method in mixin) {
          if (method === "constructor") {
            continue;
          }
          constructor.prototype[method] = mixin[method];
        }
      }
    }

    for (method in methods) {
      constructor.prototype[method] = methods[method];
    }

    return constructor;
  };

  Class.toString = (function(){
    var string = Feste.toString() + ".Class";
    return function(){return string;};
  }());

  Class.Subscope = function Subscope(fn, parent_class) {
    parent_class = parent_class || Class;
    var root_subscope = Subscope;
    var cls = function Class() {
      return parent_class.apply(fn,arguments);  
    };
    cls.toString = (function(){
      var string = fn.toString() + ".Class";
      return function(){return string;};
    }());
    cls.Subscope = root_subscope;
    cls.Subscope = function Subscope(fn, parent_class) {
      parent_class = parent_class || cls;
      return root_subscope.call(fn, parent_class);
    };
    fn.Class = cls;
  };

  Class.Subclass = function(Parent) {
    var result = new Feste.Class( function Class(/*...*/){
      var replacement = [];
      var i = 0;
      if (arguments[i] === nil || arguments[i] instanceof Function) {
        replacement.push(arguments[i]);
        i++;
      } else {
        replacement.push(nil);
      }
      if (arguments[i] === nil || arguments[i] instanceof Array) {
        replacement.push(arguments[i]);
        i++;
      } else {
        replacement.push(nil);
      }
      if (arguments[i] === nil ||
          ((arguments[i] instanceof Object) &&
           !(arguments[i] instanceof Array))) {
        replacement.push(arguments[i]);
        i++;
      } else {
        replacement.push(nil);
      }
      if (arguments[i] instanceof Object &&
          !(arguments[i] instanceof Function)) {
        if (!("scope" in arguments[i])) {
          arguments[i].scope = Parent;
        }
        replacement.push(arguments[i]);
        i++;
      } else {
        replacement.push({scope:Parent});
        replacement.concat(Array.prototype.slice.call(arguments,i));
      }
      var result = Feste.Class.apply(this,replacement);
      return result;
    }, [Feste.Class], ({}), {
      scope: Parent
    });
    // Class.Subscope(result);
    result.Subscope = Class.Subscope;
    result._Subscope = function(fn, parent_class) {
      Class.Subscope(fn);
      // return Class.Subscope(fn, parent_class || result);
    };
    return result;
  };

}());