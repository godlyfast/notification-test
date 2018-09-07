var webSocket = WS.connect("ws://" + window.location.hostname + ":9090");

webSocket.on("socket/connect", function(session) {
  //session is an Autobahn JS WAMP session.
  // session.subscribe("notification/channel", function(uri, payload) {
  // console.log("Received message", payload.msg);
  // });

  console.log("Successfully Connected!");
  // setInterval(() => {
  session.publish("notification/channel", {
    msg: "This is a message!"
  });
  // }, 1000);
});

webSocket.on("socket/disconnect", function(error) {
  console.log(error);
  //error provides us with some insight into the disconnection: error.reason and error.code

  console.log("Disconnected for " + error.reason + " with code " + error.code);
});

define([
  "jquery",
  "underscore",
  "backbone",
  "app/collection/notifications",
  "app/view/notification"
], function($, _, Backbone, App) {
  App.Views.Notifications = Backbone.View.extend({
    initialize: function(options) {
      this.notifications = new App.Collections.Notifications({
        mode: "view"
      });
      this.notifications.bind("change reset add remove", this.render, this);
      this.notifications.fetch();

      // this.render();
    },

    events: {
      change: "render"
    },

    render: function() {
      console.log("RENDER", this.notifications);
      this.$el.html("");
      var component = this;
      this.notifications.each(
        function(notification) {
          var notificationView = new App.Views.Notification({
            model: notification
          });
          this.$el.append(notificationView.$el);
        }.bind(this)
      );
      return this;
    }
  });

  return App;
});
