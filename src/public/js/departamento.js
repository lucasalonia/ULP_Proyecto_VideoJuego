document.addEventListener("DOMContentLoaded", () => {
  if (!window.JUEGO_DATA) return;

  const {
    ordenCorrecto = [],
    usuarioId,
    parajeId,
    departamentoId,
    nombreParaje = "Paraje",
  } = window.JUEGO_DATA;

  const esInvitado = usuarioId === null || usuarioId === undefined;
  let victoriaProcesada = false;

  // Para bloquear interacción cuando está en pausa
  const escenaEl = document.querySelector(".escena");

  // ==================================================
  // MODAL REGLAS
  // ==================================================
  const btnReglas = document.getElementById("btnReglas");
  const modalReglas = document.getElementById("modalReglas");
  const btnCerrarReglas = document.getElementById("btnCerrarReglas");

  function openReglas() {
    if (!modalReglas) return;

    // si está corriendo, pausamos por reglas
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
  // CRONÓMETRO (con Pausa/Reanudar)
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
      // pausar
      elapsedMs += Date.now() - baseStart;
      isPaused = true;
      stopCronometro();
      renderCronometro();

      if (btnPausa) {
        btnPausa.textContent = "Reanudar";
        btnPausa.setAttribute("aria-pressed", "true");
      }

      // bloquear sílabas + casilleros
      setPausedUI(true);
      // también sacamos selección para evitar confusión visual
      deseleccionarFicha();

      return;
    }

    // reanudar
    baseStart = Date.now();
    isPaused = false;
    startCronometro();

    if (btnPausa) {
      btnPausa.textContent = "Pausa";
      btnPausa.setAttribute("aria-pressed", "false");
    }

    // habilitar
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

  // Si el casillero ya tenía una ficha, primero la liberamos
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
  // BACKEND – GUARDAR LOGRO (NO guardar tiempo_mapa acá)
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

    // Solo logro (progreso del juego)
    await postJSON("/logro-paraje", {
      paraje_id: parajeId,
      fecha_inicio,
      fecha_fin,
      tiempo,
    });

    // Importante: NO llamar /tiempo_mapa desde el juego
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

    if (!completo || !correcto || victoriaProcesada) return;
    victoriaProcesada = true;

    if (btnPausa) btnPausa.style.display = "none";
    stopCronometro();
    setPausedUI(true); // al ganar, bloqueamos para que no sigan tocando

    if (btnPausa) {
      btnPausa.setAttribute("aria-pressed", "true");
      btnPausa.textContent = "Reanudar";
    }

    mostrarToast(`¡Paraje completado: ${nombreParaje}!`);

    if (esInvitado) {
      guardarParajeLocal(departamentoId, parajeId);
    } else {
      guardarBD().catch(() => {});
    }
  }

  // ==================================================
  // EVENTOS FICHAS
  // ==================================================
  fichas.forEach((ficha) => {
    ficha.dataset.usada = "0";

    ficha.addEventListener("click", () => {
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

  // ==================================================
  // EVENTOS CASILLEROS
  // ==================================================
  casilleros.forEach((casillero) => {
    casillero.addEventListener("click", () => {
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

  // ==================================================
  // BOTÓN "SIGUIENTE" / "VOLVER"
  // ==================================================
  document.querySelectorAll(".btn-siguiente, .btn-volver").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const href = btn.getAttribute("href");
      if (href) window.location.href = href;
    });
  });
});
