
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Truck, RotateCcw } from "lucide-react";

const ProductTabs = () => {
  return (
    <div className="relative overflow-hidden py-16">
      {/* Fond dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-blue/5 via-lavender/5 to-pastel-pink/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3 card-cloud rounded-2xl p-2 mb-8 overflow-x-auto">
            <TabsTrigger 
              value="description" 
              className="rounded-xl font-semibold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-blue data-[state=active]:to-lavender data-[state=active]:text-white transition-all duration-300"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-xl font-semibold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-blue data-[state=active]:to-lavender data-[state=active]:text-white transition-all duration-300"
            >
              <span className="hidden sm:inline">Avis (127)</span>
              <span className="sm:hidden">Avis</span>
            </TabsTrigger>
            <TabsTrigger 
              value="shipping"
              className="rounded-xl font-semibold text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-blue data-[state=active]:to-lavender data-[state=active]:text-white transition-all duration-300"
            >
              Livraison
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-8">
            <div className="card-cloud rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
              <h3 className="text-3xl font-bold mb-6 gradient-text">Description du produit</h3>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                La Zen Ring est une bague connectée Bluetooth révolutionnaire qui transforme votre façon d'interagir avec vos appareils. 
                Grâce à ses gestes tactiles intuitifs et son design minimaliste, elle devient l'accessoire indispensable de votre quotidien numérique.
              </p>
              <h4 className="text-xl font-semibold mb-4 text-gray-800">Fonctionnalités clés :</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { emoji: "📱", text: "Contrôle des réseaux sociaux (TikTok, Instagram, YouTube)" },
                  { emoji: "🎶", text: "Gestion de la musique et du volume" },
                  { emoji: "📸", text: "Déclencheur photo/vidéo à distance" },
                  { emoji: "🔋", text: "Autonomie 72h + boîtier de recharge inclus" },
                  { emoji: "📖", text: "Navigation intuitive pour lire des e-books" },
                  { emoji: "🎯", text: "Compatible iOS et Android" }
                ].map((feature, index) => (
                  <div key={index} className="bg-gradient-to-r from-white/80 to-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/20 hover:shadow-md transition-all duration-300">
                    <span className="text-xl mr-3">{feature.emoji}</span>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>


          <TabsContent value="reviews" className="mt-8">
            <div className="card-cloud rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
              <div className="text-center mb-10">
                <div className="text-5xl font-bold gradient-text mb-3">4.9/5</div>
                <div className="flex justify-center text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-lg">Basé sur 127 avis</p>
              </div>

              <div className="space-y-6">
                {[
                  { name: "Emma L.", date: "Il y a 2 jours", text: "Géniale pour scroller sur TikTok sans lever le bras ! Design super discret 💍", avatar: "👩‍💼" },
                  { name: "Lucas M.", date: "Il y a 5 jours", text: "Perfect pour mes photos Instagram ! Plus besoin de minuteur, je contrôle tout avec ma bague ⚡", avatar: "👨‍💻" },
                  { name: "Sarah K.", date: "Il y a 1 semaine", text: "Révolutionnaire ! Je contrôle ma musique pendant le sport, mes collègues sont jaloux 🎶", avatar: "👩‍🎨" }
                ].map((review, index) => (
                  <div key={index} className="bg-gradient-to-r from-white/90 to-white/70 p-6 rounded-2xl backdrop-blur-sm border border-white/30 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{review.avatar}</div>
                        <div>
                          <div className="font-bold text-gray-800">{review.name}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                      </div>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="mt-8">
            <div className="card-cloud rounded-3xl p-8 hover:shadow-lg transition-all duration-300">
              <h3 className="text-3xl font-bold mb-6 gradient-text">Livraison et retours</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <h4 className="text-xl font-semibold mb-4 flex items-center text-green-800">
                    <Truck className="w-6 h-6 mr-3" />
                    Livraison gratuite
                  </h4>
                  <p className="text-gray-700 mb-4">Livraison gratuite en France métropolitaine pour toute commande.</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Expédition sous 24-48h</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Livraison en 2-4 jours ouvrés</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>Suivi de commande inclus</li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 rounded-2xl border border-blue-200">
                  <h4 className="text-xl font-semibold mb-4 flex items-center text-blue-800">
                    <RotateCcw className="w-6 h-6 mr-3" />
                    Retours
                  </h4>
                  <p className="text-gray-700 mb-4">Vous avez 30 jours pour retourner votre produit si vous n'êtes pas satisfait.</p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Retour gratuit</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Remboursement sous 5-7 jours</li>
                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>Produit à retourner dans son emballage d'origine</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductTabs;
