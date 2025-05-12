import React, { useState, useEffect } from 'react';
import styles from './Carrossel.module.css';

// URLs das imagens (substitua pelos seus links reais)
const imagens = [
'https://iili.io/38qQcOP.jpg',
'https://iili.io/38qQa5B.jpg',
'https://iili.io/38qQlb1.jpg'
];

export default function Carrossel() {
  const [imagemAtual, setImagemAtual] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((prev) => (prev + 1) % imagens.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  const mudarImagem = (index) => {
    setImagemAtual(index);
  };

  return (
    <div className={styles.carrosselContainer}>
      {imagens.map((imagem, index) => (
        <div 
          key={index}
          className={`${styles.imagemCarrossel} ${index === imagemAtual ? styles.ativa : ''}`}
          style={{ backgroundImage: `url(${imagem})` }}
        />
      ))}
      
      <div className={styles.overlay} />
      
      <div className={styles.conteudoHero}>
        <div className={styles.textoContainer}>
          <h2 className={styles.subtitulo}>tatuadora</h2>
          <h1 className={styles.titulo}>Heloisa Martinho</h1>
        </div>
        
        <div className={styles.bottomElements}>
          <a href="#sobre" className={styles.botao}>ver mais</a>
          <div className={styles.indicadores}>
            {imagens.map((_, index) => (
              <button
                key={index}
                className={`${styles.indicador} ${index === imagemAtual ? styles.ativo : ''}`}
                onClick={() => mudarImagem(index)}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}