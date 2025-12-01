function showSpinner() {
    document.getElementById("loadingSpinner").classList.remove("d-none");
}

function hideSpinner() {
    document.getElementById("loadingSpinner").classList.add("d-none");
}
function login(){
    if (typeof toastr !== 'undefined') {
        toastr.options = {
            "positionClass": "toast-top-center",
            "preventDuplicates": true,
            "closeButton": true
        };
    }

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            showSpinner();
            //Para probar el spinner
            //  await new Promise(resolve => setTimeout(resolve, 2000));
            const mail = loginForm.elements.mail.value;
            const password = loginForm.elements.password.value;
            
            try {
                const response = await fetch(`/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ mail, password })
                });

                if (response.ok) {
                    window.location.href = '/'; 
                } else {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || 'Credenciales inválidas.';
                    
                    if (typeof toastr !== 'undefined') {
                        toastr.error(errorMessage, 'Fallo de inicio de sesión');
                    } else {
                        alert('Fallo de inicio de sesión: ' + errorMessage);
                    }
                }
            } catch (error) {
                const errorMessage = 'Error de conexión. Asegúrate de que el servidor esté en funcionamiento.';
                
                if (typeof toastr !== 'undefined') {
                    toastr.error(errorMessage, 'Error de red');
                } else {
                    alert(errorMessage);
                }
            }finally {
                hideSpinner();
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    login();
});