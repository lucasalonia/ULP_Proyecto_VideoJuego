function cargarModal() {
  document.querySelectorAll(".select-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgUrl = btn.getAttribute("data-img-url");
      const previewDiv = document.getElementById("profile-preview");

      previewDiv.innerHTML = `
                    <img src="${imgUrl}" 
                    style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                `;

      let hiddenInput = document.getElementById("selected-profile-url");
      if (!hiddenInput) {
        hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.id = "selected-profile-url";
        hiddenInput.name = "selectedProfileURL";
        document.querySelector(".auth-form").appendChild(hiddenInput);
      }

      hiddenInput.value = imgUrl;
    });
  });
}
function limpiarFormularioRegistro() {
  const form = document.querySelector(".auth-form");

  if (form) {
    form.reset();

    const previewDiv = document.getElementById("profile-preview");

    previewDiv.innerHTML = '<span class="initials">PF</span>';

    const hiddenInput = document.getElementById("selected-profile-url");
    if (hiddenInput) {
      hiddenInput.value = "";
    }
  }
}
function showSpinner() {
  document.getElementById("loadingSpinner").classList.remove("d-none");
}

function hideSpinner() {
  document.getElementById("loadingSpinner").classList.add("d-none");
}
function enviarDatosNuevoUsuario() {
  // Configuración de Toastr (Ajustar si es necesario)
  if (typeof toastr !== "undefined") {
    toastr.options = {
      positionClass: "toast-top-center",
      preventDuplicates: true,
      closeButton: true,
      timeOut: "5000",
    };
  }

  const form = document.querySelector(".auth-form");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      showSpinner();

      const nickname = document.querySelector('[name="nickname"]').value;
      const email = document.querySelector('[name="email"]').value;
      const password = document.querySelector('[name="password"]').value;
      const password_confirm = document.querySelector(
        '[name="password_confirm"]'
      ).value;

      const profileUrlInput = document.getElementById("selected-profile-url");
      const selectedProfileURL = profileUrlInput ? profileUrlInput.value : "";

      const datosRegistro = {
        nickname,
        email,
        password,
        selectedProfileURL,
        password_confirm,
      };

      try {
        const respuesta = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosRegistro),
        });

        if (respuesta.ok) {
          const resultado = await respuesta.json();

          if (typeof toastr !== "undefined") {
            toastr.success(
              "Serás redirigido al inicio de sesión.",
              "¡Cuenta creada exitosamente!"
            );
          }

          limpiarFormularioRegistro();
          window.location.href = "/login?registro=exito";
        } else {
          const errorData = await respuesta.json();
          const errorMessage =
            errorData.message || "No se pudo completar el registro.";

          if (typeof toastr !== "undefined") {
            toastr.error(errorMessage, "Error de registro");
          } else {
            alert(`Error: ${errorMessage}`);
          }
        }
      } catch (error) {
        if (typeof toastr !== "undefined") {
          toastr.error(
            "Asegúrate de que el servidor esté en funcionamiento.",
            "Error de conexión"
          );
        } else {
          alert("Hubo un problema de conexión al intentar registrarse.");
        }
      } finally {
        hideSpinner();
      }
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  cargarModal();
  enviarDatosNuevoUsuario();
});
