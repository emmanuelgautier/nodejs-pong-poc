'use strict';

module.exports = {
  map: {
    width: 800,
    height: 600
  },

  objects: {
    goal: [{
      width: 0,
      height: 0,
      position: {
        x: 0,
        y: 0
      }
    }, {
      width: 0,
      height: 0,
      position: {
        x: 0,
        y: 0
      }
    }],

    walls: [{
      width: 0,
      height: 0,
      position: {
        x: 0,
        y: 0
      }
    }, {
      width: 0,
      height: 0,
      position: {
        x: 0,
        y: 0
      }
    }],

    paddle: [{
      width: 0,
      height: 0,
      position: {
        x: 0,
        y: 0
      }
    }, {
      width: 0,
      height: 0,
      position: {
        x: 0,
        y: 0
      }
    }],

    ball: {
      radius: 0,
      position: {
        x: 0,
        y: 0
      }
    }
  },

  velocity: {
    paddle: 300,

    ball: {
      min: 300,
      max: 1500
    }
  }
};
