define(["jquery", "underscore", "backbone"], function($, _, Backbone) {
  "use strict";

  var User, Session;

  var rand = function() {
    return Math.random()
      .toString(36)
      .substr(2); // remove `0.`
  };

  var token = function() {
    return rand() + rand(); // to make it longer
  };

  var getSession = function(cb) {
    if (!window.WS) return cb(new Error("No WS"));
    if (Session) return cb(Session);
    var webSocket = WS.connect("ws://" + window.location.hostname + ":9090");

    webSocket.on("socket/connect", function(session) {
      Session = session;
      cb(null, session);
    });

    webSocket.on("socket/disconnect", function(error) {
      cb(new Error(error.reason));
      console.log(
        "Disconnected for " + error.reason + " with code " + error.code
      );
    });
  };

  var subscribe = function(topic, cb) {
    getSession(function(err, session) {
      if (err) return cb(err);
      session.subscribe(topic, function(url, data) {
        cb(null, url, data);
      });
    });
  };

  var publish = function() {};

  var call = function(url, params, cb) {
    getSession(function(err, session) {
      if (err) return cb(err);
      session.call(url, params).then(
        function(data) {
          cb(null, data);
        },
        function(err) {
          cb(err);
        }
      );
    });
  };

  function getUser(cb) {
    if (User) return cb(null, User);
    $.post("/ping", { token: "foo" }, function(resp) {
      User = resp.user;
      cb(null, User);
    });
  }

  return {
    subscribe: subscribe,
    publish: publish,
    call: call,
    getUser: getUser
  };
});
