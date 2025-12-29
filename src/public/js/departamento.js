document.addEventListener("DOMContentLoaded", () => {

  // ==================================================
  //  LOCAL STORAGE – PROGRESO (CARTAS)
  // ==================================================
  function getProgresoLocal() {
    return JSON.parse(localStorage.getItem("comarcas_progreso")) || {
      cartas: {},
      mapa: {}
    };
  }

  function guardarParajeLocal(departamentoId, parajeId) {
    const data = getProgresoLocal();

    const depId = String(departamentoId);
    const pId = String(parajeId);

    if (!data.cartas[depId]) {
      data.cartas[depId] = [];
    }

    if (!data.cartas[depId].includes(pId)) {
      data.cartas[depId].push(pId);
    }

    localStorage.setItem("comarcas_progreso", JSON.stringify(data));
  }

  function parajeYaCompletado(departamentoId, parajeId) {
    const data = getProgresoLocal();
    return data.cartas[String(departamentoId)]?.includes(String(parajeId));
  }

  // ==================================================
  //  DATOS DEL JUEGO (desde PUG)
  // ==================================================
  if (!window.JUEGO_DATA) return;

  const {
    ordenCorrecto = [],
    usuarioId,
    parajeId,
    departamentoId,
    nombreParaje = "Paraje",
    urlSiguiente,
    urlVolver
  } = window.JUEGO_DATA;

  const esInvitado = !usuarioId || isNaN(Number(usuarioId));

  // 👉 MUY IMPORTANTE: esto va ANTES de iniciar el juego
  if (esInvitado && parajeYaCompletado(departamentoId, parajeId)) {
    if (urlSiguiente) {
      window.location.href = urlSiguiente;
    }
    return;
  }

  // ==================================================
  //  CRONÓMETRO
  // ==================================================
  const cronometroEl = document.getElementById("cronometro");
  const startTime = Date.now();
  let cronometroInterval = null;

  function actualizarCronometro() {
    const diff = Date.now() - startTime;
    const minutos = Math.floor(diff / 60000);
    const segundos = Math.floor((diff % 60000) / 1000);
    const centesimas = Math.floor((diff % 1000) / 10);

    if (cronometroEl) {
      cronometroEl.textContent =
        `${String(minutos).padStart(2, "0")}:` +
        `${String(segundos).padStart(2, "0")}.` +
        `${String(centesimas).padStart(2, "0")}`;
    }
  }

  cronometroInterval = setInterval(actualizarCronometro, 50);

  // ==================================================
  //  ELEMENTOS DEL JUEGO
  // ==================================================
  const fichas = [...document.querySelectorAll(".ficha")];
  const casilleros = [...document.querySelectorAll("button.casillero")];

  if (!fichas.length || !casilleros.length) return;

  let fichaSeleccionada = null;

  // ==================================================
  //  TOAST
  // ==================================================
  const toast = document.querySelector(".comarca-toast");
  const toastMsg = document.querySelector(".comarca-toast-msg");

  function mostrarToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toastMsg.style.color = "black";
    toast.classList.remove("comarca-toast--oculto");
    toast.classList.add("comarca-toast--visible");
  }

  // ==================================================
  //  LÓGICA DE JUEGO
  // ==================================================
  const deseleccionarFicha = () => {
    if (fichaSeleccionada) {
      fichaSeleccionada.classList.remove("seleccionada");
    }
    fichaSeleccionada = null;
  };

  const asignarValorCasillero = (casillero, valor, idFicha = null) => {
    if (casillero.dataset.idFicha) {
      const anterior = document.querySelector(
        `.ficha[data-indice="${casillero.dataset.idFicha}"]`
      );
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
      c.classList.remove("correcto", "incorrecto", "shake", "pop");

      if (!valor) return;

      const bien = valor === ordenCorrecto[i];

      if (bien) {
        c.classList.add("correcto", "pop");
        setTimeout(() => c.classList.remove("pop"), 250);
      } else {
        c.classList.add("incorrecto", "shake");
        setTimeout(() => c.classList.remove("shake"), 350);
      }
    });

    const completo = casilleros.every(c => !!c.dataset.valor);
    const correcto = casilleros.every(
      (c, i) => c.dataset.valor === ordenCorrecto[i]
    );

    if (completo && correcto) {
      clearInterval(cronometroInterval);

      const fin = Date.now();
      const tiempo = fin - startTime;

      fetch("/logro-paraje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioId,
          paraje_id: parajeId,
          fecha_inicio: new Date(startTime),
          fecha_fin: new Date(fin),
          tiempo
        }),
      })
        .then(r => r.json())
        .then(data => {
          console.log("Logro guardado:", data);

          // 👉 INVITADO → guardar en localStorage
          if (data.guest) {
            guardarParajeLocal(departamentoId, parajeId);
          }
        })
        .catch(err => console.error("Error guardando logro:", err));

      mostrarToast(`¡Paraje completado: ${nombreParaje}!`);
    }
  };

  // ==================================================
  //  EVENTOS
  // ==================================================
  fichas.forEach(ficha => {
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

      if (casillero.dataset.valor) {
        asignarValorCasillero(casillero, null);
      }
    });
  });
});
