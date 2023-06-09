import connectionPromise from "./connexion.js";
import { hash } from "bcrypt";
//Page de creation de compte
export async function ajouteruser(nomUser, prenomUser, courriel, password, adresse) {
  let connexion = await connectionPromise;
  let passwordHash = await hash(password, 10);

  let resultat = await connexion.run(
    ` INSERT INTO utilisateur (id_type_utilisateur,nom,prenom,courriel,mot_passe,adresse)
                                    VALUES 
                                    (?, ?, ?, ?, ?, ?) `,
    [1, nomUser, prenomUser, courriel, passwordHash, adresse]
  );
}

export async function getUserByCourriel(courriel) {
  let connexion = await connectionPromise;

  let user = await connexion.get(
    `SELECT  id_utilisateur, id_type_utilisateur,nom,prenom,courriel, mot_passe
    FROM utilisateur 
    WHERE courriel=?`,
    [courriel]
  );
  return user;
}

export async function modifierPassword(courriel,nvmdp){
  let connexion = await connectionPromise;
  let nvmdpHash = await hash(nvmdp, 10);

  let resultat = await connexion.run(
    `UPDATE utilisateur set mot_passe=? where courriel=?`,[nvmdpHash,courriel]
  );
}