// Espera a que el DOM esté listo antes de ejecutar el juego
document.addEventListener("DOMContentLoaded", () => {

  // === VARIABLES PRINCIPALES ===
  const fichas = [...document.querySelectorAll(".ficha")]; // todas las sílabas
  const casilleros = [...document.querySelectorAll("button.casillero")]; // espacios de armado
  const ordenCorrecto = (window.JUEGO_DATA && window.JUEGO_DATA.ordenCorrecto) || []; // orden correcto cargado desde el servidor

  let fichaSeleccionada = null; // ficha actualmente seleccionada

  // === FUNCIONES ===

  // Quita la selección de una ficha
  const deseleccionarFicha = () => {
    if (fichaSeleccionada) fichaSeleccionada.classList.remove("seleccionada");
    fichaSeleccionada = null;
  };

  // Asigna (o limpia) una ficha dentro de un casillero
  const asignarValorCasillero = (casillero, valor, idFicha = null) => {
    // Si el casillero ya tenía una ficha, liberarla
    if (casillero.dataset.idFicha) {
      const anterior = document.querySelector(`.ficha[data-indice="${casillero.dataset.idFicha}"]`);
      if (anterior) {
        anterior.dataset.usada = "0";
        anterior.classList.remove("usada");
      }
    }

    // Colocar nueva ficha o limpiar
    if (valor) {
      casillero.textContent = valor;
      casillero.dataset.valor = valor;
      if (idFicha !== null) casillero.dataset.idFicha = idFicha;
    } else {
      casillero.textContent = "";
      delete casillero.dataset.valor;
      delete casillero.dataset.idFicha;
    }

    // Quita estilos de validación anteriores
    casillero.classList.remove("incorrecto", "correcto");
  };

  // Comprueba si todas las fichas están en el orden correcto
  const verificarVictoria = () => {
    const completo = casilleros.every(c => !!c.dataset.valor);
    if (!completo) return false;

    const correcto = casilleros.every(
      (c, i) => c.dataset.valor === (ordenCorrecto[i] || "")
    );

    // Marca los casilleros como correctos o incorrectos
    casilleros.forEach((c, i) => {
      const coincide = c.dataset.valor === (ordenCorrecto[i] || "");
      c.classList.toggle("correcto", coincide);
      c.classList.toggle("incorrecto", !coincide);
    });

    // Si todo está correcto, muestra mensaje
    if (correcto) setTimeout(() => alert("¡Bien hecho! ✅"), 200);
    return correcto;
  };

  // === EVENTOS DE LAS FICHAS ===
  fichas.forEach(ficha => {
    ficha.dataset.usada = ficha.dataset.usada || "0";

    ficha.addEventListener("click", () => {
      // Ignorar si ya está usada
      if (ficha.dataset.usada === "1") return;

      // Si se vuelve a hacer clic en la misma ficha, se deselecciona
      if (fichaSeleccionada === ficha) return deseleccionarFicha();

      // Selecciona la nueva ficha
      deseleccionarFicha();
      ficha.classList.add("seleccionada");
      fichaSeleccionada = ficha;
    });
  });

  // === EVENTOS DE LOS CASILLEROS ===
  casilleros.forEach(casillero => {
    casillero.addEventListener("click", () => {
      // Si hay una ficha seleccionada, la coloca en el casillero
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

      // Si no hay ficha seleccionada, limpiar el casillero
      if (casillero.dataset.valor) asignarValorCasillero(casillero, null);
    });
  });
});
