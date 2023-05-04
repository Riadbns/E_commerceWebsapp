import { existsSync } from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

/**
 * Constante indiquant si la base de données existe au démarrage du serveur
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_FILE);

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */
const createDatabase = async (connectionPromise) => {
  let connection = await connectionPromise;

  await connection.exec(
    `CREATE TABLE IF NOT EXISTS type_utilisateur(
            id_type_utilisateur INTEGER PRIMARY KEY,
            type TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS utilisateur(
            id_utilisateur INTEGER PRIMARY KEY,
            id_type_utilisateur INTEGER NOT NULL,
            courriel TEXT NOT NULL UNIQUE,
            mot_passe TEXT NOT NULL,
            prenom TEXT NOT NULL,
            nom TEXT NOT NULL,
            adresse TEXT NOT NULL,
            CONSTRAINT fk_type_utilisateur 
                FOREIGN KEY (id_type_utilisateur)
                REFERENCES type_utilisateur(id_type_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS produit(
          id_produit INTEGER PRIMARY KEY AUTOINCREMENT,
          nom TEXT NOT NULL,
          description TEXT NOT NULL,
          quantite INTEGER NOT NULL,
          prix REAL NOT NULL,
          image BLOB,
          nom_categorie Text not null,
          constraint fk_categorie
          FOREIGN KEY (nom_categorie)
              REFERENCES categorie(nom_categorie) 
              ON DELETE SET NULL 
              ON UPDATE CASCADE
      );
      CREATE TABLE IF NOT EXISTS categorie (
        nom_categorie TEXT primary key
    
      );
        
        CREATE TABLE IF NOT EXISTS panier_utilisateur(
            id_produit INTEGER,
            id_utilisateur INTEGER,
            nb_produit INTEGER NOT NULL,
            PRIMARY KEY (id_produit, id_utilisateur),
            CONSTRAINT fk_panier_utilisateur 
                FOREIGN KEY (id_produit)
                REFERENCES produit(id_produit) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            CONSTRAINT fk_utilisateur_panier 
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur)
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        INSERT INTO type_utilisateur (type) VALUES 
            ('regulier'),
            ('administrateur');
        
        INSERT INTO categorie (nom_categorie) VALUES
            ('Imprimante'),
            ('Moniteur'),
            ('Telephone portable'),
            ('montres intelligentes'),
            ('Ordinateur portable'),
            ('Appareil photo'),
            ('Tablette');`
  );

  return connection;
};

// Base de données dans un fichier
let connectionPromise = open({
  filename: process.env.DB_FILE,
  driver: sqlite3.Database,
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
  connectionPromise = createDatabase(connectionPromise);
}

export default connectionPromise;
