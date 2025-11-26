document.addEventListener("DOMContentLoaded", () => {

  const fichas = [...document.querySelectorAll(".ficha")];
  const casilleros = [...document.querySelectorAll("button.casillero")];
  const ordenCorrecto = window.JUEGO_DATA.ordenCorrecto;

  let fichaSeleccionada = null;

  const toast = document.querySelector(".toast");
  const toastMsg = document.querySelector(".toast-msg");

  function mostrarToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.remove("toast--oculto");
    toast.classList.add("toast--visible");
  }

  const deseleccionarFicha = () => {
    if (fichaSeleccionada) fichaSeleccionada.classList.remove("seleccionada");
    fichaSeleccionada = null;
  };

  const asignarValorCasillero = (casillero, valor, idFicha = null) => {
    if (casillero.dataset.idFicha) {
      const anterior = document.querySelector(`.ficha[data-indice="${casillero.dataset.idFicha}"]`);
      if (anterior) {
        anterior.dataset.usada = "0";
        anterior.classList.remove("usada");
      }
    }

    if (valor) {
      casillero.textContent = valor;
      casillero.dataset.valor = valor;
      casillero.dataset.idFicha = idFicha;
    } else {
      casillero.textContent = "";
      delete casillero.dataset.valor;
      delete casillero.dataset.idFicha;
    }
  };

  const verificarVictoria = () => {

  casilleros.forEach((c, i) => {
    const valor = c.dataset.valor;

    if (!valor) {
      c.classList.remove("correcto", "incorrecto", "shake", "pop");
      return;
    }

    const bien = valor === ordenCorrecto[i];

    c.classList.remove("correcto", "incorrecto", "shake", "pop");

    if (bien) {
      c.classList.add("correcto", "pop");

      setTimeout(() => c.classList.remove("pop"), 250);

    } else {
      c.classList.add("incorrecto", "shake");

      setTimeout(() => c.classList.remove("shake"), 350);
    }
  });

  // cuando todos están bien → TOAST
  const completo = casilleros.every(c => !!c.dataset.valor);
  const correcto = casilleros.every((c, i) => c.dataset.valor === ordenCorrecto[i]);

  if (completo && correcto) {
    mostrarToast(`¡Paraje completado: ${window.JUEGO_DATA.nombreParaje}!`);
  }

  return correcto;
};




  fichas.forEach(ficha => {
    ficha.dataset.usada = "0";

    ficha.addEventListener("click", () => {
      if (ficha.dataset.usada === "1") return;

      if (fichaSeleccionada === ficha) return deseleccionarFicha();

      deseleccionarFicha();
      ficha.classList.add("seleccionada");
      fichaSeleccionada = ficha;
    });
  });

  casilleros.forEach(casillero => {
    casillero.addEventListener("click", () => {
      if (fichaSeleccionada) {
        asignarValorCasillero(
          casillero,
          fichaSeleccionada.dataset.silaba,
          fichaSeleccionada.dataset.indice
        );

        fichaSeleccionada.dataset.usada = "1";
        fichaSeleccionada.classList.remove("seleccionada");
        fichaSeleccionada.classList.add("usada");
        fichaSeleccionada = null;

        verificarVictoria();
        return;
      }

      if (casillero.dataset.valor) asignarValorCasillero(casillero, null);
    });
  });

});
