import { tweened } from "svelte/motion";
import { cubicInOut } from "svelte/easing";

export function transparentStroke(node, { duration = 10000, delay = 10000 }) {
  const currOpacity = +getComputedStyle(node).strokeOpacity;
  let opacity = tweened(currOpacity, {
    duration,
    delay: 1000,
    easing: cubicInOut,
  });

  let unsubOpacity = opacity.subscribe(
    (o) => (node.style.strokeOpacity = `${o}`)
  );

  opacity.update((_) => 0.3, { duration, delay });

  return {
    destroy() {
      unsubOpacity();
    },
  };
}
