document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }
});

document.getElementById("darkModeToggle").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que el enlace recargue la página
    document.body.classList.toggle("dark-mode");

    // Guardar la preferencia del usuario
    let modoOscuroActivo = document.body.classList.contains("dark-mode");
    localStorage.setItem("modoOscuro", modoOscuroActivo);
});

// Mantener la preferencia al recargar la página
if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("dark-mode");
}
