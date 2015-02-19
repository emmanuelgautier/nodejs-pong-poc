'use strict';

/**
 *
 *
 */
module.exports = function(id) {

  console.log('ready');

  this.users[id].ready = true;

  //if two players are connected
  if(Object.keys(this.users).length === 2) {
    var openent = this.users[(id === this.uuids[0]) ? this.uuids[1] : this.uuids[0]];

    if(openent.ready) {
      this.start(); 
    }
  }
};
