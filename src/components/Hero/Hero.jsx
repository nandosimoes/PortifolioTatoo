import React from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  // URLs das imagens (substitua pelos seus links reais)
  const imageLinks = {
    arte: "https://iili.io/38qkFp4.png",
    paixao: "https://iili.io/38qSqjR.png",
    devocao: "https://iili.io/38qSBQp.png"
  };

  return (
    <section className={styles.hero}>
      <div className={styles.columnsContainer}>
        {/* Coluna ARTE */}
        <div className={styles.column}>
          <div className={styles.imageContainer}>
            <img src={imageLinks.arte} alt="Arte" className={styles.image} />
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.title}>ARTE</h2>
            <p className={styles.description}>Lorem ipsum nha</p>
          </div>
        </div>

        {/* Coluna PAIXÃO */}
        <div className={styles.column}>
          <div className={styles.imageContainer}>
            <img src={imageLinks.paixao} alt="Paixão" className={styles.image} />
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.title}>PAIXÃO</h2>
            <p className={styles.description}>Lorem ipsum nha</p>
          </div>
        </div>

        {/* Coluna DEVOCÃO */}
        <div className={styles.column}>
          <div className={styles.imageContainer}>
            <img src={imageLinks.devocao} alt="Devoção" className={styles.image} />
          </div>
          <div className={styles.textContent}>
            <h2 className={styles.title}>DEVOCÃO</h2>
            <p className={styles.description}>Lorem ipsum nha</p>
          </div>
        </div>
      </div>
    </section>
  );
}