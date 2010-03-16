"use strict";
jazrb.include(jazrb.root + "/spec/lib/feste/spec_helper.js");
(function(){
  describe("Fest",function(){
    it("should exit",function(){
      expect(Feste).toBeDefined();
    });
  });
}());