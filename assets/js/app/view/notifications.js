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
                setInterval(
                  function() {
                    this.notifications.fetch();
                  }.bind(this),
                  5000
                );
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

    renderAdd: function(model, collection, c, d) {
      console.log("ADD");
      if (!this.filterCheck(model)) return this;
      if (this.views[model.get("id")]) return this;
      var notificationView = new App.Views.Notification({
        model: model
      });
      notificationView.$el
        .find(".notification-container")
        .css({ "max-height": "0px", opacity: 0 });
      this.$el.prepend(notificationView.$el);
      setTimeout(
        function() {
          notificationView.$el
            .find(".notification-container")
            .css({ "max-height": "1000px", opacity: 1 });
          notificationView.$el.addClass("animated fadeIn");
        }.bind(this),
        100
      );

      this.views[model.get("id")] = notificationView;
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

    views: {},

    render: function() {
      console.log("RENDER", this.notifications);
      this.notifications.each(
        function(notification) {
          if (!this.filterCheck(notification)) {
            if (!this.views[notification.get("id")]) return;
            this.views[notification.get("id")].$el.addClass("animated fadeOut");
            this.views[notification.get("id")].$el
              .find(".notification-container")
              .css("max-height", "0px");
            setTimeout(
              function() {
                this.views[notification.get("id")].$el.remove();
              }.bind(this),
              1000
            );
            return;
          }

          if (this.views[notification.get("id")]) return;

          this.renderAdd(notification);
        }.bind(this)
      );
      return this;
    }
  });

  return App;
});
