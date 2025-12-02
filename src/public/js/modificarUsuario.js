function showSpinner() {
  document.getElementById("loadingSpinner").classList.remove("d-none");
}

function hideSpinner() {
  document.getElementById("loadingSpinner").classList.add("d-none");
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

document.addEventListener("DOMContentLoaded", function () {
  modificarContraseña();
  modificarNickname();
});
