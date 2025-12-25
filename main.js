// Initialisation du cerveau (Analyseur)
const ia = new OrchestrateurIA();

// Récupération des éléments du DOM
const chatWindow = document.getElementById('chat-window');
const inputField = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

/**
 * Affiche un message dans l'interface
 */
function afficherMessage(texte, type) {
    const div = document.createElement('div');
    div.className = `message ${type === 'user' ? 'user-msg' : 'ia-msg'}`;
    div.innerHTML = texte;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

/**
 * Gère l'envoi de la demande
 */
function traiterDemande() {
    const texte = inputField.value.trim();
    if (!texte) return;

    // 1. Afficher le message de l'utilisateur
    afficherMessage(texte, 'user');
    inputField.value = '';

    // 2. Analyser l'intention avec le 1er bout
    const resultat = ia.analyser(texte);

    // 3. Réagir selon le résultat
    if (resultat.statut === "OK") {
        const htmlConfirmation = `
            ${resultat.msg}
            <div class="btn-group">
                <button onclick="confirmerAction(true)">Oui</button>
                <button onclick="confirmerAction(false)">Non</button>
            </div>
        `;
        afficherMessage(htmlConfirmation, 'ia');
    } else {
        afficherMessage(resultat.msg, 'ia');
    }
}

/**
 * Gère la réponse aux boutons de confirmation
 */
window.confirmerAction = function(choix) {
    if (choix) {
        ia.apprendre();
        afficherMessage(`Module **${ia.enAttente}** activé.`, 'ia');
    } else {
        afficherMessage("D'accord, n'hésitez pas à être plus précis.", 'ia');
    }
    ia.enAttente = null;
};

// Écouteurs d'événements
sendBtn.addEventListener('click', traiterDemande);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') traiterDemande();
});

// Message d'accueil au chargement
window.onload = () => {
    afficherMessage("Système prêt. Que voulez-vous fabriquer ?", 'ia');
};
