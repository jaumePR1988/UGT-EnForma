/**
 * Servei per a la generació de contingut de cursos mitjançant IA
 */
export const courseDraftService = {
    /**
     * Optimitza el títol i descripció basant-se en paraules clau
     */
    async generateContent(keywords) {
        // Simulació de crida a LLM
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    title: `Curs Avançat de ${keywords.charAt(0).toUpperCase() + keywords.slice(1)} per a Delegats`,
                    description: `Aquest curs integral de ${keywords} està dissenyat per dotar l'alumnat de les eines pràctiques i teòriques necessàries d'acord amb la normativa de la UGT Catalunya. Cobrirem els aspectes clau de la matèria, casos pràctics d'actualitat i sessions de resolució de dubtes amb experts.`,
                    category: keywords.includes("laboral") ? "Jurídic" : "Sindical",
                    objectives: [
                        "Entendre el marc normatiu vigent",
                        "Aplicar solucions pràctiques en l'àmbit sindical",
                        "Millorar la capacitat de negociació"
                    ]
                });
            }, 1500);
        });
    },

    /**
     * Suggereix logística segons la categoria
     */
    suggestLogistics(category) {
        const defaults = {
            "Jurídic": { capacity: 15, location: "Sala A - Seu Central" },
            "Sindical": { capacity: 30, location: "Auditori UGT" },
            "General": { capacity: 20, location: "Aula Online Zoom" }
        };
        return defaults[category] || defaults["General"];
    }
};
