import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Fond dégradé dramatique */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-blue via-lavender to-pastel-pink opacity-10"></div>
      
      {/* Nuages animés */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 w-60 h-30 bg-white/20 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-40 bg-lavender/20 rounded-full blur-3xl animate-float" style={{
          animationDelay: '1.5s'
        }}></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge urgence */}
          <div className="inline-flex items-center gap-2 bg-red-100 border border-red-200 px-4 py-2 rounded-full mb-8 animate-pulse-soft">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-700 font-medium text-sm">🔥 Stock limité - Plus que quelques pièces</span>
          </div>

          {/* Titre principal */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Prêt à contrôler ton <span className="gradient-text">monde</span> ?
          </h2>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoins la révolution de la technologie portable. Ton quotidien ne sera plus jamais le même ⚡
          </p>

          {/* Offre spéciale */}
          <div className="card-cloud rounded-3xl p-8 mb-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-500 mb-2">Prix de lancement ✨</div>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-2xl text-gray-400 line-through">29€</span>
                <span className="text-4xl font-bold gradient-text">19€</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">-34%</span>
              </div>
              <div className="text-sm text-gray-600">+ Livraison gratuite en France 🚚</div>
            </div>

            {/* Bouton principal */}
            <Button className="btn-cloud text-white font-bold py-6 px-12 rounded-full text-xl w-full sm:w-auto group mb-4">
              Je veux ma Zen Ring ⚡
              <span className="ml-2 group-hover:translate-x-2 transition-transform">💍</span>
            </Button>

            <div className="text-xs text-gray-500">Paiement 100% sécurisé • Garantie satisfait ou remboursé 15 jours</div>
          </div>

          {/* Countdown timer simulé */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
            <div className="text-red-700 font-semibold mb-2">⏰ Offre limitée dans le temps !</div>
            <div className="text-2xl font-bold text-red-800 font-mono">23:45:12</div>
            <div className="text-xs text-red-600">Heures • Minutes • Secondes</div>
          </div>
        </div>
      </div>

      {/* Footer simple */}
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <div className="border-t border-gray-200 pt-8">
          <p>&copy; 2024 Zen Ring - Contrôle ton monde ⚡</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-sky-blue transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-sky-blue transition-colors">CGV</a>
            <a href="#" className="hover:text-sky-blue transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default CTASection;