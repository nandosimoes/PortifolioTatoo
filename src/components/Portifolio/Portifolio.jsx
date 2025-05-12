export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 px-6 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Portfólio</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Placeholder para imagens - substituir por imagens reais */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Imagem {item}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <p className="mb-6 italic text-gray-300">
            Lorem ipsum aha<br />
            Lorem ipsum aha<br />
            Lorem ipsum aha
          </p>
        </div>
      </div>
    </section>
  );
}