//Need to requestAnimationFrame to smooth out animation
//Fix not pointing exactly to the middle.

const messageInterval = 100;
const channel = new BroadcastChannel("multi-window");
const canvas = new ScreenCanvas();

var randomId = crypto.randomUUID();
var windows = {};

channel.onmessage = (event) => {
  windows[event.data.id] = {
    position: event.data.position,
    time: event.data.time,
  };

  //loop through every window time, remove any that have spent too long without updating their location
  var toRemove = [];
  var now = Date.now();
  for (const w in windows) {
    let diff = now - windows[w].time;
    if (diff > messageInterval * 2) toRemove.push(w);
  }

  for (const id of toRemove) {
    console.log(`Cleaned id ${id} from list`);
    delete windows[id];
  }

  //loop through every window and make a direction
  var directions = [];
  for (const other in windows) {
    var dx = windows[other].position.x - window.screenX;
    var dy = windows[other].position.y - window.screenY;
    const angle = Math.atan2(dy, dx);
    directions.push(angle);
  }

  canvas.setArrowDirections(directions);
};

setInterval(() => {
  const position = { x: window.screenX, y: window.screenY };
  channel.postMessage({
    id: randomId.toString(),
    position: position,
    time: Date.now(),
  });
}, messageInterval);
