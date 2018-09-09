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
