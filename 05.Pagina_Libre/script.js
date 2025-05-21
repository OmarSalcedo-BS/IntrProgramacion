document.addEventListener('DOMContentLoaded', function() {
    // Modo oscuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeStyle = document.getElementById('darkModeStyle');
    const body = document.body;
    
    // Cargar preferencia
    if (localStorage.getItem('darkMode') === 'enabled') {
        enableDarkMode();
    }
    
    // Alternar modo oscuro
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    function toggleDarkMode() {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    }
    
    function enableDarkMode() {
        body.classList.add('dark-mode');
        darkModeStyle.disabled = false;
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('darkMode', 'enabled');
    }
    
    function disableDarkMode() {
        body.classList.remove('dark-mode');
        darkModeStyle.disabled = true;
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', 'disabled');
    }
    
    // Menú móvil (debes implementar la lógica completa)
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', function() {
        // Lógica para mostrar/ocultar menú en móviles
        console.log('Menú toggle clicked - Implementar lógica');
    });
});