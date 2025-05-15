import React from 'react';
import styles from './Sobre.module.css';

export default function Sobre() {
  return (
    <section id="sobre" className={styles.sobreContainer}>
      <div className={styles.contentBox}>
        <h2 className={styles.title}>Sobre mim</h2>
        
        <div className={styles.contentWrapper}>
          <div className={styles.imageContainer}>
            <img 
              src="https://iili.io/3U2oeje.png"
              alt="Minha foto"
              className={styles.profileImage}
            />
          </div>
          
          <div className={styles.textContent}>
            <p>
              Oi, meu nome é Heloisa Helena, uma artista em formação apaixonadoa pelo mundo da tatuagem. 
              Ainda não tive a oportunidade de tatuar em pele humana, mas estou me dedicando diariamente 
              aos estudos, praticando em pele sintética e aperfeiçoando minhas técnicas de desenho e composição. 
              Meu foco é criar trabalhos [mencione seu estilo ou inspirações, ex.: limpos, cheios de personalidade, 
              com traços finos/geométricos/realistas].
              <br /><br />
              Acredito que a tatuagem é uma arte que exige respeito e responsabilidade, por isso quero estar 
              100% preparadoa antes de deixar minha primeira marca em alguém. Se você está buscando uma 
              artista cuidadosa e comprometida com o crescimento, vamos conversar!
              <br /><br />
              📩 [contato ou @instagram]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 