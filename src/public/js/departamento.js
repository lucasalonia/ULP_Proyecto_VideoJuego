// /public/js/departamento.js

document.addEventListener("DOMContentLoaded", () => {
  // ================================
  //  CRONÓMETRO POR PARAJE
  // ================================
  const cronometroEl = document.getElementById("cronometro");
  const startTime = Date.now();
  let cronometroInterval = null;

  function actualizarCronometro() {
    const ahora = Date.now();
    const diff = ahora - startTime;

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

  // ================================
  //  DATOS DEL JUEGO
  // ================================
  const fichas = [...document.querySelectorAll(".ficha")];
  const casilleros = [...document.querySelectorAll("button.casillero")];

  // Si por algún motivo no hay fichas/casilleros, no seguimos.
  if (!fichas.length || !casilleros.length || !window.JUEGO_DATA) return;

  const ordenCorrecto = window.JUEGO_DATA.ordenCorrecto || [];
  const usuarioId = window.JUEGO_DATA.usuarioId;
  const parajeId = window.JUEGO_DATA.parajeId;
  const nombreParaje = window.JUEGO_DATA.nombreParaje || "Paraje";

  let fichaSeleccionada = null;

  // ================================
  //  TOAST DE VICTORIA
  // ================================
  const toast = document.querySelector(".comarca-toast");
  const toastMsg = document.querySelector(".comarca-toast-msg");

  function mostrarToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toastMsg.style.color = "black"; // por las dudas si el fondo es blanco
    toast.classList.remove("comarca-toast--oculto");
    toast.classList.add("comarca-toast--visible");
  }


  // ================================
  //  LÓGICA DE FICHAS / CASILLEROS
  // ================================
  const deseleccionarFicha = () => {
    if (fichaSeleccionada) {
      fichaSeleccionada.classList.remove("seleccionada");
    }
    fichaSeleccionada = null;
  };

  const asignarValorCasillero = (casillero, valor, idFicha = null) => {
    // si el casillero ya tenía una ficha, la liberamos
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
    // marcar casilleros correctos/incorrectos
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
      // detener cronómetro
      clearInterval(cronometroInterval);

      const fin = Date.now();
      const tiempo = fin - startTime;

      // guardar logro en el backend
      fetch("/logro-paraje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: usuarioId,
          paraje_id: parajeId,
          fecha_inicio: new Date(startTime),
          fecha_fin: new Date(fin),
          tiempo: tiempo,
        }),
      })
        .then(r => r.json())
        .then(data => {
          console.log("Logro guardado:", data);
        })
        .catch(err => console.error("Error guardando logro:", err));

      // mostrar toast
      mostrarToast(`¡Paraje completado: ${nombreParaje}!`);
    }

    return correcto;
  };

  // ================================
  //  EVENTOS
  // ================================
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
      // si hay ficha seleccionada, la colocamos
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

      // si no hay ficha seleccionada, y el casillero tiene algo, lo vaciamos
      if (casillero.dataset.valor) {
        asignarValorCasillero(casillero, null);
      }
    });
  });
});
