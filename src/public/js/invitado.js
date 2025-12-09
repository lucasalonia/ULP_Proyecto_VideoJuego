function showSpinner() {
  document.getElementById("loadingSpinner").classList.remove("d-none");
}

function hideSpinner() {
  document.getElementById("loadingSpinner").classList.add("d-none");
}

function ingresarComoInvitado() {
  if (typeof toastr !== "undefined") {
    toastr.options = {
      positionClass: "toast-top-center",
      preventDuplicates: true,
      closeButton: true,
      timeOut: "5000",
    };
  }

  const form = document.querySelector(".auth-form");

  const enviarInvitado = async (e) => {
    e.preventDefault();
    showSpinner();
    
    const nickname = form.elements["nickname"].value.trim();
    
    if (!nickname) {
        toastr.error("Debes ingresar un nickname.", "Error de Validación");
        hideSpinner();
        return;
    }
    
    try {
      const response = await fetch("/api/guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();

      if (response.ok) {
        toastr.success(
          data.message || "Ingresando como invitado...",
          "¡Bienvenido!"
        );

        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        toastr.error(
          data.message || "No se pudo ingresar como invitado.",
          "Error"
        );
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toastr.error("Ocurrió un error de conexión.", "Error del Sistema");
    } finally {
      hideSpinner();
    }
  };

  if (form) {
    form.addEventListener("submit", enviarInvitado);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ingresarComoInvitado();
});
