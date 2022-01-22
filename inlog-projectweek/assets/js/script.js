var wachtwoord = document.getElementById("wachtwoord")
var email = document.getElementById("email")
var submit = document.getElementById("submit")
var form = document.getElementById("form")

var melding = document.getElementById("melding");

if (form != null) {
    form.addEventListener('submit', function (event) {
  
      if ((email.value != "") &&
        (wachtwoord.value != "")) {
  

  
        melding.style = "display:flex; backgroundcolor:lightgreen"
        melding.innerHTML = 'inloggen...'
  
      } else {
  
        // event.preventDefault();
  
        melding.style = "display:flex;color:red"
        melding.innerHTML = 'Alles met een ster moet ingevuld zijn!';
      }
    })
  }