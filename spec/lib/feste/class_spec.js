"use strict";
jazrb.include(jazrb.root + "/spec/lib/feste/spec_helper.js");

(function(){

  describe("Feste",function(){
    describe("Class",function(){

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

    });
  });

}());