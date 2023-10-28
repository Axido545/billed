const portfinder = require('portfinder');

const portToFind = 5679; // Remplacez par le port que vous souhaitez vérifier

portfinder.getPort({
  port: portToFind,    // Le port que vous voulez vérifier
  stopPort: portToFind, // Arrêtez la recherche après avoir trouvé le port spécifié
}, (err, port) => {
  if (err) {
    console.error(`Erreur : ${err.message}`);
  } else {
    console.log(`Le processus utilisant le port ${port} est actif.`);
  }
});
