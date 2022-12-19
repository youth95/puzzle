window.addEventListener(
  "wheel",
  (ev) => {
    ev.stopPropagation();
  },
  { capture: true }
);