// =====================================================================
//   SPINNER
// =====================================================================

function showSpinner() {
  document.getElementById("loadingSpinner").classList.remove("d-none");
}

function hideSpinner() {
  document.getElementById("loadingSpinner").classList.add("d-none");
}





// =====================================================================
//   CARGAR TIEMPOS
// =====================================================================

function cargarTiempos(tiempos = []) {
  const cont = document.getElementById("listaTiempos");
  cont.innerHTML = "";

  if (!tiempos.length) {
    cont.innerHTML = `<li class="item-logro text-muted">Sin tiempos registrados</li>`;
    return;
  }

  tiempos.forEach((t) => {
    const li = document.createElement("li");
    li.className = "paraje-item d-flex  align-items-center";

    li.innerHTML = `
       <div class="icono-reloj">
        <img src="/img/reloj.png">
      </div>
       <div class="nombre-paraje"> ${t.tiempoFormateado}</div>
    `;

    cont.appendChild(li);
  });
}

// =====================================================================
//   CARGAR PARAJES LOGRADOS
// =====================================================================
function cargarParajes(parajes = []) {
  const cont = document.getElementById("listaParajes");
  cont.innerHTML = "";

  if (!parajes.length) {
    cont.innerHTML = `
      <div class="paraje-item">
        <div class="nombre-paraje">No desbloqueaste logros aún.</div>
      </div>`;
    return;
  }

  parajes.forEach((p) => {
    const item = document.createElement("div");
    item.className = "paraje-item";

    item.innerHTML = `
      <div class="icono-trofeo">
        <img src="/img/trofeo1.png">
      </div>

      <div class="nombre-paraje">${p}</div>
    `;

    cont.appendChild(item);
  });
}

function modificarContraseña() {
  // Configuración de Toastr (igual que en tu otro método)
  if (typeof toastr !== "undefined") {
    toastr.options = {
      positionClass: "toast-top-center",
      preventDuplicates: true,
      closeButton: true,
      timeOut: "4000",
    };
  }

  const btnGuardar = document.getElementById("guardarPassword");
  if (!btnGuardar) return;

  btnGuardar.addEventListener("click", async () => {
    const actualPassword = document.getElementById("currentPassword").value;

    const nuevaPassword = document.getElementById("newPassword").value;
    const repetirPassword = document.getElementById("confirmPassword").value;

    const payload = {
      currentPassword: actualPassword,
      newPassword: nuevaPassword,
      repetirPassword: repetirPassword,
    };
    showSpinner();

    try {
      const respuesta = await fetch("/perfil/modificar-contrasenia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await respuesta.json();
      } catch (e) {
        console.error("Error al parsear la respuesta JSON:", e);
      }

      if (respuesta.ok) {
        toastr.success("La contraseña fue cambiada correctamente.", "¡Éxito!");

        setTimeout(() => location.reload(), 1200);
      } else {
        const errorMsg = data.message || "No se pudo cambiar la contraseña.";
        toastr.error(errorMsg, "Error");
      }
    } catch (error) {
      toastr.error(
        "Verificá que el servidor esté funcionando.",
        "Error de conexión"
      );
    } finally {
      hideSpinner();
    }
  });
}

function modificarNickname() {
  if (typeof toastr !== "undefined") {
    toastr.options = {
      positionClass: "toast-top-center",
      preventDuplicates: true,
      closeButton: true,
      timeOut: "4000",
    };
  }

  const btnGuardar = document.getElementById("guardarNickname");
  if (!btnGuardar) return;

  btnGuardar.addEventListener("click", async () => {
    const nuevoNickname = document.getElementById("newNickname").value;
    const actualPasword = document.getElementById("actualPasword").value;

    const payload = {
      nickname: nuevoNickname,
      currentPassword: actualPasword,
    };
    showSpinner();
    try {
      const respuesta = await fetch("/perfil/modificar-nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data = {};
      try {
        data = await respuesta.json();
      } catch (e) {
        console.error("Error al parsear la respuesta JSON:", e);
      }
      if (respuesta.ok) {
        toastr.success("El nickname fue cambiado correctamente.", "¡Éxito!");
        setTimeout(() => location.reload(), 1200);
      } else {
        const errorMsg = data.message || "No se pudo cambiar el nickname.";
        toastr.error(errorMsg, "Error");
      }
    } catch (error) {
      toastr.error(
        "Verificá que el servidor esté funcionando.",
        "Error de conexión"
      );
    } finally {
      hideSpinner();
    }
  });
}

function modificarFoto() {
  if (typeof toastr !== "undefined") {
    toastr.options = {
      positionClass: "toast-top-center",
      preventDuplicates: true,
      closeButton: true,
      timeOut: "4000",
    };
  }
  const opcionesFoto = document.querySelectorAll(".photo-option");

  if (!opcionesFoto.length) return;

  opcionesFoto.forEach((opcion) => {
    opcion.addEventListener("click", async () => {
      const nuevaFotoUrl = opcion.getAttribute("data-img-url");

      if (!nuevaFotoUrl) return;

      const payload = { fotoUrl: nuevaFotoUrl };

      showSpinner();

      try {
        const respuesta = await fetch("/perfil/modificar-foto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        let data = {};
        try {
          data = await respuesta.json();
        } catch (err) {
          console.error("Error parseando JSON:", err);
        }

        if (respuesta.ok) {
          toastr.success("¡Foto actualizada correctamente!", "Éxito");
          setTimeout(() => location.reload(), 1200);
        } else {
          const errorMsg = data.message || "No se pudo cambiar la foto.";
          toastr.error(errorMsg, "Error");
        }
      } catch (error) {
        toastr.error(
          "Asegurate que el servidor esté encendido.",
          "Error de conexión"
        );
      } finally {
        hideSpinner();
      }
    });
  });
}


document.addEventListener("DOMContentLoaded", async () => {
  // 1. Inicializamos los botones de los modales primero
  modificarContraseña();
  modificarNickname();
  modificarFoto();

  // 2. Cargamos los datos del servidor
  showSpinner();
  try {
    const res = await fetch("/logros/perfil/ultimos");
    if (res.ok) {
      const data = await res.json();
      cargarTiempos(data.tiempo ? [data.tiempo] : []);
      cargarParajes(data.parajesCompletados);
    }
  } catch (e) {
    console.error("Error al cargar datos:", e);
  } finally {

    hideSpinner();
  }
});