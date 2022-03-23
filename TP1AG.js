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

        const rl = readline.createInterface({ input, output, terminal: false });
        let graphe = [];

        const answer = await rl.question('Apuyyer sur g pour saisir un graphe ');

        if (answer !== "g") {
            console.log("au revoir");
            rl.close();
        }

        const rl2 = readline.createInterface({ input, output, terminal: false });

        const recursiveAsyncReadLine = async function () {
            const answer2 = await rl2.question('Saisir le nom du sommet ')
            if (answer2 === "/") {
                rl2.close();
                return;
            }
            graphe.push({ sommet: answer2, successeurs: [] });

            return recursiveAsyncReadLine();
        };

        await recursiveAsyncReadLine();

        console.log(graphe);
        for (const sommet of graphe) {
            const recursiveAsyncReadLine2 = async function () {
                const rl3 = readline.createInterface({ input, output, terminal: false });
                const answer3 = await rl3.question(`Saisir le nom du successeur ${sommet.sommet} `)
                if (answer3 === "/") {
                    rl3.close();
                    return;
                }
                console.log(sommet.successeurs);
                sommet.successeurs.push(answer3);
                return recursiveAsyncReadLine2();
            };

            await recursiveAsyncReadLine2();
        }

        rl.close();

        return graphe;
    }

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
                    .flat()
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

const main = async () => {
    const g = new Graphe();

    const gra = await g.saisie();
    
    const res = g.nbCompCon(gra, a);

    console.log(gra);

    console.log(res);
}

main();