/**
 * ModularMind - Analyseur d'Intention (Bout n°1)
 * Ce script est le cerveau qui décide quel module activer.
 */
class OrchestrateurIA {
    constructor() {
        // Chargement de la mémoire ou initialisation par défaut
        const memoire = localStorage.getItem('mm_brain');
        this.catalogue = memoire ? JSON.parse(memoire) : {
            "Développement": ["code", "script", "js", "html", "css", "site", "web"],
            "Design": ["image", "logo", "photo", "dessin", "graphisme", "icone"]
        };
        this.verbesAction = ["faire", "créer", "fabriquer", "générer", "concevoir"];
        this.enAttente = null;
        this.dernierePhrase = "";
    }

    // Fonction principale de décision
    analyser(phrase) {
        this.dernierePhrase = phrase.toLowerCase();
        const mots = this.dernierePhrase.split(/\W+/);
        let scores = {};

        // Initialisation des scores pour chaque catégorie
        for (let cat in this.catalogue) scores[cat] = 0;

        // Calcul des points
        for (const [cat, motsCles] of Object.entries(this.catalogue)) {
            mots.forEach(mot => {
                if (motsCles.includes(mot)) scores[cat] += 2.5; // Mot technique = poids fort
                if (this.verbesAction.includes(mot)) scores[cat] += 0.5; // Verbe = poids faible
            });
        }

        // Trouver le gagnant
        let gagnant = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        
        // Sécurité : Si aucun mot n'est reconnu ou si c'est trop flou
        if (scores[gagnant] === 0 || (Object.values(scores).filter(s => s === scores[gagnant]).length > 1)) {
            return { statut: "FLOU", message: "Je n'ai pas compris. Voulez-vous du Développement ou du Design ?" };
        }

        this.enAttente = gagnant;
        return { 
            statut: "OK", 
            intention: gagnant, 
            message: `Activer le module **${gagnant}** ?` 
        };
    }

    // Apprentissage contextuel
    apprendre() {
        if (!this.enAttente) return;
        const mots = this.dernierePhrase.split(/\W+/);
        mots.forEach(mot => {
            if (mot.length > 3 && !this.catalogue[this.enAttente].includes(mot)) {
                this.catalogue[this.enAttente].push(mot);
            }
        });
        localStorage.setItem('mm_brain', JSON.stringify(this.catalogue));
    }
}
