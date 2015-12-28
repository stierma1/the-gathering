
var nools = require("nools");
var fs = require("fs");
var path = require("path");
var flow = nools.compile(path.join(__dirname, "gathering.nools"));
var InputParameters = flow.getDefined("InputParameters");
var Success = flow.getDefined("Success");

module.exports = function(defaultData, config){
  config = config || {};
  if(defaultData){
    config.data = defaultData;
  }

  var session = flow.getSession();
  session.assert(new InputParameters(config));
  return new Promise(function(res, rej){
    session.match().then(function(){
      var suc = session.getFacts(Success);
      if(suc.length === 0){
        session.dispose();
        rej(new Error("Rule Engine Failed"));
        return;
      }
      session.dispose();
      res(suc[0].data);
    }, function(err){
      session.dispose();
      rej(err);
    });
  });

}
