var chai = require("chai");
var expect = chai.expect;
var getAvailable = require("../backend-methods").getAvailable;
var getTaken = require("../backend-methods").getTaken;
var makeAvailableList = require("../backend-methods").makeAvailableList;
var ids = require("../backend-methods").ids;

describe("Token locator", function () {
  describe("Available tokens", function () {
    it("should not return taken", function () {
      expect(getAvailable()).to.be.an("array").that.does.not.include(300);
    });
    it("ids", function () {
      expect(ids()).to.be.an("array").of.length(7787);
    });
    it("should not return taken", function () {
      expect(getTaken()).to.be.an("array").that.include(300);
    });
    it("should create loop list", function () {
      expect(makeAvailableList()).to.be.an("array").that.include(530);
    });
  });
});
