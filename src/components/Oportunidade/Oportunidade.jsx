import React from 'react';
import styles from './Oportunidade.module.css';

export default function Sobre() {
  return (
    <section id="sobre" className={styles.sobreContainer}>
      <div className={styles.contentBox}>
        <h2 className={styles.title}>Busco oportunidade como aprendiz</h2>
        
        <div className={styles.textContent}>
          <p>Desenho desde que me entendo por gente. Sempre gostei de criar no papel, testar ideias e usar a arte como forma de expressão. Com o tempo, percebi que a tatuagem é o caminho que quero seguir.
          Hoje estou focada em aprender tudo que posso: estudo por conta própria as bases da tatuagem, treino todos os dias, me dedico a entender traço, composição, aplicação em pele sintética e, principalmente, biossegurança.
          Me identifico com estilos como blackwork e old school, que têm personalidade e uma linguagem visual forte, algo que acredito combinar comigo.
          Ainda não tatuei em pele humana, mas levo o processo com seriedade e compromisso. Estou em busca de uma oportunidade real como aprendiz — quero viver a rotina de estúdio, aprender com profissionais experientes e evoluir de forma ética e responsável.
          Sou dedicada, pontual, tranquila, observo muito e me esforço pra sempre melhorar. Quero estar perto de quem leva a tatuagem a sério, como arte e profissão. Sou comprometida, ética, curiosa e determinada a fazer da tatuagem o meu ofício.Se você busca alguém dedicado e apaixonado por arte, estou pronta para começar.</p>
        </div>
        
        <div className={styles.buttonContainer}>
          <a href="#contato" className={styles.button}>Fale comigo</a>
        </div>
      </div>
    </section>
  );
}