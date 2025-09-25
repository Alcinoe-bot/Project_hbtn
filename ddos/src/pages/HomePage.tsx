import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ImageWithFallback } from "./components/image/ImageWithFallback";

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
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwc2VjdXJpdHklMjBkZG9zJTIwYXR0YWNrJTIwZGlhZ3JhbXxlbnwxfHx8fDE3NTc2ODMzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Illustration d'une attaque DDoS sur un réseau"
              className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
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
