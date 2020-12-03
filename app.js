function setProperty(defOpt, newOpt) {
  const newKeys = Object.keys(newOpt);
  let options = {};
  for (let i = 0; i < defOpt.length; i++) {
    for (let j = 0; j < newKeys.length; j++) {
      let copy = newOpt[defOpt[i]];
      if (copy !== undefined) {
        options[defOpt[i]] = copy;
      }
    }
  }
  return options;
}
function animeScroll(elem, options) {
  let opt = setProperty(
    ["duration", "linkAnchor", "ease", "anim"],
    options || {}
  );
  checkProp(opt);
  let el, easeFunc, anim;
  if (elem instanceof Element) {
    el = elem;
  } else if (document.querySelector(elem)) {
    el = document.querySelector(elem);
  } else {
    throw "Элемент не является DOM элементом или не может быть найден по введенному селектору";
  }

  function checkProp(opt) {
    typeof opt.linkAnchor === "boolean"
      ? opt.linkAnchor
      : (opt.linkAnchor = true);
    (typeof opt.ease === "string" && opt.ease === "In") ||
    opt.ease === "Out" ||
    opt.ease === "InOut"
      ? (opt.ease = opt.ease)
      : (opt.ease = "In");
    typeof opt.duration === "number" ? opt.duration : (opt.duration = 1000);
    (typeof opt.anim === "string" && opt.anim === "quad") ||
    opt.anim === "linear" ||
    opt.anim === "bounce" ||
    opt.anim === "sine" ||
    opt.anim === "quart"
      ? (opt.anim = opt.anim)
      : (opt.anim = "quad");
  }
  const start = performance.now(),
    ease = opt.ease,
    startPos = window.pageYOffset,
    scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    ),
    windowHeight = document.documentElement.clientHeight,
    duration = opt.duration;
  let endPos = el.offsetTop;
  if (scrollHeight - windowHeight <= endPos)
    endPos = scrollHeight - windowHeight;
  const path = endPos - startPos;

  switch (ease) {
    case "In":
      easeFunc = function makeEaseIn(timing) {
        return function (timeFraction) {
          return timing(timeFraction);
        };
      };
      break;
    case "Out":
      easeFunc = function makeEaseOut(timing) {
        return function (timeFraction) {
          return 1 - timing(1 - timeFraction);
        };
      };
      break;
    case "InOut":
      easeFunc = function makeEaseInOut(timing) {
        return function (timeFraction) {
          if (timeFraction < 0.5) return timing(2 * timeFraction) / 2;
          else return (2 - timing(2 * (1 - timeFraction))) / 2;
        };
      };
      break;
  }
  switch (opt.anim) {
    case "quad":
      anim = function swing(timeFraction) {
        return Math.pow(timeFraction, 2);
      };
      break;
    case "linear":
      anim = function linear(timeFraction) {
        return timeFraction;
      };
      break;
    case "bounce":
      anim = function bounce(timeFraction) {
        for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
          if (timeFraction >= (7 - 4 * a) / 11) {
            return (
              -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) +
              Math.pow(b, 2)
            );
          }
        }
      };
      break;
    case "sine":
      anim = function easeInSine(x) {
        return 1 - Math.cos((x * Math.PI) / 2);
      };
      break;
    case "quart":
      anim = function easeInQuart(x) {
        return x * x * x * x;
      };
      break;
  }
  // function elastic(x, timeFraction) {
  //   return (
  //     Math.pow(2, 10 * (timeFraction - 1)) *
  //     Math.cos(((20 * Math.PI * x) / 3) * timeFraction)
  //   );
  // }

  function anime(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;
    let easing = easeFunc(anim);

    window.scrollTo(0, startPos + easing(timeFraction) * path);

    if (timeFraction < 1) {
      requestAnimationFrame(anime);
    }
  }
  requestAnimationFrame(anime);
}

// document.querySelectorAll("a").forEach((item) => {
let a = document.querySelectorAll("a");
for (let i = 0; i < a.length; i++) {
  let item = a[i];
  // item.onclick = (event) => {
  item.onclick = function (event) {
    event.preventDefault();
    const elemTo = event.target.getAttribute("href");
    // quad
    // quart
    // bounce
    // sine
    // linear
    animeScroll(elemTo, { duration: 1000, ease: "Out", anim: "quart" });
  };
}
// });
