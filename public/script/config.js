var MAP_WIDTH  = 800,
    MAP_HEIGHT = 600,

    PADDLE_WIDTH  = 20,
    PADDLE_HEIGHT = 150;

var config = {
  map: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT
  },

  objects: {
    goal: {
      width: 1,
      height: MAP_HEIGHT,
      position: [{
        x: -1,
        y: 0
      }, {
        x: MAP_WIDTH,
        y: 0
      }]
    },

    wall: {
      width: MAP_WIDTH,
      height: 1,
      position: [{
        x: 0,
        y: -1
      }, {
        x: 0,
        y: MAP_HEIGHT
      }]
    },

    paddle: {
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      position: [{
        x: PADDLE_WIDTH,
        y: 250
      }, {
        x: MAP_WIDTH - 2 * PADDLE_WIDTH,
        y: 250
      }]
    },

    ball: {
      radius: 1,
      position: {
        x: 392.5,
        y: 292.5
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
