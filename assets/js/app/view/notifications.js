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
        mode: "view"
      });
      this.notifications.bind("change reset", this.render, this);
      this.notifications.bind("add", this.renderAdd, this);

      Socket.getUser(
        function(err, User) {
          this.User = User;
          this.notifications.fetch({ reset: true });

          Socket.subscribe(
            "notification/channel",
            function(err, uri, payload) {
              console.log(err, uri, payload);
              if (err) {
                console.log("NO WS, Falling back to requests");
                setInterval(this.notifications.fetch({ reset: true }), 60000);
                return;
              }
              switch (payload.msg) {
                case "notification_created":
                  this.notifications.add(payload.notification);
                  break;
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
      if (!this.filterCheck(model)) return this;
      var notificationView = new App.Views.Notification({
        model: model
      });
      this.$el.prepend(notificationView.$el);
      return this;
    },

    filterCheck: function(notification) {
      if (
        notification.get("users").find(
          function(user) {
            return user.id === this.User.id;
          }.bind(this)
        )
      ) {
        return;
      }

      var validFrom = new Date(notification.get("validFrom")).getTime();
      var validTo = new Date(notification.get("validTo")).getTime();
      var now = new Date().getTime();

      if (now > validTo || now < validFrom) {
        return;
      }
      return true;
    },

    render: function() {
      console.log("RENDER", this.notifications);
      this.$el.html("");
      this.notifications.each(
        function(notification) {
          if (!this.filterCheck(notification)) return;

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
