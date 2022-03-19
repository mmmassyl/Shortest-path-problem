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

    saisie(graphe) { }

    succ(graphe, sommetX) {
        for (const sommetCourant of graphe) {
            if (sommetCourant.sommet === sommetX) {
                return sommetCourant.successeurs;
            }
        }
        // return graphe.find(sommetCourant => sommetCourant.sommet === sommetX).successeurs
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
        return Array.from(
            new Set([
                ...this.succ(graphe, sommetX),
                ...graphe
                    .find((sommet) => sommet.sommet === sommetX) //.succ(graphe, sommetX)
                    .successeurs.map((successeur) => this.desc(graphe, successeur))
                    .flat(),
            ])
        );
    }

    anc(graphe, sommetX) {
        const predecesseurs = this.pred(graphe, sommetX);
        return Array.from(
            new Set([
                ...predecesseurs,
                ...predecesseurs
                    .map((predecesseur) => this.anc(graphe, predecesseur))
                    .flat(),
            ])
        );
    }

    compCon(
        graphe,
        sommetX,
        { chemin, profondeur } = { chemin: [], profondeur: 0 }
    ) {
        const successeurs = this.succ(graphe, sommetX);
        if (successeurs.length === 0) {
            return [{ chemin: [...chemin, sommetX], profondeur: profondeur + 1 }];
        }

        return successeurs
            .map((successeur) =>
                this.compCon(graphe, successeur, {
                    chemin: [...chemin, sommetX],
                    profondeur: profondeur + 1,
                })
            )
            .flat()
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
const res = g.nbCompCon([
    { sommet: 'a', successeurs: ['b', 'c'] },
    { sommet: 'b', successeurs: ['f'] },
    { sommet: 'c', successeurs: ['f'] },
    { sommet: 'd', successeurs: ['e'] },
    { sommet: 'e', successeurs: ['f'] },
    { sommet: 'f', successeurs: [] },
]);
console.log(res);