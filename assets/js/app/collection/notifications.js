define(["jquery", "underscore", "backbone", "app/model/notification"], function(
  $,
  _,
  Backbone,
  App
) {
  App.Collections.Notifications = Backbone.Collection.extend({
    model: App.Models.Notification,

    url: function() {
      if (this.mode == "admin") {
        return "/notification/all";
      } else {
        return "/notification";
      }
    },

    comparator: function(a, b) {
      return +a.get("id") > +b.get("id") ? 1 : -1;
    },

    initialize: function(options) {
      this.mode = options.mode;
    }
  });

  return App;
});
