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
        Other.Class = new Feste.Class({},{scope:Other,name:"Class"});
        expect(Other.Class+"").toBe("Other.Class");
      });

      it("should obey a new top level name w/o scope",function(){
        var Other = function Other(){};
        Other.toString = function() {return "Other";};
        Other.Class = new Feste.Class({},{name:"Class"});
        expect(Other.Class+"").toBe("Feste.Class");
      });

      it("should obey a new top level name w/nil scope",function(){
        var Other = function Other(){};
        var nil;
        Other.toString = function() {return "Other";};
        Other.Class = new Feste.Class({},{scope:nil, name:"Class"});
        expect(Other.Class+"").toBe("Class");
      });

      it("should obey a new top level name w/a named fn",function(){
        var Other = function Other(){};
        Other.toString = function() {return "Other";};
        Other.Class = new Feste.Class(function Class(){},{},{scope:Other});
        expect(Other.Class+"").toBe("Other.Class");
      });

      it("should add a toString if given a fn name", function() {
        var Cls = new Feste.Class( function TestName() {} );
        expect(Cls+"").toBe("Feste.TestName");
      });

      it("should add a toString if given a name w/o scope",function() {
        var Cls = new Feste.Class( {}, {name: "TestName"} );
        expect(Cls+"").toBe("Feste.TestName");
      });
      
      it("should add a toString if given a name w/nil scope",function() {
        var Cls = new Feste.Class( {}, {scope: nil, name: "TestName"} );
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

      it("should generate a ctor that calls base calls base class ctor");

      it("should be usable as a base class",function(){
        var Other = {};
        Other.toString = function(){return "Other";};
        var Cls =
          new Feste.Class( [ Feste.Class ], {
            scope: Other,
            name: "Class"
          });
        expect(Cls+"").toBe("Other.Class");
      });

      it("derived classes should be usable",function(){
        var Other = {};
        Other.toString = function(){return "Other";};
        Other.Class = new Feste.Class.Subclass(Other);
        Other.Scoped = new Other.Class(function Scoped(){});
        expect(Other.Scoped+"").toBe("Other.Scoped");
        Other.Scoped = new Other.Class({}, {name: "Scoped"});
        expect(Other.Scoped+"").toBe("Other.Scoped");
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

    });
  });
}());