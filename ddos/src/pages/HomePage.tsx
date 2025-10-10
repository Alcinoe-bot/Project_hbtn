import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-6 text-slate-800">
            Qu'est-ce qu'une attaque DDoS ?
          </h1>

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
              Une attaque DDoS (Distributed Denial of Service) vise à rendre un service indisponible en le
              saturant de trafic provenant de multiples sources.
            </p>
            <p className="text-slate-700">
              Ces attaques s'appuient souvent sur des botnets. Conséquences possibles : perte de revenus,
              réputation dégradée et interruption de service.
            </p>
            <p className="text-slate-700">
              Cette application est <strong>100% pédagogique.</strong>.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button as="a" href="/simulate" className="px-8 py-3">
            Découvrir la simulation
          </Button>
        </div>
      </div>
    </div>
  );
}
