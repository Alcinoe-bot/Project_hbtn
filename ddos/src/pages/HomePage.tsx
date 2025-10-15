import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Section DDoS avec image */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-12">
            Qu'est-ce qu'une attaque DDoS ?
          </h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
            <img 
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=400&fit=crop" 
              alt="DDoS Network Illustration" 
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Explication DDoS */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comprendre les attaques DDoS
          </h2>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Une attaque DDoS (Distributed Denial of Service) est une cyberattaque qui vise à rendre un service, un serveur ou un réseau indisponible en le saturant avec un trafic massif provenant de multiples sources. L'objectif est de consommer toutes les ressources disponibles (bande passante, mémoire, CPU) pour empêcher les utilisateurs légitimes d'accéder au service.
            </p>
            
            <p>
              Ces attaques exploitent des réseaux de machines compromises (botnets) pour générer un volume de requêtes si important que le système ciblé ne peut plus répondre normalement. Les conséquences peuvent être désastreuses : perte de revenus, dégradation de la réputation, et interruption des services critiques.
            </p>
            
            <p>
              Il est essentiel de comprendre ces mécanismes pour mieux s'en protéger. Notre simulateur pédagogique vous permettra d'observer le comportement d'un réseau face à différents types de sollicitations, dans un environnement contrôlé et sécurisé.
            </p>
          </div>
        </div>

        {/* Méthodes disponibles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Méthodes de test disponibles
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">HTTP Flood</h3>
              <p className="text-gray-600 text-sm">
                Génère un volume massif de requêtes HTTP légitimes pour saturer le serveur web.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">HTTP Bypass</h3>
              <p className="text-gray-600 text-sm">
                Simule des requêtes HTTP avec headers et cookies réalistes pour contourner les protections basiques.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">HTTP Slowloris</h3>
              <p className="text-gray-600 text-sm">
                Maintient des connexions HTTP ouvertes le plus longtemps possible pour épuiser les ressources.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">TCP Flood</h3>
              <p className="text-gray-600 text-sm">
                Inonde la cible avec des paquets TCP pour saturer la couche transport du réseau.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Minecraft Ping</h3>
              <p className="text-gray-600 text-sm">
                Test spécifique pour les serveurs de jeux Minecraft via des requêtes de status.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate("/simulate")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 rounded-lg text-lg transition-colors shadow-sm"
          >
            Découvrir la simulation
          </button>
        </div>

        {/* Warning */}
        <div className="mt-12 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <p className="text-orange-800 text-center text-sm">
            ⚠️ <strong>Important :</strong> Cet outil est strictement destiné à un usage pédagogique. Vous ne devez l'utiliser que sur des infrastructures vous appartenant ou pour lesquelles vous disposez d'une autorisation écrite explicite. Toute utilisation malveillante est interdite et punissable par la loi.
          </p>
        </div>
      </div>
    </div>
  );
}
