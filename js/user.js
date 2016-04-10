"use strict";

var utils = require('./utils.js');
var Global = require('./global.js');

function User(socket) {
  // User class. Constructor sets all variables and associates the object with the socket.
  this.socket = socket;
  this.uuid = utils.uuid();

  Global.users[this.uuid] = this;

  this.health = 3;
  this.score = 0;
  this.sprite = 0;
  this.direction = "down";
}

User.prototype.set_sprite = function (num) {
  this.sprite = num;
};

User.prototype.set_name = function (name) {
  this.name = name;
  console.log(("[NAME] " + this.uuid + " is " + name).cyan);

  this.set_location();
};

User.prototype.set_job = function (job) {
  this.job = job;
};

User.prototype.set_location = function () {
  var try_location = [utils.randint(0, 20), utils.randint(0, 20)];
  while (Global.arena[try_location[0]][try_location[1]]) {
    try_location = [utils.randint(0, 20), utils.randint(0, 20)];
  }

  this.location = try_location;

  utils.sendConsole(JSON.stringify({"type": "new",
                                    "user": {"name": this.name,
                                             "uuid": this.uuid,
                                             "sprite": this.sprite,
                                             "top": this.location[1],
                                             "left": this.location[0]}}));

  Global.arena[this.location[0]][this.location[1]] = this.uuid;
};

User.prototype.powerup = function (type) {
  if (type === "heart" && this.health < 3) {
    this.health += 1;
    this.socket.sendUTF(JSON.stringify({"health": this.health}));
  } else if (type === "coin") {
    this.score += 50;
    this.socket.sendUTF(JSON.stringify({"score": this.score}));
  }
};

User.prototype.move = function (direction) {
  this.direction = direction;
  var i, didMove = false;
  switch (direction) {
  case "up":
    if (this.location[1] > 0) {
      if (!(Global.arena[this.location[0]][this.location[1] - 1])) {
        Global.arena[this.location[0]][this.location[1]] = false;
        this.location[1] -= 1;
        Global.arena[this.location[0]][this.location[1]] = this.uuid;
        for (i = 0; i < Global.powerup.length; i++) {
          if (utils.arraysEqual(Global.powerup[i], this.location)) {
            this.powerup(Global.poweruptype[i]);
            console.log(('[PWUP] ' + this.name + 'got a ' + Global.poweruptype[i]).magenta);
            Global.powerup.splice(i, 1);
            Global.poweruptype.splice(i, 1);
            Global.console.sendUTF(JSON.stringify({"type": "deletePowerup",
                                                   "location": this.location}));
          }
        }
        //console.log("[MOVE] " + this.name + " UP");
        utils.sendConsole(JSON.stringify({"uuid": this.uuid,
                                          "move": direction,
                                          "top": this.location[1],
                                          "left": this.location[0]}));
        didMove = true;
      }
    }
    break;
  case "down":
    if (this.location[1] < 19) {
      if (!(Global.arena[this.location[0]][this.location[1] + 1])) {
        Global.arena[this.location[0]][this.location[1]] = false;
        this.location[1] += 1;
        Global.arena[this.location[0]][this.location[1]] = this.uuid;
        for (i = 0; i < Global.powerup.length; i++) {
          if (utils.arraysEqual(Global.powerup[i], this.location)) {
            this.powerup(Global.poweruptype[i]);
            console.log(('[PWUP] ' + this.name + 'got a ' + Global.poweruptype[i]).magenta);
            Global.powerup.splice(i, 1);
            Global.poweruptype.splice(i, 1);
            Global.console.sendUTF(JSON.stringify({"type": "deletePowerup",
                                                   "location": this.location}));
          }
        }
        //console.log("[MOVE] " + this.name + " DOWN");
        utils.sendConsole(JSON.stringify({"uuid": this.uuid,
                                          "move": direction,
                                          "top": this.location[1],
                                          "left": this.location[0]}));
        didMove = true;
      }
    }
    break;
  case "left":
    if (this.location[0] > 0) {
      if (!(Global.arena[this.location[0] - 1][this.location[1]])) {
        Global.arena[this.location[0]][this.location[1]] = false;
        this.location[0] -= 1;
        Global.arena[this.location[0]][this.location[1]] = this.uuid;
        for (i = 0; i < Global.powerup.length; i++) {
          if (utils.arraysEqual(Global.powerup[i], this.location)) {
            this.powerup(Global.poweruptype[i]);
            console.log(('[PWUP] ' + this.name + 'got a ' + Global.poweruptype[i]).magenta);
            Global.powerup.splice(i, 1);
            Global.poweruptype.splice(i, 1);
            Global.console.sendUTF(JSON.stringify({"type": "deletePowerup",
                                                   "location": this.location}));
          }
        }
        //console.log("[MOVE] " + this.name + " LEFT");
        utils.sendConsole(JSON.stringify({"uuid": this.uuid,
                                          "move": direction,
                                          "top": this.location[1],
                                          "left": this.location[0]}));
        didMove = true;
      }
    }
    break;
  case "right":
    if (this.location[0] < 19) {
      if (!(Global.arena[this.location[0] + 1][this.location[1]])) {
        Global.arena[this.location[0]][this.location[1]] = false;
        this.location[0] += 1;
        Global.arena[this.location[0]][this.location[1]] = this.uuid;
        for (i = 0; i < Global.powerup.length; i++) {
          if (utils.arraysEqual(Global.powerup[i], this.location)) {
            this.powerup(Global.poweruptype[i]);
            console.log(('[PWUP] ' + this.name + 'got a ' + Global.poweruptype[i]).magenta);
            Global.powerup.splice(i, 1);
            Global.poweruptype.splice(i, 1);
            Global.console.sendUTF(JSON.stringify({"type": "deletePowerup",
                                                   "location": this.location}));
          }
        }
        //console.log("[MOVE] " + this.name + " RIGHT");
        utils.sendConsole(JSON.stringify({"uuid": this.uuid,
                                          "move": direction,
                                          "top": this.location[1],
                                          "left": this.location[0]}));
        didMove = true;
      }
    }
    break;
  }

  if (!didMove) {
    utils.sendConsole(JSON.stringify({"uuid": this.uuid,
                                      "turn": direction}));
  }

};

User.prototype.reset = function () {
  // R.I.P.
  this.set_leaderboard();

  utils.sendConsole(JSON.stringify({"type": "delete",
                                    "uuid": this.uuid}));

  // remove from the arena
  Global.arena[this.location[0]][this.location[1]] = false;

  this.health = 3;
  this.score = 0;

  //this.set_location();
};

User.prototype.set_leaderboard = function () {
  Global.leaderboard.push([this.name, this.score]);
  Global.leaderboard.sort(function (a, b) { return b[1] - a[1]; });
  Global.leaderboard = Global.leaderboard.slice(0, 10);
  utils.sendConsole(JSON.stringify({"type": "leaderboard",
                                    "leaderboard": Global.leaderboard}));
};

User.prototype.destroy = function () {
  if (this.name) {
    this.set_leaderboard();
  }
  utils.sendConsole(JSON.stringify({"type": "delete",
                                    "uuid": this.uuid}));
  delete Global.users[this.uuid];
  console.log(("[DEST] " + this.uuid + " destroyed.").red);
};

exports.User = User;
