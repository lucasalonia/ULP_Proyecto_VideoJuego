const TRANSITION_DURATION = 500; 
const spinner = document.getElementById("loadingSpinnerLog");

function showSpinner() {
  
    spinner.classList.remove("d-none");
    
    
    setTimeout(() => {
       
        spinner.classList.add("fade-in");
    }, 10);
}

function hideSpinner() {
   
    spinner.classList.remove("fade-in");
    
    
    setTimeout(() => {
        spinner.classList.add("d-none");
    }, TRANSITION_DURATION);
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
