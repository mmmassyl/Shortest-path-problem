class Graphe {

    /*
        Exemple de graphe:
        [
            { sommet: "a", successeurs: ["b", "c", "d"] },
            { sommet: "b", successeurs: ["e"] },
            { sommet: "c", successeurs: [] },
            { sommet: "d", successeurs: ["c"] },
            { sommet: "e", successeurs: [] }

        ]
    */

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

    }

    saisie(graphe) {

    }

    succ(graphe, sommetX) {

    }

    pred(graphe, sommetX) {

    }

    desc(graphe, sommetX) {

    }

    anc(graphe, sommetX) {

    }

    compCon(graphe, sommetX) {

    }

    nbCompCon(graphe, sommetX) {

    }
}
const g = new Graphe();
const res = g.arc(
    [
        { sommet: "a", successeurs: ["b", "c", "d"] },
        { sommet: "b", successeurs: ["e"] },
        { sommet: "c", successeurs: [] },
        { sommet: "d", successeurs: ["c"] },
        { sommet: "e", successeurs: [] }

    ],
    "a",
    "b"
)
console.log(res);