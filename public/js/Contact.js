let form = document.getElementById("formCreation");

let nomUser = document.getElementById("nomUser");
let courrielUser = document.getElementById("courrielUser");
let messageUser = document.getElementById("messageUser");

let nomError = document.getElementById("nomError");
let courrielError = document.getElementById("courrielError");
let messageError = document.getElementById("messageError");

let messageSucces = document.getElementById("zoneSucces");
//  Validation nom - formulaire
const validateNom = () => {
  console.log("ana" + nomUser.value)
  if (nomUser.value<1) {
    nomError.innerText = "Erreur champs requis";
    nomError.style.display = "flex";
    return false
  }
  else {
    nomError.style.display = "none";
    return true
  } 
};
form.addEventListener("submit",validateNom);


//  Validation message - formulaire
const validatemessage = () => {
  if (messageUser.value<20) {
    messageError.innerText = "Erreur la longeur doit etre > 20";
    messageError.style.display = "flex";
    return false
  }
  if (messageUser.validity.valid) {
    messageError.style.display = "none";
    return true
  } 
  
};
form.addEventListener("submit",validatemessage);

//Validation Courriel utilisateur -formulaire
const validateCourriel = () => {
  if (courrielUser.value<1) {
    courrielError.innerHTML = "Erreur Courriel requis";
    courrielError.style.display = "flex";
    return false
  }
  if (courrielUser.validity.valid) {
    courrielError.style.display = "none";
    return true
  } 
   
};
form.addEventListener("submit",validateCourriel);

form.addEventListener("submit", async (event) => {
     event.preventDefault();
    console.log(validateNom() && validateCourriel() && validatemessage());

   if(validateNom() && validateCourriel() && validatemessage()){
    let data = {
      nom : String(nomUser.value),
      courriel : String(courrielUser.value),
      messageUser : String (messageUser.value)
    }
   
    messageSucces.style.display="flex"
    setTimeout(() => {
      messageSucces.style.transition = "all 1s ease-out"; // Add a transition effect to slow down the animation
      messageSucces.style.opacity = "0"; // Change the opacity to 0 to fade out the element
      setTimeout(() => {
        messageSucces.style.display = "none"; // Hide the element after the fade out animation is finished
      }, 1000); // Delay time for hiding the element
    },3000); // Delay time for the slow motion effect
    
      
    form.reset();
    let response = await fetch("/Contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
   }
      
});



