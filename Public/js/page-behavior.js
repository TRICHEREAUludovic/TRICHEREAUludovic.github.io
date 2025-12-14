// Bloquer clic droit
document.addEventListener("contextmenu", (e) => e.preventDefault());

// Bloquer raccourcis DevTools
document.addEventListener("keydown", (e) => {
  if (
    e.key === "F12" ||
    (e.ctrlKey &&
      e.shiftKey &&
      ["i", "j", "c"].includes(e.key.toLowerCase())) ||
    (e.ctrlKey && ["u", "s"].includes(e.key.toLowerCase()))
  ) {
    e.preventDefault();
  }
});
