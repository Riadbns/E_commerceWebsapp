
/** Élément HTML du bouton pour inscrire a une activitie. */

let inscrireActivities = document.querySelectorAll("#inscireActivitie");
//Fonction qui inscrit l'utilisateur au cour
const inscrireActivitie = (id,nb_produit) => {
  // Listeners pour le clic pour inscrire a une activitie
  let data = {
    id_produit: id,
    nb_produit:nb_produit+1
  };
  fetch(`/activitie`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  location.reload();
};
inscrireActivities.forEach((activitie) => {
  activitie.addEventListener("click", (event) => {
    inscrireActivitie(event.currentTarget.dataset.id,event.currentTarget.dataset.nb_produit);
  });
});


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


