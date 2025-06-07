import { useEffect, useRef, useState } from "react";
import styles from "../styles/TypingEffect.module.css";

const TypingEffect = () => {
  const texteRef = useRef(null);
  const [phase, setPhase] = useState(1);
  const [showSecondPhrase, setShowSecondPhrase] = useState(false);
  const [animateSecondPhrase, setAnimateSecondPhrase] = useState(false);

  useEffect(() => {
    let index = 0;
    let texteAffiche = "";
    let timeout;
    let intervalleRevelation;

    const textes = [
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

    const texteActuel = textes[phase - 1].texte;
    const erreurs = textes[phase - 1].erreurs;

    const taperLettre = () => {
      if (index < texteActuel.length) {
        const char = texteActuel[index];
        const erreur = erreurs.find((e) => e.position === index);

        if (erreur && texteRef.current) {
          texteRef.current.innerHTML = texteAffiche + erreur.erreur;

          setTimeout(() => {
            if (texteRef.current) {
              texteRef.current.innerHTML = texteAffiche;
            }
            texteAffiche += char;
            index++;
            timeout = setTimeout(taperLettre, 250);
          }, 600);
        } else {
          texteAffiche += char;
          if (texteRef.current) {
            texteRef.current.innerHTML = texteAffiche;
          }
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
        if (texteRef.current) {
          texteRef.current.innerHTML = texteAffiche;
        }
        timeout = setTimeout(supprimerLettres, 100);
      } else {
        if (phase < textes.length) {
          setPhase((prev) => prev + 1);
        } else {
          setTimeout(revelerLettresUneParUne, 500);
        }
      }
    };

    const revelerLettresUneParUne = () => {
      const phraseFinale = "I'm Senior Touco & I'm a Web Developer!";
      let cache = phraseFinale.split("").map((char) => (char === " " ? " " : ""));
      if (texteRef.current) {
        texteRef.current.innerHTML = cache.join("");
      }

      let lettres = phraseFinale
        .split("")
        .map((char, i) => ({ char, index: i }))
        .filter(({ char }) => char.trim() !== "");

      intervalleRevelation = setInterval(() => {
        if (lettres.length === 0) {
          clearInterval(intervalleRevelation);
          setShowSecondPhrase(true);
          // Délai minimal pour laisser le DOM le monter avant de jouer l'animation
          setTimeout(() => {
            setAnimateSecondPhrase(true);
          }, 50);
          return;
        }

        const randomIndex = Math.floor(Math.random() * lettres.length);
        const { char, index } = lettres.splice(randomIndex, 1)[0];
        cache[index] = char;

        if (texteRef.current) {
          texteRef.current.innerHTML = cache.join("");
        }
      }, 180);
    };

    taperLettre();

    return () => {
      clearTimeout(timeout);
      clearInterval(intervalleRevelation);
    };
  }, [phase]);

  return (
    <div className={styles.typingEffect}>
      <h1 ref={texteRef} className={styles.typingText}></h1>
      {showSecondPhrase && (
        <p
          className={`${styles.secondPhrase} ${animateSecondPhrase ? styles.visible : ""
            }`}
        >
          Let's create something amazing together!
        </p>
      )}
    </div>
  );
};

export default TypingEffect;
