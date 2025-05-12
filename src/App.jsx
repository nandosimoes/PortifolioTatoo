import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Sobre from './components/Sobre/Sobre';
import Portfolio from './components/Portifolio/Portifolio';
import Certificacoes from './components/Certificacoes/Certificacoes';
import Contato from './components/Contato/Contato';
import Carrossel from './components/Carrossel/Carrossel';

import './App.css';

function App() {
  return (
    <div className="app-container">
      <Carrossel />
      <Header />
        <Hero />
        <Sobre />
        <Portfolio />
        <Certificacoes />
        <Contato />
    </div>
  );
}

export default App;