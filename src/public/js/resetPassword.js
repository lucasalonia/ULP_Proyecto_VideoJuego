function showSpinner() {
  document.getElementById("loadingSpinner").classList.remove("d-none");
}

function hideSpinner() {
  document.getElementById("loadingSpinner").classList.add("d-none");
}

function resetPassword() {
    if (typeof toastr !== "undefined") {
    toastr.options = {
      positionClass: "toast-top-center",
      preventDuplicates: true,
      closeButton: true,
      timeOut: "5000",
    };
  }
    const form = document.getElementById('resetPasswordForm');
    
    const resetPassword = async (e) => {
        e.preventDefault(); 
        showSpinner();

        const token = form.elements['token'].value;
        const newPassword = form.elements['password'].value;
        const passwordConfirm = form.elements['password_confirm'].value;

        // 1. VALIDACIÓN BÁSICA DE CAMPOS
        if (!newPassword || !passwordConfirm || !token) {
            toastr.error("Todos los campos son obligatorios.", "Error de Validación");
            return;
        }

        if (newPassword !== passwordConfirm) {
            toastr.error("Las contraseñas no coinciden.", "Error de Validación");
            return;
        }
        

        // 2. REALIZAR EL FETCH A LA RUTA POST
        try {
            const response = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // ÉXITO: Contraseña cambiada
                toastr.success(data.message || "Contraseña restablecida con éxito.", "¡Listo!");
                // Redirigir al usuario al login después de un breve retraso
               
                    window.location.href = '/login'; 
               
            } else {
                // ERROR: Token inválido, vencido, o error del servidor
                toastr.error(data.message || "No se pudo restablecer la contraseña. Intente nuevamente.", "Error");
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            toastr.error("Ocurrió un error de conexión.", "Error del Sistema");
        } finally {
            hideSpinner();
        }
    };

    // Asignar el listener al formulario
    if (form) {
        form.addEventListener('submit', resetPassword);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    resetPassword();
});