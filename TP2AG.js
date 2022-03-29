class Graphe {
    arc(graphe, sommetX, sommetY) {
        for (const sommetCourant of graphe) {
            if (sommetCourant.sommet === sommetX) {
                for (const successeursCourant of sommetCourant.successeurs) {
                    if (successeursCourant === sommetY) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    arete(graphe, sommetX, sommetY) {
        for (const sommetCourant of graphe) {
            if (sommetCourant.sommet === sommetX || sommetY) {
                for (const successeursCourant of sommetCourant.successeurs) {
                    if (successeursCourant === sommetY || sommetX) {
                        return true;
                    }
                }
            }
        }
        return false;
        // /* alt */ return this.arc(graphe, sommetX, sommetY) || this.arc(graphe, sommetY, sommetX);
    }

    succ(graphe, sommetX) {
        return graphe.find(sommetCourant => sommetCourant.sommet === sommetX).successeurs
    }

    pred(graphe, sommetX) {
        const predecesseurs = [];
        for (const sommetCourant of graphe) {
            for (const successeursCourant of sommetCourant.successeurs) {
                if (successeursCourant === sommetX) {
                    predecesseurs.push(sommetCourant.sommet);
                }
            }
        }
        /*console.log(
              `les predecesseurs de "${sommetX}" sont`,
              predecesseurs.join(", ")
            );
            */
        return predecesseurs;
    }

    desc(graphe, sommetX) {
        const succs = this.succ(graphe, sommetX);
        return Array.from(
            new Set([...succs, ...succs.map((successeur) => this.desc(graphe, successeur)).flat()])
        );
    }

    weightCounter(graphe, sommetX, { chemin, profondeur, poids } = { chemin: [], profondeur: 1, poids: 0 }) {
        const element = graphe
            .find(sommetCourant => sommetCourant.sommet === sommetX)
        if (element.successeurs.length === 0) {
            return [{
                chemin: [...chemin, sommetX], profondeur: profondeur, poids
            }];
        }

        return element.successeurs
            .map((successeur, idx) => this.weightCounter(
                graphe,
                successeur,
                {
                    chemin: [...chemin, sommetX],
                    profondeur: profondeur + 1,
                    poids: poids + Number(element.poids[idx])
                }
            )
            ).flat()
    }

    anc(graphe, sommetX) {
        const predecesseurs = this.pred(graphe, sommetX);
        return Array.from(
            new Set([
                ...predecesseurs,
                ...predecesseurs
                    .map((predecesseur) => this.anc(graphe, predecesseur))
                    .flat()
            ])
        )
    }

    compCon(graphe, sommetX, { chemin, profondeur } = { chemin: [], profondeur: 0 }) {
        const successeurs = this.succ(graphe, sommetX);
        if (successeurs.length === 0) {
            return [{ chemin: [...chemin, sommetX], profondeur: profondeur + 1 }];
        }

        return successeurs.map((successeur) => this.compCon(graphe, successeur, { chemin: [...chemin, sommetX], profondeur: profondeur + 1 })).flat()
            .reduce((accumulateur, courant) => {
                if (accumulateur.length === 0) return [courant];
                if (courant.profondeur > accumulateur[0].profondeur) return [courant];
                if (courant.profondeur < accumulateur[0].profondeur) {
                    return accumulateur;
                }
                return [...accumulateur, courant];
            }, []);
    }

    nbCompCon(graphe) {
        let maxProfondeur = 0;
        let nbCompCon = 0;
        for (const sommetCourant of graphe) {
            const composanteConnexe = this.compCon(graphe, sommetCourant.sommet);
            if (composanteConnexe[0].profondeur < maxProfondeur) continue;
            if (composanteConnexe[0].profondeur > maxProfondeur) {
                maxProfondeur = composanteConnexe[0].profondeur;
                nbCompCon = composanteConnexe.length;
                continue;
            }
            nbCompCon += composanteConnexe.length;
        }
        return nbCompCon;
    }
}

const g = new Graphe();
const res = g.weightCounter(
    [
        { sommet: "a", successeurs: ["b", "c", "d", "e"], poids: ["1", "7", "4", "1"] },
        { sommet: "b", successeurs: ["f"], poids: ["6"] },
        { sommet: "c", successeurs: ["h"], poids: ["4"] },
        { sommet: "d", successeurs: ["f", "g"], poids: ["5", "3"] },
        { sommet: "e", successeurs: ["g", "h"], poids: ["4", "1"] },
        { sommet: "f", successeurs: ["g"], poids: ["5"] },
        { sommet: "g", successeurs: ["h"], poids: ["2"] },
        { sommet: "h", successeurs: ["i"], poids: ["53"] },
        { sommet: "i", successeurs: [], poids: [] }

    ],
    "a"
);
console.log(res);