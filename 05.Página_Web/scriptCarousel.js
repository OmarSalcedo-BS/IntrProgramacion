document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('carouselExample');
    const carouselInner = carousel.querySelector('.carousel-inner');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const prevButton = carousel.querySelector('.carousel-control-prev');
    const nextButton = carousel.querySelector('.carousel-control-next');

    let currentIndex = 0;
    const totalItems = carouselItems.length;

    // Función para mostrar el elemento actual
    function showItem(index) {
        // Oculta todos los elementos
        carouselItems.forEach((item, i) => {
            item.classList.remove('active');
            // Si quieres una transición de slide más que de fade, podrías usar transform
            // item.style.transform = `translateX(${-(index * 100)}%)`;
        });
        // Muestra el elemento activo
        carouselItems[index].classList.add('active');
    }

    // Inicializa el carrusel mostrando el primer elemento
    showItem(currentIndex);

    // Event listener para el botón "Previous"
    prevButton.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        showItem(currentIndex);
    });

    // Event listener para el botón "Next"
    nextButton.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % totalItems;
        showItem(currentIndex);
    });

    })
    