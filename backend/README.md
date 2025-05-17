API de Gestion de Parkings d'Hôtels
Une API REST développée avec FastAPI pour gérer les emplacements de parking dans différents hôtels.
Fonctionnalités

Gestion des hôtels (création, lecture, mise à jour, suppression)
Gestion des emplacements de parking (création, lecture, mise à jour, suppression)
Filtrage des parkings par hôtel
Gestion des statuts des parkings

Prérequis

Python 3.8 ou supérieur
Les dépendances listées dans requirements.txt

Installation

Cloner le dépôt :
bashgit clone https://github.com/votre-user/parking-api.git
cd parking-api

Créer un environnement virtuel :
bashpython -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate

Installer les dépendances :
bashpip install -r requirements.txt

Initialiser la base de données :
bashpython -m scripts.init_db


Lancement
Pour lancer le serveur de développement :
bashuvicorn app.main:app --reload
L'API sera accessible sur http://localhost:8000.
Documentation API
La documentation de l'API est disponible aux URLs suivantes :

Documentation Swagger : http://localhost:8000/docs
Documentation ReDoc : http://localhost:8000/redoc

Structure du projet

app/ : Code source principal

main.py : Point d'entrée de l'application
database.py : Configuration de la base de données
models/ : Modèles SQLAlchemy
schemas/ : Schémas Pydantic
repositories/ : Couche d'accès aux données
services/ : Logique métier
api/ : Endpoints FastAPI


scripts/ : Scripts utilitaires
tests/ : Tests unitaires

Exemples d'utilisation
Création d'un hôtel
bashcurl -X 'POST' \
  'http://localhost:8000/api/hotels/' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Nouvelle Résidence"
}'
Récupération des parkings d'un hôtel
bashcurl -X 'GET' \
  'http://localhost:8000/api/hotels/1/parkings/' \
  -H 'accept: application/json'
Licence
Ce projet est sous licence MIT.