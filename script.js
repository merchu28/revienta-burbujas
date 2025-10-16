document.addEventListener('DOMContentLoaded', () => {
    const bubbleArea = document.getElementById('bubble-area');
    const intentosSpan = document.getElementById('intentos-restantes');
    const modal = document.getElementById('modal-resultado');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalMensaje = document.getElementById('modal-mensaje');
    const codigoPremio = document.getElementById('codigo-premio');
    const reiniciarBtn = document.getElementById('reiniciar-juego');
    const closeBtn = document.querySelector('.close-button');

    let intentos = 3;
    let mejorPremio = { valor: 0, mensaje: "¡Qué pena! La próxima será la vencida.", codigo: "EXTRA3" };

    const premios = [
        // Premios (valor para comparación, mensaje de victoria, código de descuento)
        { valor: 20, mensaje: "¡PREMIO MAYOR! Has ganado un 20% de Descuento.", codigo: "BUBBLE20" },
        { valor: 15, mensaje: "¡Excelente! Has ganado un 15% de Descuento.", codigo: "BURBUP15" },
        { valor: 10, mensaje: "¡Genial! Has ganado un 10% de Descuento.", codigo: "SUPER10" },
        { valor: 5, mensaje: "¡Muy bien! Has ganado un 5% de Descuento.", codigo: "POP5" },
        { valor: 0, mensaje: "Sigue intentándolo...", codigo: null } // Burbuja sin premio nuevo
    ];

    // Distribución de probabilidades (para 12 burbujas):
    const asignacionPremios = [
        premios[0], // 20% - 1 burbuja (8%)
        premios[1], premios[1], // 15% - 2 burbujas (16%)
        premios[2], premios[2], premios[2], // 10% - 3 burbujas (25%)
        premios[3], premios[3], premios[3], // 5% - 3 burbujas (25%)
        premios[4], premios[4], premios[4]  // Sin premio - 3 burbujas (25%)
    ];

    // Función para mezclar los premios aleatoriamente
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Función para crear las burbujas
    function crearBurbujas() {
        bubbleArea.innerHTML = '';
        shuffleArray(asignacionPremios);

        asignacionPremios.forEach((premio, index) => {
            const bubble = document.createElement('div');
            bubble.classList.add('bubble');
            bubble.dataset.valor = premio.valor;
            bubble.dataset.mensaje = premio.mensaje;
            bubble.dataset.codigo = premio.codigo || 'SINTENTAR';
            bubble.style.width = bubble.style.height = `${Math.floor(Math.random() * 40) + 60}px`; // Tamaño entre 60px y 100px
            bubble.style.top = `${Math.random() * (bubbleArea.clientHeight - 100)}px`;
            bubble.style.left = `${Math.random() * (bubbleArea.clientWidth - 100)}px`;
            
            // Si quieres que el texto sea visible después de reventar
            // bubble.textContent = premio.valor > 0 ? `${premio.valor}%` : 'X';

            bubble.addEventListener('click', reventarBurbuja);
            bubbleArea.appendChild(bubble);
        });
    }

    // Función que maneja el click en la burbuja
    function reventarBurbuja(event) {
        if (intentos <= 0) return;

        const burbuja = event.target;
        const valor = parseInt(burbuja.dataset.valor);
        const codigo = burbuja.dataset.codigo;
        
        // 1. Marcar como reventada y animar
        burbuja.classList.add('popped');
        
        // Opcional: Mostrar temporalmente el premio dentro de la burbuja
        burbuja.style.fontSize = '1.2em';
        burbuja.textContent = valor > 0 ? `${valor}%` : 'X'; 
        
        // 2. Actualizar el mejor premio
        if (valor > mejorPremio.valor) {
            mejorPremio.valor = valor;
            mejorPremio.mensaje = burbuja.dataset.mensaje;
            mejorPremio.codigo = codigo;
        }

        // 3. Restar intento
        intentos--;
        intentosSpan.textContent = intentos;

        // 4. Finalizar el juego si no quedan intentos
        if (intentos === 0) {
            setTimeout(mostrarResultadoFinal, 500); // Pequeño retraso para ver la última explosión
        }
    }

    // Función para mostrar el resultado final
    function mostrarResultadoFinal() {
        modalTitulo.textContent = mejorPremio.valor > 0 ? "¡FELICIDADES, HAS GANADO!" : "¡Gracias por participar!";
        modalMensaje.innerHTML = mejorPremio.mensaje;
        codigoPremio.textContent = mejorPremio.codigo;
        
        // Ocultar el código si no ganó un premio significativo
        document.getElementById('premio-info').style.display = (mejorPremio.valor > 0 || mejorPremio.codigo !== 'EXTRA3') ? 'block' : 'none';

        modal.style.display = 'block';
    }
    
    // Función para reiniciar el juego
    function reiniciarJuego() {
        intentos = 3;
        intentosSpan.textContent = intentos;
        mejorPremio = { valor: 0, mensaje: "¡Qué pena! La próxima será la vencida.", codigo: "EXTRA3" };
        modal.style.display = 'none';
        crearBurbujas();
    }
    
    // Eventos del modal
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    reiniciarBtn.addEventListener('click', reiniciarJuego);

    // Iniciar el juego
    crearBurbujas();
});
