
/** Élément HTML du bouton pour désinscrire d'une activitie . */
let desinscrireActivities = document.querySelectorAll("#desinscireActivitie");
let Payer = document.getElementById('checkout');
var priceElement = document.getElementById("price");
var priceText = priceElement.textContent || priceElement.innerText;
var priceNumber = parseFloat(priceText);
const items = [];

const cards = document.querySelectorAll('.bodyofcart');

cards.forEach(card => {
  const quantity = card.querySelector('#nbCours').textContent;
  const nom = card.querySelector('#activitie').textContent;
  const prix = card.querySelector('#nbreInscrit').textContent;

  items.push({ quantity, nom, prix });
});



Payer.addEventListener('click', ()=>{

  fetch("/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
     
    body: JSON.stringify({
      items: items
    }),
   
  })
    .then(res  => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      
      window.location = url
      
    })
    .catch(e => {
      console.error(e.error)
    })

});

const desinscrireActivitie = (id) => {
  // Listeners pour le clic pour désinscrire a une activitie
  let data = {
    id_produit: parseInt(id),
  };
  fetch(`/compte`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};
desinscrireActivities.forEach((activitie) => {
  activitie.addEventListener("click", (event) => {
    desinscrireActivitie(event.currentTarget.dataset.id);
    location.reload();
  });
});

let addquantite = document.querySelectorAll("#addquantite");
//Fonction qui inscrit l'utilisateur au cour
const addquantites = (id,nb_produit) => {
  // Listeners pour le clic pour inscrire a une activitie
  let data = {
    id_produit: id,
    nb_produit:Number(nb_produit)+1
  };
  fetch(`/compte`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  location.reload();
};
addquantite.forEach((activitie) => {
  activitie.addEventListener("click", (event) => {
    console.log(event.currentTarget.dataset.nb_produit+"  "+event.currentTarget.dataset.nb_produit)
    addquantites(event.currentTarget.dataset.id,event.currentTarget.dataset.nb_produit);
  });
});

let decrisequantite = document.querySelectorAll("#decrisequantite");

//Fonction qui inscrit l'utilisateur au cour
const decrisequantites = (id,nb_produit) => {
  // Listeners pour le clic pour inscrire a une activitie
  let data = {
    id_produit: id,
    nb_produit:Number(nb_produit)-1
  };
  fetch(`/compte`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  location.reload();
};
decrisequantite.forEach((activitie) => {
  activitie.addEventListener("click", (event) => {
    console.log(event.currentTarget.dataset.nb_produit+"  "+event.currentTarget.dataset.nb_produit)
    decrisequantites(event.currentTarget.dataset.id,event.currentTarget.dataset.nb_produit);
  });
});


