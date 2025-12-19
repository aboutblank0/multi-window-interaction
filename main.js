const sendInterval = 16;

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
    if (diff > sendInterval * 2) toRemove.push(w);
  }

  for (const id of toRemove) {
    console.log(`Cleaned id ${id} from list`);
    delete windows[id];
  }
};

setInterval(() => {
  const position = {
    x: window.screenX,
    y: window.screenY,
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
  };
  channel.postMessage({
    id: randomId.toString(),
    position: position,
    time: Date.now(),
  });

  //loop through every window and make a direction
  var arrows = [];
  for (const other in windows) {
    const position = windows[other].position;
    const thisCenterX = window.screenX + window.outerWidth / 2;
    const thisCenterY = window.screenY + window.outerHeight / 2;

    const otherCenterX = position.x + position.outerWidth / 2;
    const otherCenterY = position.y + position.outerHeight / 2;

    const dx = otherCenterX - thisCenterX;
    const dy = otherCenterY - thisCenterY;

    const angle = Math.atan2(dy, dx);
    const distance = Math.hypot(dx, dy);

    arrows.push({ angle, distance });
  }

  canvas.setArrows(arrows);
}, sendInterval);
