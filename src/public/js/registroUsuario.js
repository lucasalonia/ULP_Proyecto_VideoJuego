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
   
    const form = document.querySelector('.auth-form');

    if (form) {
     
        form.reset(); 

      
        const previewDiv = document.getElementById('profile-preview');
     
        previewDiv.innerHTML = '<span class="initials">PF</span>'; 
        
   
        const hiddenInput = document.getElementById('selected-profile-url');
        if (hiddenInput) {
            hiddenInput.value = '';
        }
    }
}
function enviarDatosNuevoUsuario() {
  const form = document.querySelector(".auth-form");

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const nickname = document.querySelector('[name="nickname"]').value;
      const email = document.querySelector('[name="email"]').value;
      const password = document.querySelector('[name="password"]').value;

      const profileUrlInput = document.getElementById("selected-profile-url");
      const selectedProfileURL = profileUrlInput ? profileUrlInput.value : "";

      const datosRegistro = {
        nickname,
        email,
        password,
        selectedProfileURL,
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
          console.log(" Registro Exitoso:", resultado);
          alert("¡Cuenta creada exitosamente!");
          limpiarFormularioRegistro();
          window.location.href = '/login';
        } 
        else {
          const errorData = await respuesta.json();
          console.error(" Error en el registro:", errorData);
          alert(
            `Error: ${errorData.message || "No se pudo completar el registro."}`
          );
          limpiarFormularioRegistro();
        }
      } catch (error) {
        console.error(" Error de red o en la solicitud:", error);
        alert("Hubo un problema de conexión al intentar registrarse.");
      }
    });
  } else {
    console.error("No se encontró el formulario '.auth-form'.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarModal();
  enviarDatosNuevoUsuario();
});
