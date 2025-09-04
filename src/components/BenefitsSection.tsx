
import { Battery, Smartphone, Camera } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Contrôle total",
      description: "Swipe TikTok, Instagram, YouTube sans toucher ton écran",
      color: "from-sky-blue to-lavender"
    },
    {
      icon: <Battery className="w-8 h-8" />,
      title: "72h d'autonomie",
      description: "3 jours d'utilisation avec le boîtier de recharge inclus",
      color: "from-lavender to-pastel-pink"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Selfies parfaits",
      description: "Déclenche tes photos et vidéos à distance, fini les selfies ratés",
      color: "from-pastel-pink to-sky-blue"
    }
  ];

  const additionalBenefits = [
    {
      title: "Design minimaliste",
      description: "Discret et moderne, personne ne remarquera que tu la portes",
      emoji: "💍"
    },
    {
      title: "Compatible iOS & Android",
      description: "Fonctionne avec tous les smartphones modernes",
      emoji: "📱"
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      {/* Nuages décoratifs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-20 bg-white/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-60 h-30 bg-lavender/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pourquoi tu vas <span className="gradient-text">l'adorer</span> ?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une bague connectée révolutionnaire qui transforme ton quotidien numérique
          </p>
        </div>

        {/* Bénéfices principaux avec icônes */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className="card-cloud rounded-3xl p-8 h-full hover:scale-105 transition-all duration-300 text-center">
                {/* Icône avec dégradé */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${benefit.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {benefit.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bénéfices secondaires */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {additionalBenefits.map((benefit, index) => (
            <div key={index} className="card-cloud rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{benefit.emoji}</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">{benefit.title}</h4>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section "Parfait pour" */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-8 text-gray-800">Parfait pour :</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "📱 Réseaux sociaux",
              "🎶 Contrôle musique", 
              "📸 Selfies & photos",
              "📖 Lecture e-books",
              "🎮 Gaming mobile"
            ].map((item, index) => (
              <span 
                key={index}
                className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 text-gray-700 hover:scale-105 transition-transform cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
