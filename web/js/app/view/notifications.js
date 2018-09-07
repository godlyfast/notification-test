define([
  "jquery",
  "underscore",
  "backbone",
  "app/collection/notifications",
  "app/view/notification",
  "app/socket"
], function($, _, Backbone, App, Notification, Socket) {
  App.Views.Notifications = Backbone.View.extend({
    initialize: function(options) {
      this.notifications = new App.Collections.Notifications({
        mode: "view",
        sortBy: function(a, b) {
          debugger;
        }
      });
      this.notifications.bind("change reset", this.render, this);
      this.notifications.bind("add", this.renderAdd, this);
      this.notifications.fetch({ reset: true });

      Socket.getSession(
        function(err, session) {
          session.subscribe(
            "notification/channel",
            function(uri, payload) {
              console.log(uri, payload);
              switch (payload.msg) {
                case "notification_created":
                  this.notifications.add(payload.notification);
                  break;
                default:
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },

    events: {
      // change: "render"
    },

    renderAdd: function(model, collection, c, d) {
      var notificationView = new App.Views.Notification({
        model: model
      });
      this.$el.prepend(notificationView.$el);
      return this;
    },

    render: function() {
      console.log("RENDER", this.notifications);
      this.$el.html("");
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
