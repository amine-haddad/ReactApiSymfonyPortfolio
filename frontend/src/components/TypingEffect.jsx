import { useEffect, useRef, useState } from "react";
import "../styles/TypingEffect.css";

const TypingEffect = () => {
  const texteRef = useRef(null);
  const [phase, setPhase] = useState(1);
  const [phrase2Visible, setPhrase2Visible] = useState(false);

  useEffect(() => {
    let index = 0;
    let texteAffiche = "";
    let timeout;
    let listeTextes = [
      {
        texte: "Hello, I'm Senior Touco!",
        erreurs: [
          { position: 4, erreur: "a" },
          { position: 10, erreur: "Dai" },
          { position: 11, erreur: "Sond" },
          { position: 21, erreur: "touc" },
        ],
      },
      {
        texte: "I'm a Web Developer!",
        erreurs: [
          { position: 9, erreur: "o" },
          { position: 15, erreur: "p" },
        ],
      },
    ];

    let texteActuel = listeTextes[phase - 1].texte;
    let erreurs = listeTextes[phase - 1].erreurs;

    const taperLettre = () => {
      if (index < texteActuel.length) {
        let char = texteActuel[index];
        const erreur = erreurs.find((e) => e.position === index);
        if (erreur) {
          texteRef.current.innerHTML = texteAffiche + erreur.erreur;
          setTimeout(() => {
            texteRef.current.innerHTML = texteAffiche;
            texteAffiche += char;
            index++;
            timeout = setTimeout(taperLettre, 250);
          }, 600);
        } else {
          texteAffiche += char;
          texteRef.current.innerHTML = texteAffiche;
          index++;
          timeout = setTimeout(taperLettre, 150);
        }
      } else {
        setTimeout(supprimerLettres, 1000);
      }
    };

    const supprimerLettres = () => {
      if (texteAffiche.length > 0) {
        texteAffiche = texteAffiche.slice(0, -1);
        texteRef.current.innerHTML = texteAffiche;
        timeout = setTimeout(supprimerLettres, 100);
      } else {
        if (phase < 2) {
          setPhase(phase + 1);
        } else {
          setTimeout(() => revellerLettresUneParUne(), 500);
        }
      }
    };

    const revellerLettresUneParUne = () => {
      const phraseFinale = "I'm Senior Touco & I'm a Web Developer!";
      let tableauCache = phraseFinale
        .split("")
        .map((char) => (char === " " ? " " : ""));
      texteRef.current.innerHTML = tableauCache.join("");

      let lettresARévéler = phraseFinale
        .split("")
        .map((char, i) => ({ char, index: i }))
        .filter((item) => item.char !== " " && item.char !== "");

      const intervalleRévélation = setInterval(() => {
        if (lettresARévéler.length === 0) {
          clearInterval(intervalleRévélation);
          setPhrase2Visible(true);
          return;
        }

        const indexAleatoire = Math.floor(
          Math.random() * lettresARévéler.length
        );
        const { char, index } = lettresARévéler.splice(indexAleatoire, 1)[0];

        tableauCache[index] = char;
        texteRef.current.innerHTML = tableauCache.join("");
      }, 180);
    };

    taperLettre();

    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <div className="typing-effect">
      <h1 ref={texteRef} className="typing-text"></h1>
      {phrase2Visible && (
        <p className="second-phrase visible">
          Let's create something amazing together!
        </p>
      )}
    </div>
  );
};

export default TypingEffect;