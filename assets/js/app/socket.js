define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
  "use strict";

  var getSession = function(cb) {
    var webSocket = WS.connect("ws://" + window.location.hostname + ":9090");

    webSocket.on("socket/connect", function(session) {
      cb(null, session);
    });

    webSocket.on("socket/disconnect", function(error) {
      console.log(
        "Disconnected for " + error.reason + " with code " + error.code
      );
    });
  };

  return {
    getSession: getSession
  };
});
