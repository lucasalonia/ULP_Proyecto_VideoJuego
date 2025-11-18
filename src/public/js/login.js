document.addEventListener('DOMContentLoaded', () => {
    console.log("algo");
    
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const mail = loginForm.elements.mail.value;
            const password = loginForm.elements.password.value;
            
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
                // FALLO (ej: 401 Unauthorized)
                const errorData = await response.json();
                alert('Fallo de inicio de sesión: ' + (errorData.message || 'Credenciales inválidas.'));
            }
        });
    }
});