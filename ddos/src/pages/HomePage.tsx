import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

interface HomePageProps {
  setCurrentPage: (page: string) => void;
}

export function HomePage({ setCurrentPage }: HomePageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="mb-6 text-slate-800">Qu'est-ce qu'une attaque DDoS ?</h1>
          
          <div className="mb-8">
            <img
              src="public/ddos.png.jpg"
              alt="Illustration d'une attaque DDoS"
              className="mx-auto w-full max-w-2xl rounded-lg shadow-lg"
            />
          </div>
        </div>

        <Card className="mb-8 border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Comprendre les attaques DDoS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700">
              Une attaque DDoS (Distributed Denial of Service) est une cyberattaque qui vise à rendre un service, 
              un serveur ou un réseau indisponible en le saturant avec un trafic massif provenant de multiples sources. 
              L'objectif est de consommer toutes les ressources disponibles (bande passante, mémoire, CPU) pour empêcher 
              les utilisateurs légitimes d'accéder au service.
            </p>
            <p className="text-slate-700">
              Ces attaques exploitent des réseaux de machines compromises (botnets) pour générer un volume 
              de requêtes si important que le système ciblé ne peut plus répondre normalement. Les conséquences 
              peuvent être désastreuses : perte de revenus, dégradation de la réputation, et interruption des services critiques.
            </p>
            <p className="text-slate-700">
              Il est essentiel de comprendre ces mécanismes pour mieux s'en protéger. Notre simulateur pédagogique 
              vous permettra d'observer le comportement d'un réseau face à différents types de sollicitations, 
              dans un environnement contrôlé et sécurisé.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => setCurrentPage('simulation')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            Découvrir la simulation
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
