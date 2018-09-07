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
      Socket.getSession((err, session) => {
        this.session = session;
      });
      this.render();
    },

    events: {
      click: "onClick"
    },

    onClick: function(a, b, c) {
      //using "then" promises.
      this.session.call("notification/add_func", { term1: 2, term2: 5 }).then(
        function(result) {
          console.log("RPC Valid!", result);
        },
        function(error, desc) {
          console.log("RPC Error", error, desc);
        }
      );
      debugger;
    },

    render: function() {
      var data = this.model.toJSON();
      this.$el.html($.trim(this.template.render(data)));
      return this;
    }
  });

  return App;
});
