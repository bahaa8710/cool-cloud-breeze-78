const TestimonialsSection = () => {
  const testimonials = [{
    name: "Emma L.",
    location: "Paris",
    rating: 5,
    comment: "Géniale pour scroller sur TikTok sans lever le bras ! Design super discret 💍",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80"
  }, {
    name: "Lucas M.",
    location: "Lyon",
    rating: 5,
    comment: "Perfect pour mes photos Instagram ! Plus besoin de minuteur, je contrôle tout avec ma bague ⚡",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  }, {
    name: "Sarah K.",
    location: "Marseille",
    rating: 5,
    comment: "Révolutionnaire ! Je contrôle ma musique pendant le sport, mes collègues sont jaloux 🎶",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  }];
  return <section className="py-20 px-4 relative">
      {/* Fond avec nuages */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-lavender/20 via-transparent to-pastel-pink/20"></div>
        <div className="absolute top-1/4 left-1/3 w-80 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ils ont testé, ils <span className="gradient-text">approuvent</span> !
          </h2>
          <p className="text-lg text-gray-600">
            Rejoins les milliers de personnes qui ont adopté leur nouvelle bague connectée
          </p>
        </div>

        {/* Grille de témoignages */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => <div key={index} className="card-cloud rounded-3xl p-6 hover:scale-105 transition-all duration-300">
              {/* Étoiles */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => <span key={i} className="text-yellow-400 text-lg">⭐</span>)}
              </div>

              {/* Commentaire */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Profil client */}
              <div className="flex items-center gap-3">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-sky-blue/20" />
                <div>
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>)}
        </div>

        {/* Stats sociaux */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <span><strong className="text-gray-800">+5000</strong> fans satisfaits</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span><strong className="text-gray-800">4.9/5</strong> note moyenne</span>
            </div>
            
          </div>
        </div>

        {/* Call-to-action secondaire */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-green-50 px-6 py-3 rounded-full border border-green-200">
            <span className="text-green-600 font-medium">📱 Compatible TikTok, Instagram & YouTube</span>
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;