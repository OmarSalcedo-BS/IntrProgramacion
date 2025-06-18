function loadList() {
    let lista = JSON.parse(localStorage.getItem("lista")) || [];
    let participantes = document.getElementById("participantes");
    participantes.innerHTML;
    lista.forEach(lista => {
        let listaParticipantes = document.createElement("li");
        listaParticipantes.innerHTML = `<strong>${lista.tipoDocumento}</strong> - ${lista.numeroDocumento} - <strong>${lista.nombres}</strong> - <em>${lista.correo}</em>`;
        participantes.appendChild(listaParticipantes);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  
    document.getElementById("registroJugadores").addEventListener("submit", function (event) {
        event.preventDefault();
        let tipoDocumento = document.getElementById("tipoDeDocumento").value;
        let numeroDocumento = document.getElementById("numeroDocumento").value;
        let nombres = document.getElementById("nombres").value;
        let correo = document.getElementById("correo").value;
        let participantes = document.getElementById("participantes");
        
        if (nombres.trim() =='' || correo.trim() =='' || numeroDocumento.trim() =='' ) {
          alert("Los campos no pueden estar vacíos")    
        } else if (tipoDocumento != "TI" && tipoDocumento != "" ) {
        let listaParticipantes = document.createElement("li");
        listaParticipantes.innerHTML = `<strong>${tipoDocumento}</strong> - ${numeroDocumento} - <strong>${nombres}</strong> - <em>${correo}</em>`;

        participantes.appendChild(listaParticipantes);
        let lista = JSON.parse(localStorage.getItem("lista")) || [];
        lista.push({ tipoDocumento: tipoDocumento, numeroDocumento: numeroDocumento, nombres: nombres, correo: correo});
        localStorage.setItem("lista", JSON.stringify(lista));

        document.getElementById("tipoDocumento").value = "";
        document.getElementById("numeroDocumento").value = "";  
        document.getElementById("nombres").value = "";
        document.getElementById("correo").value = "";
    } else {
        alert("No puedes participar")
    }
    });

     loadList();
})

function menorEdad(event) {
    if (event.target.value == "TI") {
      alert("Para participar debes ser mayor de edad, no podras registrarte.")
        
    }
    
}
