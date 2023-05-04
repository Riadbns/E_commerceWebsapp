//Declaration des variables
let nomActivitieInserer = document.getElementById("nomActivitie");
let descriptionActivitieInserer = document.getElementById(
  "descriptionActivitie"
);
let categorieInserer = document.getElementById("categorieInsert");
let capaciteActivitieInserer = document.getElementById("capaciteActivitie");
let nbrActivitie = document.getElementById("nbrActivitie");
let dateActivitie = document.getElementById("dateActivitie");
let form = document.getElementById("formActivitie");
let nomErreur = document.getElementById("nomError");
let descriptionErreur = document.getElementById("descriptionError");
let capaciteErreur = document.getElementById("capaciteError");
let nbrActiviteErreur = document.getElementById("nbrActiviteError");
let dateErreur = document.getElementById("dateError");

const imageInput = document.getElementById('imageUpload');
const imageError = document.getElementById('imageError');

/** Élément HTML du bouton pour supprimer une activitie . */
let supprimerActivities = document.querySelectorAll("#supprimerActivitie");

//Fonction qui supprime Activitie dans le serveur
const suprimmerActivitie = (id) => {
  // Listeners pour le clic pour inscrire a une activitie
  let data = {
    id_produit: parseInt(id),
  };
  fetch(`/admin`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

supprimerActivities.forEach((activitie) => {
  activitie.addEventListener("click", (event) => {
    suprimmerActivitie(event.currentTarget.dataset.id);
    location.reload();
  });
});
//*****************************Validation du formulaire************************ */
//  Validation nom - formulaire
const validateNom = () => {
  if(nomActivitieInserer.value==="") {
    nomErreur.innerText = "Erreur champs requis";
    nomErreur.style.display = "block";
    return false
  }if (nomActivitieInserer.validity.valid) {
    nomErreur.style.display = "none";
    return true
  } 
};
form.addEventListener("submit", validateNom);

// Validation description -formulaire
const validateDescription = () => {
   if (descriptionActivitieInserer.validity.valueMissing) {
    descriptionErreur.innerText = "Erreur champs requis";
    descriptionErreur.style.display = "block";
    return false
  }
  if (descriptionActivitieInserer.value.length<10) {
    descriptionErreur.innerText = "Erreur la longeur doit etre > 10";
    descriptionErreur.style.display = "block";
    return false
  }
 
  if (descriptionActivitieInserer.validity.valid) {
    descriptionErreur.style.display = "none";
    return true
  } 
   if (descriptionActivitieInserer.validity.valueMissing) {
    descriptionErreur.innerText = "Erreur champs requis";
    descriptionErreur.style.display = "block";
    return false
  }
};

form.addEventListener("submit", validateDescription);

//Validation quantite -formulaire
const validateCapacite = () => {
  if (capaciteActivitieInserer.value==="" ) {
    capaciteErreur.innerText = "Erreur champs requis";
    capaciteErreur.style.display = "block";
    return false
  } if (capaciteActivitieInserer.value<1 ) {
    capaciteErreur.innerText = "doit être supérieure à 0";
    capaciteErreur.style.display = "block";
    return false
  }
  if (capaciteActivitieInserer.validity.valid) {
    capaciteErreur.style.display = "none";
    return true
  }
   
   
};

form.addEventListener("submit", validateCapacite);
//Validation prix -formulaire
const validateNombreActivite = () => {
  if (nbrActivitie.value==="" ) {
    nbrActiviteErreur.innerText = "Erreur champs requis";
    nbrActiviteErreur.style.display = "block";
    return false
  }
   if (nbrActivitie.value<1 ) {
    nbrActiviteErreur.innerText = "doit être supérieure à 0";
    nbrActiviteErreur.style.display = "block";
    return false
  } 
  if (nbrActivitie.value>0) {
    nbrActiviteErreur.style.display = "none";
    return true
  }
  
};
form.addEventListener("submit", validateNombreActivite);

const validateImage=()=>{
  const file = imageInput.files[0];
  const fileType = file ? file.type.split('/')[0] : null;

  if (!file) {
    // no image selected
    imageError.style.display="flex";
    imageError.textContent = 'Veuillez sélectionner un fichier image.';
    return false;
  } else if (fileType !== 'image') {
    // invalid file type
    imageError.style.display="flex";
    imageError.textContent = 'Veuillez sélectionner un fichier image valide.';
    imageInput.value = ''; // clear the input
    return false;
  } else {
    // valid image file
    imageError.style.display="none";
    imageError.textContent = '';
    return true
  }
}
form.addEventListener("submit", validateImage);


const validateALL=()=>{
 return validateImage() && validateNom() &&  validateCapacite() &&  validateDescription() && validateNombreActivite();
}

//*********************Fonction Ajouter Activite coté serveur */

const AjouterActivitie = (event) => {
  console.log(Number(nbrActivitie.value));
  event.preventDefault();
  if (validateALL()){
    const imageFile = imageUpload.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = () => {
      
    let data = {
      nom: String(nomActivitieInserer.value),
      prix: Number(nbrActivitie.value),
      quantite: Number(capaciteActivitieInserer.value),
      description: String(descriptionActivitieInserer.value),
      categorie: String(categorieInserer.value),
      image: reader.result,
    };
    fetch(`/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    nomActivitieInserer.value = "";
    nbrActivitie.value = "";
    capaciteActivitieInserer.value = "";
    descriptionActivitieInserer.value = "";
    imageInput.value = ''; 
  }
 } 
};
 
form.addEventListener("submit", AjouterActivitie);

/***********************************Partie temps réel - Administrateur**************************** */
let source = new EventSource("/stream");
//1- Ajout d'une activite en temps rée;
source.addEventListener("add-Activitie", (event) => {
  let data = JSON.parse(event.data);
  
  form.addEventListener(
    "submit",
    AjouterActivitiesu(
      data.nom,
      data.description,
      data.quantite,
      data.prix,
      data.id_produit,
      categorieInserer.value
    )
  );
});
//2- La suppression d'une activite  en temps réel
source.addEventListener("sup-CoursM", (event) => {
  let data = JSON.parse(event.data);
  //Recuperer le input pour lequel on veut supprimer son parent
  let inputsupprimer = document.querySelector(
    `input[data-id="${data.id_produit}"]`
  );
  //Supprimer le div (parent)du inputsupprimer
  inputsupprimer.parentElement.remove();
});

//3- Ajout d'un utilisateur inscrit dans un cour en temps réel
source.addEventListener("add-CoursUser", (event) => {
  let data = JSON.parse(event.data);
  //Recuperation de div ou on va inserer le user, on récuperant le id de inputsupprimer
  let inputsupprimer = document.querySelector(
    `input[data-id="${data.id_produit}"]`
  );
  let div = inputsupprimer.parentElement;

  //Creation du p qui va contenir les information de utilisateur

  let userElement = document.createElement("p");
  //Ajouter un id
  userElement.setAttribute("id", "nomUser");
  userElement.setAttribute("data-id", `${data.id_user}`);
  userElement.innerHTML = `<span> * </span>${data.nom} ${data.prenom}`;
  //Insertion de utilisateur ajouter avant le bouton supprimer
  div.insertBefore(userElement, div.lastElementChild);
});

//4- Supression d'un utilisateur lors de desabonnement

source.addEventListener("desabonner-CourUser", (event) => {
  let data = JSON.parse(event.data);

  let inputsupprimer = document.querySelector(
    `input[data-id="${data.id_produit}"]`
  );
  //Récuper le div en question
  let div = inputsupprimer.parentElement;

  let p = div.querySelector(`p[data-id="${data.id_user}"]`);
  //Supprimer l'utilisateur qui a desabonner
  div.removeChild(p);
});

//La fonction qui ajoute une activite cote client en temps réel
const AjouterActivitiesu = (nom, description, quantite, prix, id_produit,categorie) => {
  //Pour Ajouter une activité il faut ajouter un div a la page
  let div = document.createElement("div");
  div.className = "card";

  // Ajout du nom de l'activite
  let nomElement = document.createElement("h2");
  //Attribuer un id
  nomElement.setAttribute("id", "activitie");
  nomElement.innerText = nom;
  div.appendChild(nomElement);

  // Ajout de la description de l'activite
  let descElement = document.createElement("p");
  descElement.setAttribute("id", "description");
  descElement.innerHTML = `<span>discription: </span> ${description}`;
  div.appendChild(descElement);

  let catgElement = document.createElement("p");
  catgElement.setAttribute("id", "categorie");
  catgElement.setAttribute("class", "categorie");
  catgElement.innerHTML = `<span>categorie: </span> ${categorie}`;
  div.appendChild(catgElement);

  // Ajout de la capacité de l'activite
  let capacElement = document.createElement("p");
  capacElement.setAttribute("id", "capacite");
  capacElement.innerHTML = `<span>quantite: </span> ${quantite}`;
  div.appendChild(capacElement);

  // Ajout du nombre de cours de l'activite
  let nbrCoursElement = document.createElement("p");
  nbrCoursElement.setAttribute("id", "nbCours");
  nbrCoursElement.innerHTML = `<span> prix: </span> ${prix}$`;
  div.appendChild(nbrCoursElement);

  // Ajout du nombre inscrit de l'activite
  let nbreInscritElement = document.createElement("p");
  nbreInscritElement.setAttribute("id", "nbreInscrit");
  nbreInscritElement.innerHTML = `<span> Acheté par : </span>`;
  div.appendChild(nbreInscritElement);

  // Ajout des nom des utilisateurs iscrit de l'activite
  let userElement = document.createElement("select");
  userElement.size = 5;
  div.appendChild(userElement);

  // Ajout du input de l'activite
  let submitElement = document.createElement("input");
  submitElement.setAttribute("id", "supprimerActivitie");
  submitElement.setAttribute("type", "submit");
  submitElement.setAttribute("data-id", id_produit);
  submitElement.setAttribute("value", "Supprimer");
  div.appendChild(submitElement);

  let maindiv = document.getElementById("wrapper");

  maindiv.appendChild(div);
  submitElement.addEventListener("click", (event) => {
    suprimmerActivitie(event.currentTarget.dataset.id);
  });
};


function search_animal() {
  let input = document.getElementById("searchbar").value.toLowerCase();
  const selectedOption = document.getElementById('searchbar2').value.toLowerCase();

  let x = document.getElementsByClassName("nomsearch");
  let y = document.getElementsByClassName("categorie");
  let divProduit = document.getElementsByClassName("divproduit");

  for (let i = 0; i < divProduit.length; i++) {
    if (
      (selectedOption === "categorie" || y[i].innerHTML.toLowerCase().includes(selectedOption)) &&
      x[i].innerHTML.toLowerCase().includes(input)
    ) {
      divProduit[i].style.display = "flex";
    } else {
      divProduit[i].style.display = "none";
    }
  }
}

document.getElementById("searchbar").addEventListener("keyup", search_animal);
document.getElementById('searchbar2').addEventListener("change", search_animal);


