const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');


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

    async saisie() {
        let graphe = [];

        const rl = readline.createInterface({ input, output, terminal: false })
        const recursiveAsyncReadLine = async function () {
            const answer = await rl.question('Saisir le nom du sommet ')
            if (answer === "") {
                rl.close();
                return;
            }
            graphe.push({ sommet: answer, successeurs: [], poids: [] });
            console.log(graphe);
            return recursiveAsyncReadLine();
        };
        await recursiveAsyncReadLine();

        for (const sommet of graphe) {
            const recursiveAsyncReadLine0 = async function () {
                const rl0 = readline.createInterface({ input, output, terminal: false });
                const answer0 = await rl0.question(`Saisir le nom du successeur ${sommet.sommet} `)
                if (answer0 === "") {
                    rl0.close();
                    return;
                }
                console.log(sommet.successeurs);
                sommet.successeurs.push(answer0);
                console.log(graphe);
                return recursiveAsyncReadLine0();
            };
            await recursiveAsyncReadLine0();
        }

        for (const sommet of graphe) {
            const recursiveAsyncReadLine1 = async function () {
                const rl1 = readline.createInterface({ input, output, terminal: false });
                const answer1 = await rl1.question(`Saisir le poids ${sommet.sommet} & ${sommet.successeurs} : `)
                if (answer1 === "") {
                    rl1.close();
                    return;
                }
                console.log(sommet.successeurs);
                sommet.poids.push(answer1);
                console.log(graphe);
                return recursiveAsyncReadLine1();
            };

            await recursiveAsyncReadLine1();
        }
        rl.close();
        return graphe;
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
    weightCounter(graphe, sommetX, { chemin, profondeur, poids } = { chemin: [], profondeur: 0, poids: 0 }) {
        const element = graphe
            .find(sommetCourant => sommetCourant.sommet === sommetX)
        if (element.successeurs.length === 0) {
            return [{
                chemin: [...chemin, sommetX], profondeur: profondeur + 1, poids
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
                    .flat(),
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
        { sommet: "b", successeurs: ["a", "f"], poids: ["1", "6"] },
        { sommet: "c", successeurs: ["a", "h"], poids: ["7", "4"] },
        { sommet: "d", successeurs: ["a", "f", "g"], poids: ["4", "5", "3"] },
        { sommet: "e", successeurs: ["a", "g", "h"], poids: ["1", "4", "1"] },
        { sommet: "f", successeurs: ["b", "d", "g"], poids: ["6", "5", "5"] },
        { sommet: "g", successeurs: ["d", "e", "f", "h"], poids: ["3", "4", "5", "2"] },
        { sommet: "h", successeurs: ["c", "e", "g", "i"], poids: ["4", "1", "2", "53"] },
        { sommet: "i", successeurs: ["h"], poids: ["53"] }

    ],
    "a"
);
console.log(res);