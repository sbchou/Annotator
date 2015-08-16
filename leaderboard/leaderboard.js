// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

if (Meteor.isClient) { 
  Template.leaderboard.helpers({
    players: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks 
        return Players.find({ type: { $exists: false }});
        } 
      else {
        // Otherwise, return all of the tasks
        return Players.find({});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
        return Players.find({ type: { $exists: false }}).count();
    },
    completeCount: function (){
        return Players.find({type: {$exists: true}}).count();
    },
    selectedName: function () {
      var player = Players.findOne(Session.get("selectedPlayer"));
      return player && player.name;
    }

  });


  Template.leaderboard.events({

    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    },

    'click .person': function () {
      Players.update(Session.get("selectedPlayer"), {$set: {type: "person"}});
      location.reload();
    },

    'click .org': function () {
      Players.update(Session.get("selectedPlayer"), {$set: {type: "org"}});
      location.reload();
    },

    'click .unsure': function () {
      Players.update(Session.get("selectedPlayer"), {$set: {type: "unsure"}});
      location.reload();
    }
  });

  Template.player.helpers({
    selected: function () {
      return Session.equals("selectedPlayer", this._id) ? "selected" : '';
      location.reload();
    }
  });

  Template.player.events({
    'click': function () { 
      Session.set("selectedPlayer", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["mpetitchou", "socialmachines", "MIT",
                   "nytimes", "TheAtlantic", "TheOnion"];
      _.each(names, function (name) {
        Players.insert({
          name: name
        });
      });
    }
  });
}
