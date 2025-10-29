document.addEventListener("DOMContentLoaded", () => {
  const chips = [...document.querySelectorAll(".silaba")];
  const slots = [...document.querySelectorAll("button.slot")];
  const ordenCorrecto = (window.JUEGO_DATA && window.JUEGO_DATA.ordenCorrecto) || [];

  let selectedChip = null;

  const deselectChip = () => {
    if (selectedChip) selectedChip.classList.remove("selected");
    selectedChip = null;
  };

  const setSlotValue = (slot, valor, chipId = null) => {
    if (slot.dataset.chipId) {
      const prev = document.querySelector(`.silaba[data-id="${slot.dataset.chipId}"]`);
      if (prev) {
        prev.dataset.used = "0";
        prev.classList.remove("used");
      }
    }

    if (valor) {
      slot.textContent = valor;
      slot.dataset.value = valor;
      if (chipId !== null) slot.dataset.chipId = chipId;
    } else {
      slot.textContent = "";
      delete slot.dataset.value;
      delete slot.dataset.chipId;
    }

    slot.classList.remove("incorrect", "correct");
  };

  const checkWin = () => {
    const filled = slots.every(s => !!s.dataset.value);
    if (!filled) return false;

    const correcto = slots.every((s, i) => s.dataset.value === (ordenCorrecto[i] || ""));
    slots.forEach((s, i) => {
      const match = s.dataset.value === (ordenCorrecto[i] || "");
      s.classList.toggle("correct", match);
      s.classList.toggle("incorrect", !match);
    });

    if (correcto) setTimeout(() => alert("¡Bien! ✅"), 200);
    return correcto;
  };

  chips.forEach(chip => {
    chip.dataset.used = chip.dataset.used || "0";
    chip.addEventListener("click", () => {
      if (chip.dataset.used === "1") return;
      if (selectedChip === chip) return deselectChip();
      deselectChip();
      chip.classList.add("selected");
      selectedChip = chip;
    });
  });

  slots.forEach(slot => {
    slot.addEventListener("click", () => {
      if (selectedChip) {
        setSlotValue(slot, selectedChip.dataset.silaba, selectedChip.dataset.id);
        selectedChip.dataset.used = "1";
        selectedChip.classList.remove("selected");
        selectedChip.classList.add("used");
        selectedChip = null;
        checkWin();
        return;
      }

      if (slot.dataset.value) setSlotValue(slot, null);
    });
  });
});
