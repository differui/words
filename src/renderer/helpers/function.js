export function throttle(delay, action, tail, debounce) {
  const now = Date.now;
  let lastCall = 0;
  let lastExec = 0;
  let timer = null;
  let curr;
  let diff;
  let ctx;
  let args;
  function exec() {
    lastExec = now();
    action.apply(ctx, args);
  }

  return function rtn(...theArgs) {
    ctx = this;
    args = theArgs;
    curr = now();
    diff = curr - (debounce ? lastCall : lastExec) - delay;
    clearTimeout(timer);

    if (debounce) {
      if (tail) {
        timer = setTimeout(exec, delay);
      } else if (diff >= 0) {
        exec();
      }
    } else if (diff >= 0) {
      exec();
    } else if (tail) {
      timer = setTimeout(exec, -diff);
    }

    lastCall = curr;
  };
}

export function debounce(idle, action, tail) {
  return throttle(idle, action, tail, true);
}
