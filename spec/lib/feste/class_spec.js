"use strict";
(function(){
  describe("Feste",function(){
    describe("Class",function(){

      var nil;

      it("should be default creatable",function(){
        expect(Feste.Class(function T(){})).toBeDefined();
      });

      it("should default to the name of the constructor",function(){
        var cls = new Feste.Class(function Player(){});
        expect(cls+"").toBe("Feste.Player");
      });

      it("should copy methods",function(){
        var methods = { a: function(){}, b: function(){} };
        var cls = new Feste.Class(function Player(){},methods);
        expect(cls.prototype.a).toBe(methods.a);
        expect(cls.prototype.b).toBe(methods.b);
      });

      it("should provide a Subscope method",function(){
        var Player = new Feste.Class(function Player(){});
        Feste.Class.Subscope(Player);
        var View = new Player.Class(function View(){});
        expect(View+"").toBe("Feste.Player.View");
      });

      it("should obey a new top level name w/scope",function(){
        var Other = function Other(){};
        Other.toString = function() {return "Other";};
        Other.Class = new Feste.Class(({}),{scope:Other,name:"Class"});
        expect(Other.Class+"").toBe("Other.Class");
      });

      it("should obey a new top level name w/o scope",function(){
        var Other = function Other(){};
        Other.toString = function() {return "Other";};
        Other.Class = new Feste.Class(({}),{name:"Class"});
        expect(Other.Class+"").toBe("Feste.Class");
      });

      it("should obey a new top level name w/nil scope",function(){
        var Other = function Other(){};
        var nil;
        Other.toString = function() {return "Other";};
        Other.Class = new Feste.Class(({}),{scope:nil, name:"Class"});
        expect(Other.Class+"").toBe("Class");
      });

      it("should obey a new top level name w/a named fn",function(){
        var Other = function Other(){};
        Other.toString = function() {return "Other";};
        Other.Class = new Feste.Class(function Class(){},({}),{scope:Other});
        expect(Other.Class+"").toBe("Other.Class");
      });

      it("should add a toString if given a fn name", function() {
        var Cls = new Feste.Class( function TestName() {} );
        expect(Cls+"").toBe("Feste.TestName");
      });

      it("should add a toString if given a name w/o scope",function() {
        var Cls = new Feste.Class(({}), {name: "TestName"});
        expect(Cls+"").toBe("Feste.TestName");
      });
      
      it("should add a toString if given a name w/nil scope",function() {
        var Cls = new Feste.Class(({}), {scope: nil, name: "TestName"});
        expect(Cls+"").toBe("TestName");
      });
      
      it("should not add a toString if not given a name",function() {
        var fn = function(){};
        var Cls = new Feste.Class( fn );
        expect(Cls+"").toBe(fn+"");
      });

      it("should handle a mixin-only arg list",function(){
        var Mixin = new Feste.Class( { mixin: function(){} } );
        var Cls = new Feste.Class( [ Mixin ] );
        expect(Cls.prototype instanceof Mixin).toBe(true);
      });

      it("should handle a mixin-only arg list",function(){
        var Mixin = new Feste.Class( { mixin: function(){} } );
        var Cls = new Feste.Class( [ nil, Mixin ] );
        expect(Cls.prototype.mixin).toBeDefined();
      });

      it("should set the constructor property of the prototype",function(){
        var Cls = new Feste.Class(function Cls() {
        });
        expect(Cls.prototype.constructor).toBe(Cls);
      });

      it("should set the constructor property of the prototype on classes with bases",function(){
        var Base = new Feste.Class(function Base() {});
        var Derived = new Feste.Class(function Dervied() {}, [ Base ]);
        expect(Derived.prototype.constructor).toBe(Derived);
      });

      it("should generate a ctor that calls base class ctor", function() {
        var called = false;
        var Base = new Feste.Class(function Base() { called = true;});
        var Derived = new Feste.Class([ Base ]);
        var derived = new Derived();
        expect(called).toBe(true);
      });

      it("should generate a ctor that calls mixin ctors", function() {
        var called = false;
        var Base = new Feste.Class();
        var Mixin = new Feste.Class(function(){ called = true;});
        var Derived = new Feste.Class([ Base, Mixin ]);
        var derived = new Derived();
        expect(called).toBe(true);
      });

      it("should be usable as a base class",function(){
        var Other = {};
        Other.toString = function(){return "Other";};
        var Cls =
          new Feste.Class( [ Feste.Class ], ({}), {
            scope: Other,
            name: "Class"
          });
        expect(Cls+"").toBe("Other.Class");
      });

      it("derived classes should be usable",function(){
        var Other = {};
        Other.toString = function(){return "Other";};
        Other.Class = new Feste.Class.Subclass(Other);
        expect(Other.Class+"").toBe("Other.Class");
        Other.Scoped = new Other.Class(function Scoped(){});
        expect(Other.Scoped+"").toBe("Other.Scoped");
        Other.Scoped = new Other.Class(({a:"b"}), {name: "XScoped"});
        expect(Other.Scoped+"").toBe("Other.XScoped");
      });

      it("derived classes should be subscopeable",function(){
        var Other = {};
        Other.toString = function(){return "Other";};
        Other.Class = new Feste.Class.Subclass(Other);
        Other.Scoped = new Other.Class(function Scoped(){});
        expect(Other.Scoped+"").toBe("Other.Scoped");
        new Other.Class.Subscope(Other.Scoped);
        expect(Other.Scoped.Class+"").toBe("Other.Scoped.Class");
        Other.Scoped.Nested = new Other.Scoped.Class(function Nested(){});
        expect(Other.Scoped.Nested+"").toBe("Other.Scoped.Nested");
        new Other.Class.Subscope(Other.Scoped.Nested);
        Other.Scoped.Nested.More = new Other.Scoped.Nested.Class(function More(){});
        expect(Other.Scoped.Nested.More+"").toBe("Other.Scoped.Nested.More");
      });

      it("should not set constructor/tostring from base or mixins", function(){
        var Base = new Feste.Class(function Base(){});
        var Mixin = new Feste.Class(function Mixin(){});
        var Cls = new Feste.Class(function Cls(){}, [ Base, Mixin ]);
        expect(Cls+"").toBe("Feste.Cls");
        expect((new Cls()).constructor+"").toBe("Feste.Cls");
      });

      it("should not set constructor/tostring from base or mixins with multiple levels", function(){
        var Mixin1 = new Feste.Class(function Mixin1(){});
        expect(Mixin1+"").toBe("Feste.Mixin1");
        var Base = new Feste.Class(function Base(){}, [ Mixin1 ]);
        var Mixin2 = new Feste.Class(function Mixin2(){});
        var Cls = new Feste.Class(function Cls(){}, [ Base, Mixin2 ]);
        expect(Cls+"").toBe("Feste.Cls");
        expect((new Cls()).constructor+"").toBe("Feste.Cls");
      });

      it("should not set constructor/tostring from mixins w/bases", function(){
        var Base = new Feste.Class(function Base(){});
        var MixBase = new Feste.Class(function MixBase(){});
        var Mixin = new Feste.Class(function Mixin(){}, [ MixBase ]);
        var Cls = new Feste.Class(function Cls(){}, [ Base, Mixin ]);
        expect(Cls+"").toBe("Feste.Cls");
        expect((new Cls()).constructor+"").toBe("Feste.Cls");
      });

    });
  });
}());