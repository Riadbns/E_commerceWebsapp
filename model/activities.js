import connectionPromise from "./connexion.js";
//*************PAGE DE VISUALISATION *********** */

//Lister toute les activiities qui existe
export async function getActivities() {
  try {
    let connexion = await connectionPromise;
    let resultat = await connexion.all(
      "SELECT * FROM produit  order by id_produit"
    );

    return resultat.map((activity) => {
      // convert image buffer to base64 string
      const base64Image = Buffer.from(activity.image).toString("base64");
      // return activity with base64 encoded image string
      return {
        ...activity,
        image: base64Image,
      };
    });
  } catch (error) {
    console.log(error);
  }
}

//Acheter un produit

export async function sinscrireCours(id_produit, courriel, nb_produit) {
  try {
    let connexion = await connectionPromise;

    let resultat = await connexion.run(
      ` insert into panier_utilisateur(id_produit,id_utilisateur,nb_produit) 
values(?,(select id_utilisateur from utilisateur
           where   courriel=?) , ?  )
    `,
      [id_produit, courriel, nb_produit]
    );
  } catch (error) {
    // Si on détecte une erreur de conflit, on retourne false pour
    // retourner une erreur 409
    if (error.code === "SQLITE_CONSTRAINT") {
      return false;
    } else {
      console.log(error);
    }
  }
}

//**************UTILISATEUR  ************** */

//Lister toutes les activities d'un utilisateur
export async function getActivitiesUser(courriel) {
  try {
    let connexion = await connectionPromise;
    let resultat = await connexion.all(
      `SELECT * FROM produit
                                    INNER JOIN panier_utilisateur
                                    ON 
                                    id_utilisateur = (select id_utilisateur from utilisateur where courriel= ? )and panier_utilisateur.id_produit=produit.id_produit`,
      [courriel]
    );

    return resultat.map((activity) => {
      // convert image buffer to base64 string
      const base64Image = Buffer.from(activity.image).toString("base64");
      // return activity with base64 encoded image string
      return {
        ...activity,
        image: base64Image,
      };
    });
  } catch (error) {
    response.status(409).end();
  }
}
//Desabonner d'une activitie
export async function DesabonnerCours(id_produit, courriel) {
  let connexion = await connectionPromise;
  let resultat = await connexion.run(
    `DELETE FROM panier_utilisateur
                                  WHERE 
                                      id_produit= ? and id_utilisateur=(select id_utilisateur from utilisateur
                                      where   courriel=?)`,
    [id_produit, courriel]
  );
}


// update quantite d'une activite user
export async function modifierQuantiteActiviteUser(id_utilisateur) {
  let connexion = await connectionPromise;
  let resultat = await connexion.run(
    `UPDATE produit 
    SET quantite = quantite - (
        SELECT nb_produit 
        FROM panier_utilisateur 
        WHERE id_utilisateur = ? 
        AND id_produit = produit.id_produit
    )
    WHERE EXISTS (
        SELECT 1 
        FROM panier_utilisateur 
        WHERE id_utilisateur = ?
        AND id_produit = produit.id_produit
    )`,
    [id_utilisateur,id_utilisateur]
  );
};

export async function modifierQuantiteZero() {
  let connexion = await connectionPromise;
  let resultat = await connexion.run(
 `DELETE FROM panier_utilisateur
 WHERE id_produit IN (
     SELECT id_produit
     FROM produit
     WHERE quantite = 0
 ); `
  );
};


//Desabonner des activitie
export async function DesabonnerallCours(courriel) {
  let connexion = await connectionPromise;
  let resultat = await connexion.run(
    `DELETE FROM panier_utilisateur
                                  WHERE 
                                       id_utilisateur=(select id_utilisateur from utilisateur
                                      where   courriel=?)`,
    [courriel]
  );
}

//ajouter la quantite
export async function Addquantite(id_produit, id_utilisateur, nb_produit) {
  let connexion = await connectionPromise;
  let resultat = await connexion.run(
    `UPDATE panier_utilisateur
    SET nb_produit =?
    WHERE
        id_produit=? and id_utilisateur=?`,
    [nb_produit, id_produit, id_utilisateur]
  );
}
//**********COMPTE ADMIN************* */

//Supprimer une activité de la base de données
export async function supprimActivite(id_produit) {
  try {
    let connexion = await connectionPromise;
    let resultat = await connexion.run(
      `DELETE FROM produit
                                  WHERE 
                                     id_produit= ? `,
      [id_produit]
    );
  } catch (error) {
    console.log(error);
  }
}
//trouver tous les utilisateur inscrit a 1 cours
export async function getUseraActi(id_produit) {
  try {
    let connexion = await connectionPromise;
    let resultat = connexion.all(
      `Select nom, prenom, utilisateur.id_utilisateur,panier_utilisateur.nb_produit from utilisateur
    inner join panier_utilisateur
    on utilisateur.id_utilisateur=panier_utilisateur.id_utilisateur
    and panier_utilisateur.id_produit=? `,
      [id_produit]
    );
    return resultat;
  } catch (error) {
    console.log(error);
  }
}

//trouver tous les utilisateur inscrit a 1 cours
export async function getnombreuser(id_produit) {
  try {
    let connexion = await connectionPromise;
    let resultat = connexion.all(
      `Select count(panier_utilisateur.nb_produit) from utilisateur
    inner join panier_utilisateur
    on utilisateur.id_utilisateur=panier_utilisateur.id_utilisateur
    and panier_utilisateur.id_produit=? `,
      [id_produit]
    );
    return resultat;
  } catch (error) {
    console.log(error);
  }
}

//Ajout d'une activité
export async function ajouterActivite(nom, quantite, description, prix, categorie,image) {
  try {
    let connexion = await connectionPromise;
    let resultat = await connexion.run(
      `INSERT INTO produit (nom, quantite ,prix,description,nom_categorie, image) 
                                    VALUES 
                                    (?, ?, ?, ?, ?, ?) `,
      [nom, quantite, prix, description,categorie, image]
    );
  } catch (error) {
    console.log(error);
  }
}
//Recuperer le dernier id du cours de la base de donnée
export async function getId() {
  let connexion = await connectionPromise;
  let resultat = connexion.all(`SELECT MAX(id_produit) FROM produit LIMIT 1`);
  return resultat;
}

//Requete nombre d'inscription:
export async function nombreInscriActivitie(id_produit) {
  try {
    let connection = await connectionPromise;
    let resultat = await connection.all(
      "select count(id_utilisateur) from panier_utilisateur where id_produit=?",
      [id_produit]
    );
    return resultat;
  } catch (error) {
    console.log(error);
  }
}
export async function GetCategorie() {
  try {
    let connection = await connectionPromise;
    let resultat = await connection.all("select * from categorie ");
    return resultat;
  } catch (error) {
    console.log(error);
  }
}
