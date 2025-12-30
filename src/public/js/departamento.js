document.addEventListener("DOMContentLoaded", () => {
  if (!window.JUEGO_DATA) return;

  const {
    ordenCorrecto = [],
    usuarioId,
    parajeId,
    departamentoId,
    nombreParaje = "Paraje",
    parajesDepartamento = [],
  } = window.JUEGO_DATA;

  const esInvitado = usuarioId === null;

  // ==================================================
  // LOCAL STORAGE – SOLO INVITADOS
  // ==================================================
  function getProgresoLocal() {
    return (
      JSON.parse(localStorage.getItem("comarcas_progreso")) || {
        cartas: {},
        mapa: {},
      }
    );
  }

  function guardarParajeLocal(departamentoId, parajeId) {
    const data = getProgresoLocal();
    const depId = String(departamentoId);
    const pId = String(parajeId);

    if (!data.cartas[depId]) data.cartas[depId] = [];
    if (!data.cartas[depId].includes(pId)) {
      data.cartas[depId].push(pId);
    }

    localStorage.setItem("comarcas_progreso", JSON.stringify(data));
  }

  // ==================================================
  // CRONÓMETRO
  // ==================================================
  const cronometroEl = document.getElementById("cronometro");
  const startTime = Date.now();

  const cronometroInterval = setInterval(() => {
    const diff = Date.now() - startTime;
    const m = Math.floor(diff / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const c = Math.floor((diff % 1000) / 10);

    if (cronometroEl) {
      cronometroEl.textContent =
        `${String(m).padStart(2, "0")}:` +
        `${String(s).padStart(2, "0")}.` +
        `${String(c).padStart(2, "0")}`;
    }
  }, 50);

  // ==================================================
  // ELEMENTOS
  // ==================================================
  const fichas = [...document.querySelectorAll(".ficha")];
  const casilleros = [...document.querySelectorAll("button.casillero")];

  let fichaSeleccionada = null;

  // ==================================================
  // TOAST
  // ==================================================
  const toast = document.querySelector(".comarca-toast");
  const toastMsg = document.querySelector(".comarca-toast-msg");

  function mostrarToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.remove("comarca-toast--oculto");
    toast.classList.add("comarca-toast--visible");
  }

  // ==================================================
  // UTILIDADES
  // ==================================================
  function deseleccionarFicha() {
    if (fichaSeleccionada) {
      fichaSeleccionada.classList.remove("seleccionada");
      fichaSeleccionada = null;
    }
  }

  function liberarFicha(idFicha) {
    const ficha = document.querySelector(
      `.ficha[data-indice="${idFicha}"]`
    );
    if (!ficha) return;

    ficha.dataset.usada = "0";
    ficha.classList.remove("usada");
  }

  function asignarCasillero(casillero, ficha) {
    casillero.textContent = ficha.dataset.silaba;
    casillero.dataset.valor = ficha.dataset.silaba;
    casillero.dataset.idFicha = ficha.dataset.indice;

    ficha.dataset.usada = "1";
    ficha.classList.remove("seleccionada");
    ficha.classList.add("usada");

    fichaSeleccionada = null;
  }

  function limpiarCasillero(casillero) {
    liberarFicha(casillero.dataset.idFicha);

    casillero.textContent = "";
    delete casillero.dataset.valor;
    delete casillero.dataset.idFicha;
    casillero.classList.remove("correcto", "incorrecto");
  }

  // ==================================================
  // VERIFICAR VICTORIA
  // ==================================================
  function verificarVictoria() {
    casilleros.forEach((c, i) => {
      c.classList.remove("correcto", "incorrecto", "shake", "pop");

      if (!c.dataset.valor) return;

      if (c.dataset.valor === ordenCorrecto[i]) {
        c.classList.add("correcto", "pop");
      } else {
        c.classList.add("incorrecto", "shake");
      }
    });

    const completo = casilleros.every((c) => c.dataset.valor);
    const correcto = casilleros.every(
      (c, i) => c.dataset.valor === ordenCorrecto[i]
    );

    if (completo && correcto) {
      clearInterval(cronometroInterval);

      if (esInvitado) {
        guardarParajeLocal(departamentoId, parajeId);
      }

      mostrarToast(`¡Paraje completado: ${nombreParaje}!`);
    }
  }

  // ==================================================
  // EVENTOS FICHAS
  // ==================================================
  fichas.forEach((ficha) => {
    ficha.dataset.usada = "0";

    ficha.addEventListener("click", () => {
      if (ficha.dataset.usada === "1") return;

      if (fichaSeleccionada === ficha) {
        deseleccionarFicha();
        return;
      }

      deseleccionarFicha();
      ficha.classList.add("seleccionada");
      fichaSeleccionada = ficha;
    });
  });

  // ==================================================
  // EVENTOS CASILLEROS
  // ==================================================
  casilleros.forEach((casillero) => {
    casillero.addEventListener("click", () => {
      if (fichaSeleccionada) {
        asignarCasillero(casillero, fichaSeleccionada);
        verificarVictoria();
        return;
      }

      if (casillero.dataset.valor) {
        limpiarCasillero(casillero);
      }
    });
  });

  // ==================================================
  // NAVEGACIÓN "SIGUIENTE" USANDO LOCAL STORAGE (INVITADOS)
  // ==================================================
  const btnSiguiente = document.querySelector(".btn-siguiente");

  if (btnSiguiente && esInvitado) {
    btnSiguiente.addEventListener("click", (e) => {
      e.preventDefault();

      const data = getProgresoLocal();
      const depId = String(departamentoId);
      const completados = data.cartas?.[depId] || [];

      const siguiente = parajesDepartamento.find(
        (p) => !completados.includes(String(p.id))
      );

      if (siguiente) {
        window.location.href =
          `/departamento/${departamentoId}?paraje=${siguiente.id}`;
      } else {
        window.location.href =
          `/departamento/${departamentoId}/completado`;
      }


    });
  }
});
