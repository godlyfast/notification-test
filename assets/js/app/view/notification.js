define([
  "jquery",
  "underscore",
  "backbone",
  "twig",
  "text!templates/app/notification/notification.html.twig",
  "app/base",
  "app/socket"
], function($, _, Backbone, Twig, template, App, Socket) {
  App.Views.Notification = Backbone.View.extend({
    template: Twig.twig({ data: template }),

    initialize: function() {
      Socket.subscribe(
        "notification/channel",
        function(err, url, payload) {
          if (err) {
            console.log("NO WS, Falling back to no requests");
            return;
          }
          switch (payload.msg) {
            case "notification_edited":
              if (payload.notification.id === this.model.get("id")) {
                this.model.set(payload.notification);
              }
            default:
          }
        }.bind(this)
      );
      this.render();
    },

    events: {
      click: "onClick"
    },

    onClick: function(event) {
      this.model.set("seen", true);
      this.model.save();
    },

    render: function() {
      var data = this.model.toJSON();
      this.$el.html($.trim(this.template.render(data)));
      return this;
    }
  });

  return App;
});
