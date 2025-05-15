import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Sobre from './components/Sobre/Sobre';
import Portfolio from './components/Portifolio/Portifolio';
import Certificacoes from './components/Certificados/Certificados';
import Contato from './components/Contato/Contato';
import Carrossel from './components/Carrossel/Carrossel';
import Oportunidade from './components/Oportunidade/Oportunidade';
import { isAuthenticated } from './utils/auth';

import './App.css';

function App() {
  const isAdmin = isAuthenticated() && window.location.pathname.startsWith('/admin');
  
  return (
    <div className="app-container">
      <Carrossel />
      <Header />
        <Hero />
        <Sobre />

        <Portfolio isAdmin={isAdmin} />
        <Oportunidade />
        <Certificacoes isAdmin={isAdmin} />
        <Contato />
    </div>
  );
}

export default App;