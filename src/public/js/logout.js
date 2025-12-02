document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (e) => {
            e.preventDefault(); 

            const response = await fetch(`/api/logout`, {
                method: 'DELETE', 
            });

            if (response.ok) {
                window.location.href = '/login'; 
            } else {
                console.error("Fallo al cerrar sesión en el servidor.");
                window.location.href = '/login'; 
            }
        });
    }
});