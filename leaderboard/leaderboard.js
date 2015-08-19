// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

if (Meteor.isClient) { 
  Template.leaderboard.helpers({
    players: function () {
       if (Session.get("showCompleted")) {
        // If hide completed is checked, filter tasks 
        return Players.find({type: { $exists: true }});
        } 
       else {
        p = Players.findOne({type: {$exists:false}});
        Session.set("selectedPlayer", p._id);
        return [ p ];
        // Otherwise, return all of the tasks
        //return Players.find({});
      }
    },
    showCompleted: function () {
      return Session.get("showCompleted");
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

    "change .show-completed input": function (event) {
      Session.set("showCompleted", event.target.checked);
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
      l 
    }
  });

  /*
  Template.player.events({
    'click': function () { 
      Session.set("selectedPlayer", this._id);
    }
  });
*/
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
