// ============================================
//  CRONÓMETRO POR PARAJE (FASE 1)
// ============================================

let startTime = Date.now();  // Se inicia al cargar la página
let cronometroInterval = null;

function actualizarCronometro() {
  const ahora = Date.now();
  const diff = ahora - startTime;

  const minutos = Math.floor(diff / 60000);
  const segundos = Math.floor((diff % 60000) / 1000);
  const centesimas = Math.floor((diff % 1000) / 10);
  const el = document.getElementById("cronometro");
  if (el) {
    el.textContent =
      `${String(minutos).padStart(2, "0")}:` +
      `${String(segundos).padStart(2, "0")}.` +
      `${String(centesimas).padStart(2, "0")}`;
  }
}

// Comienza a actualizar cuando se cargó la página
document.addEventListener("DOMContentLoaded", () => {
  cronometroInterval = setInterval(actualizarCronometro, 50);
});

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

  clearInterval(cronometroInterval);

  const inicio = startTime;
  const fin = Date.now();
  const tiempo = fin - inicio;

  fetch("/logro-paraje", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario_id: window.JUEGO_DATA.usuarioId,
      paraje_id: window.JUEGO_DATA.parajeId,
      fecha_inicio: new Date(inicio),
      fecha_fin: new Date(fin),
      tiempo: tiempo
    })
  })
    .then(r => r.json())
    .then(data => {
      console.log("Logro guardado:", data);
    })
    .catch(err => console.error("Error guardando logro:", err));

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
