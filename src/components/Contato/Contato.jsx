export default function Contato() {
  return (
    <section id="contato" className="py-20 px-6 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Fale comigo</h2>
        <p className="mb-8 text-lg">
          COntato:<br />
          Dísponivel para contratação em São Paulo - SP
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="mailto:contato@heloisamartinho.com"
            className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-300 transition font-medium"
          >
            Email
          </a>
          <a
            href="https://www.instagram.com/heloisamartinho"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-300 transition font-medium"
          >
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}