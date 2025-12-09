function showSpinner() {
  document.getElementById("loadingSpinner").classList.remove("d-none");
}

function hideSpinner() {
  document.getElementById("loadingSpinner").classList.add("d-none");
}

function recoverPassword() {

  if (typeof toastr !== "undefined") {
    toastr.options = {
      positionClass: "toast-top-center",
      preventDuplicates: true,
      closeButton: true,
      timeOut: "5000",
    };
  }
const form = document.querySelector(".auth-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showSpinner();

    const mail = form.email.value.trim();
    if (!mail) {
      toastr.error("Ingresá un correo válido");
      return;
    }

    try {
      const response = await fetch("/api/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mail }),
      });

      const data = await response.json();

      if (response.ok) {
        toastr.success(data.message || "Correo enviado correctamente");
        form.reset();
      } else {
        toastr.error(data.message || "Error al enviar el correo");
      }
    } catch (error) {
      toastr.error("No se pudo conectar con el servidor");
      console.error(error);
    } finally {
      hideSpinner();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
    recoverPassword();
});
