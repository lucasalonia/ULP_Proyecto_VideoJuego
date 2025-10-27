document.addEventListener("DOMContentLoaded", () => {
  const silabas = document.querySelectorAll(".silaba");
  const slots = document.querySelectorAll(".drop-slot");

  silabas.forEach(s => {
    s.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", s.dataset.silaba);
      s.classList.add("dragging");
    });
    s.addEventListener("dragend", () => s.classList.remove("dragging"));
  });

  slots.forEach(slot => {
    slot.addEventListener("dragover", e => {
      e.preventDefault();
      slot.classList.add("hover");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("hover");
    });

    slot.addEventListener("drop", e => {
      e.preventDefault();
      slot.classList.remove("hover");

      const draggedSilaba = e.dataTransfer.getData("text/plain");
      const expected = slot.dataset.expected;

      if (draggedSilaba === expected) {
        slot.textContent = draggedSilaba;
        slot.classList.add("correct");
      } else {
        slot.classList.add("incorrect");
        setTimeout(() => slot.classList.remove("incorrect"), 1000);
      }
    });
  });
});
