document.addEventListener("DOMContentLoaded", () => {

  if (!window.JUEGO_DATA) return;

  const {
    ordenCorrecto = [],
    usuarioId,
    parajeId,
    departamentoId,
    nombreParaje = "Paraje",
  } = window.JUEGO_DATA;
  // ======================================
  // CONTINUAR PROGRESO LOCAL
  // ======================================

  if (usuarioId === null || usuarioId === undefined) {

    const progreso = JSON.parse(localStorage.getItem("comarcas_progreso") || "{}");

    const completados = progreso.cartas?.[departamentoId];

    if (Array.isArray(completados) && completados.length > 0) {

      const ultimo = completados[completados.length - 1];

      const parajes = window.JUEGO_DATA.parajesDepartamento;

      const index = parajes.findIndex(p => String(p.id) === String(ultimo));

      const siguiente = parajes[index + 1];

      if (siguiente && !window.location.search.includes("paraje")) {

        window.location.href = `/departamento/${departamentoId}?paraje=${siguiente.id}`;

      }

    }

  }
  const esInvitado = usuarioId === null || usuarioId === undefined;
  let victoriaProcesada = false;

  const escenaEl = document.querySelector(".escena");


  // ==================================================
  // RECUPERAR PROGRESO LOCAL (SIN REDIRECCIÓN)
  // ==================================================

  function obtenerUltimoParajeLocal() {

    const progreso = JSON.parse(localStorage.getItem("comarcas_progreso") || "{}");

    if (!progreso.cartas) return null;

    const completados = progreso.cartas[departamentoId];

    if (!Array.isArray(completados) || completados.length === 0) return null;

    return completados[completados.length - 1];
  }

  // ==================================================
  // MODAL REGLAS
  // ==================================================

  const btnReglas = document.getElementById("btnReglas");
  const modalReglas = document.getElementById("modalReglas");
  const btnCerrarReglas = document.getElementById("btnCerrarReglas");

  function openReglas() {

    if (!modalReglas) return;

    if (!isPaused && !victoriaProcesada) {
      pausedByRules = true;
      togglePausa();
    } else {
      pausedByRules = false;
    }

    modalReglas.classList.add("is-open");
    modalReglas.setAttribute("aria-hidden", "false");
  }

  function closeReglas() {

    if (!modalReglas) return;

    modalReglas.classList.remove("is-open");
    modalReglas.setAttribute("aria-hidden", "true");
  }

  if (btnReglas) btnReglas.addEventListener("click", openReglas);
  if (btnCerrarReglas) btnCerrarReglas.addEventListener("click", closeReglas);

  if (modalReglas) {
    modalReglas.addEventListener("click", (e) => {
      if (e.target === modalReglas) closeReglas();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeReglas();
  });



  // ==================================================
  // LOCAL STORAGE
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
  const btnPausa = document.getElementById("btnPausa");

  const fechaInicioISO = new Date().toISOString();

  let baseStart = Date.now();
  let elapsedMs = 0;

  let isPaused = false;
  let pausedByRules = false;

  let cronometroInterval = null;

  function formatTiempo(ms) {

    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const c = Math.floor((ms % 1000) / 10);

    return (
      `${String(m).padStart(2, "0")}:` +
      `${String(s).padStart(2, "0")}.` +
      `${String(c).padStart(2, "0")}`
    );
  }

  function getElapsedMs() {

    return elapsedMs + (isPaused ? 0 : Date.now() - baseStart);
  }

  function renderCronometro() {

    if (!cronometroEl) return;

    cronometroEl.textContent = formatTiempo(getElapsedMs());
  }

  function startCronometro() {

    if (cronometroInterval) clearInterval(cronometroInterval);

    cronometroInterval = setInterval(renderCronometro, 50);
  }

  function stopCronometro() {

    if (cronometroInterval) clearInterval(cronometroInterval);

    cronometroInterval = null;
  }

  function setPausedUI(paused) {

    if (!escenaEl) return;

    if (paused) escenaEl.classList.add("is-paused");
    else escenaEl.classList.remove("is-paused");
  }



  function togglePausa() {

    if (victoriaProcesada) return;

    if (!isPaused) {

      elapsedMs += Date.now() - baseStart;

      isPaused = true;

      stopCronometro();
      renderCronometro();

      if (btnPausa) {
        btnPausa.textContent = "Reanudar";
        btnPausa.setAttribute("aria-pressed", "true");
      }

      setPausedUI(true);
      deseleccionarFicha();

      return;
    }

    baseStart = Date.now();
    isPaused = false;

    startCronometro();

    if (btnPausa) {
      btnPausa.textContent = "Pausa";
      btnPausa.setAttribute("aria-pressed", "false");
    }

    setPausedUI(false);
  }

  if (btnPausa) btnPausa.addEventListener("click", togglePausa);

  startCronometro();
  renderCronometro();



  function getTiempoSegundos() {

    return Math.max(0, Math.floor(getElapsedMs() / 1000));
  }



  // ==================================================
  // ELEMENTOS
  // ==================================================

  const fichas = [...document.querySelectorAll(".ficha")];
  const casilleros = [...document.querySelectorAll("button.casillero")];

  let fichaSeleccionada = null;
  let animandoError = false;



  // ==================================================
  // TOAST
  // ==================================================

  const toast = document.querySelector(".comarca-toast");
  const toastMsg = document.querySelector(".comarca-toast-msg");

  function mostrarToast(msg) {

    if (!toast || !toastMsg) return;

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

    if (idFicha === undefined || idFicha === null || idFicha === "") return;

    const ficha = document.querySelector(`.ficha[data-indice="${idFicha}"]`);

    if (!ficha) return;

    ficha.dataset.usada = "0";
    ficha.classList.remove("usada");
  }



  function asignarCasillero(casillero, ficha) {

    if (casillero.dataset.idFicha) {

      liberarFicha(casillero.dataset.idFicha);

      casillero.textContent = "";

      delete casillero.dataset.valor;
      delete casillero.dataset.idFicha;

      casillero.classList.remove("correcto", "incorrecto");
    }

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
  // BACKEND
  // ==================================================

  async function postJSON(url, payload) {

    try {

      const res = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return { ok: false };

      return await res.json();

    } catch {

      return { ok: false };
    }
  }

  async function guardarBD() {

    const fecha_inicio = fechaInicioISO;
    const fecha_fin = new Date().toISOString();
    const tiempo = getTiempoSegundos();

    await postJSON("/logro-paraje", {
      paraje_id: parajeId,
      fecha_inicio,
      fecha_fin,
      tiempo,
    });
  }



  // ==================================================
  // VERIFICAR VICTORIA
  // ==================================================

  async function verificarVictoria() {

    if (animandoError) return;

    const casillerosIncorrectos = [];

    casilleros.forEach((c, i) => {

      c.classList.remove("correcto", "incorrecto", "shake", "pop");

      if (!c.dataset.valor) return;

      if (c.dataset.valor === ordenCorrecto[i]) {
        c.classList.add("correcto", "pop");
      } else {
        c.classList.add("incorrecto", "shake");
        casillerosIncorrectos.push(c);
      }
    });

    const completo = casilleros.every((c) => c.dataset.valor);

    const correcto = casilleros.every(
      (c, i) => c.dataset.valor === ordenCorrecto[i]
    );

    if (completo && !correcto) {
      animandoError = true;

      deseleccionarFicha();

      await new Promise((resolve) => setTimeout(resolve, 450));

      casillerosIncorrectos.forEach((casillero) => {
        limpiarCasillero(casillero);
        casillero.classList.remove("shake");
      });

      animandoError = false;
      return;
    }

    if (!completo || !correcto || victoriaProcesada) return;

    victoriaProcesada = true;

    if (btnPausa) btnPausa.style.display = "none";

    stopCronometro();

    setPausedUI(true);

    if (btnPausa) {
      btnPausa.setAttribute("aria-pressed", "true");
      btnPausa.textContent = "Reanudar";
    }

    mostrarToast(`¡Paraje completado: ${nombreParaje}!`);

    if (esInvitado) {
      guardarParajeLocal(departamentoId, parajeId);
    } else {
      guardarBD().catch(() => { });
    }
  }



  // ==================================================
  // EVENTOS
  // ==================================================

  fichas.forEach((ficha) => {

    ficha.dataset.usada = "0";

      ficha.addEventListener("click", () => {

      if (animandoError) return;
      if (isPaused) return;
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

  casilleros.forEach((casillero) => {

    casillero.addEventListener("click", () => {

      if (animandoError) return;
      if (isPaused) return;

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

});
