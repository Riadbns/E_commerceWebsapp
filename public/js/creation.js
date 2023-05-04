//Declarations des variables
let form = document.getElementById("formCreation");
let nomUserInserer = document.getElementById("nomUser");
let prenomUserInserer = document.getElementById("prenomUser");
let courrielInserer = document.getElementById("courrielUser");
let passwordInserer = document.getElementById("passwordUser");

let nomUserErreur = document.getElementById("nomError");
let prenomUserErreur = document.getElementById("prenomError");
let courrielUserErreur = document.getElementById("courrielError");
let passwordUserErreur = document.getElementById("passwordError");
let erreurinscription = document.getElementById("erreur");
let adresse = document.getElementById("adresseUser");
let adresseError = document.getElementById("adresseError");
let villeUser = document.getElementById("villeUser");
let villeError = document.getElementById("villeError");
let codePostalUser = document.getElementById("codePostalUser");
let codePostalError = document.getElementById("codePostalError");
let provinceUser = document.getElementById('provinceUser');
let provinceError = document.getElementById("provinceError");



// Validation province utilisateur - formulaire
const validateProvinceUser = () => {
  if (provinceUser.validity.valid) {
    provinceError.style.display = "none";
  } else if (provinceUser.validity.valueMissing) {
    provinceError.innerText = "Erreur Code Postal requis";
    provinceError.style.display = "block";
  }
};
form.addEventListener("submit", validateProvinceUser);

// Validation code postal utilisateur - formulaire
const validateCodePostalUser = () => {
  if (codePostalUser.validity.valid) {
    codePostalError.style.display = "none";
  } else if (codePostalUser.validity.valueMissing) {
    codePostalError.innerText = "Erreur Code Postal requis";
    codePostalError.style.display = "block";
  }
};
form.addEventListener("submit", validateCodePostalUser );

// Validation ville utilisateur - formulaire
const validateVilleUser = () => {
  if (villeUser.validity.valid) {
    villeError.style.display = "none";
  } else if (villeUser.validity.valueMissing) {
    villeError.innerText = "Erreur ville requis";
    villeError.style.display = "block";
  }
};
form.addEventListener("submit", validateVilleUser );

// Validation adresse utilisateur - formulaire
const validateadresseUser = () => {
  if (adresseUser.validity.valid) {
    adresseError.style.display = "none";
  } else if (adresseUser.validity.valueMissing) {
    adresseError.innerText = "Erreur adresse requis";
    adresseError.style.display = "block";
  }
};
form.addEventListener("submit", validateadresseUser);

// Validation nom utilisateur - formulaire
const validateNomUser = () => {
  if (nomUserInserer.validity.valid) {
    nomUserErreur.style.display = "none";
  } else if (nomUserInserer.validity.valueMissing) {
    nomUserErreur.innerText = "Erreur nom requis";
    nomUserErreur.style.display = "block";
  }
};
form.addEventListener("submit", validateNomUser);

// Validation Prenom utilisateur -formulaire
const validatePrenomUser = () => {
  if (prenomUserInserer.validity.valid) {
    prenomUserErreur.style.display = "none";
  } else if (prenomUserInserer.validity.valueMissing) {
    prenomUserErreur.innerText = "Erreur prenom requis";
    prenomUserErreur.style.display = "block";
  }
};
form.addEventListener("submit", validatePrenomUser);

//Validation Courriel utilisateur -formulaire
const validateCourriel = () => {
  if (courrielInserer.validity.valid) {
    courrielUserErreur.style.display = "none";
  } else if (courrielInserer.validity.valueMissing) {
    courrielUserErreur.innerHTML = "Erreur Courriel requis";
    courrielUserErreur.style.display = "block";
  }
};
form.addEventListener("submit", validateCourriel);

//validaton mot de passe utilsateur  -- formulaire

const validatePassword = () => {
  if (passwordInserer.validity.valid) {
    passwordUserErreur.style.display = "none";
  } else if (passwordInserer.validity.valueMissing) {
    passwordUserErreur.innerHTML = "Erreur mot de passe requis";
    passwordUserErreur.style.display = "block";
  }
};

form.addEventListener("submit", validatePassword);



//Soumission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    return;
  }
  let data = {
    nomUser: String(nomUserInserer.value),
    prenomUser: String(prenomUserInserer.value),
    courriel: String(courrielInserer.value),
    password: String(passwordInserer.value),
    adresse:String(adresse.value+", "+villeUser.value+", "+provinceUser.value+", "+codePostalUser.value)
  };
  let response = await fetch("/creation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    window.location.replace("/");
  } else if (response.status === 409) {
    erreurinscription.innerHTML = "utilisateur existe déja";
    erreurinscription.style.display = "block";
  } else {
    erreurinscription.innerHTML = "Erreur inconnue";
    erreurinscription.style.display = "block";
  }
});
