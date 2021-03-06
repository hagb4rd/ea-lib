define(["require"], function(require) {
var Frame = document.querySelector("#Frame");
var Display = document.querySelector("#Display");

  var frame;
  var imageQueue, list=[];

var options = {
zoom: 3,
animation: {
  duration: 20000,
  easing: "ease-out",
  iterations: 1
},
restTime: 20000
};

var fetchImage = (src) => {
return new Promise((resolve, reject) => {
  if (src && src instanceof Image) {
    resolve(src);
  } else if (src) {
    var img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.src = src;
  } else {
    reject(new TypeError("missing Argument"));
  };
});
};
var rand = (...v) => { if(v.length==1) v.push(0); var min=Math.min.apply(null,v); var max=Math.max.apply(null,v);  return Math.floor(Math.random()*(max-min) + min) };

var startAnimation = (url) => {
return new Promise((resolve, reject) => {
  fetchImage(url || Display.src).then((img) => {
    Display.src = img.src;
    var scale = Frame.clientWidth / Display.naturalWidth;
    var keyframeB = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(' + String((scale).toFixed(2)) + ')'
    };
    var keyframeA = {
      position: 'absolute',
      top: rand(30,70) +'%',
      left: rand(30,70) +'%',
      transform: 'translate(-50%, -50%) scale(' + String((options.zoom * scale).toFixed(2)) + ')'
    };
    Display.style.transform = keyframeB.transform;
    var animation = Display.animate([keyframeA, keyframeB], options.animation);
    animation.onfinish = () => {
      var timeout = setTimeout(() => {
        resolve();
      }, options.restTime);
    };
  });
});
};
var add = (urls) => {
  if (urls && urls.length) {
    urls.forEach(url=>list.push(url));
  };
};
var enqueue = (imageList) => {
  if(Array.isArray(imageList)) {
    var p = imageList.reduce((prev, next) => prev.then(() => startAnimation(next)), imageQueue || Promise.resolve())
    imageQueue = p;
    return p;
  } else {
    throw TypeError("Argument imageList must be of type Array");
  };
};

var gallery = {
  nextStart: 0,
  next: (start,amount) => { amount=amount||10; if(!start){ start=gallery.nextStart; } gallery.nextStart=start+amount; gallery.enqueue(gallery.list.slice(start,start + amount)); },
  options: options,
  list: list,
  add: add,
  enqueue: enqueue,
  startAnimation: startAnimation,
  fetchImage: fetchImage
};
return gallery;

});