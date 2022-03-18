import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;
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
                return console.log("Les successeurs : ", sommetCourant.successeurs);
            }
        }
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
        console.log(
            `les predecesseurs de "${sommetX}" sont`,
            predecesseurs.join(", ")
        );
    }

    desc(graphe, sommetX) { }

    anc(graphe, sommetX) { }

    compCon(graphe, sommetX) { }

    nbCompCon(graphe, sommetX) { }
}
const g = new Graphe();
const res = g.pred(
    [
        { sommet: "a", successeurs: ["b", "c", "d", "e"] },
        { sommet: "b", successeurs: ["e"] },
        { sommet: "c", successeurs: ["e"] },
        { sommet: "d", successeurs: ["c"] },
        { sommet: "e", successeurs: [] }
    ],
    "e"
);
console.log(res);
