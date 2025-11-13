import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Server, Clock, AlertTriangle } from "lucide-react";

interface HttpSlowlorisDefenseProps {
  setCurrentPage?: (page: string) => void;
}

export function HttpSlowlorisDefense({ setCurrentPage }: HttpSlowlorisDefenseProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-10 h-10 text-blue-600" />
            <h1 className="text-slate-800">Protection contre Slowloris</h1>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Votre test de charge a révélé une vulnérabilité aux attaques Slowloris. Ces attaques exploitent 
            la gestion des connexions HTTP pour épuiser les ressources du serveur avec un trafic minimal.
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="border-red-200 bg-red-50 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-red-900 mb-1">Vulnérabilité Slowloris Détectée</h3>
                <p className="text-red-800">
                  Votre serveur est vulnérable aux attaques Slowloris. Un attaquant peut maintenir des 
                  connexions ouvertes indéfiniment et épuiser vos ressources avec très peu de bande passante.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Qu'est-ce que Slowloris */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Qu'est-ce qu'une attaque Slowloris ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Slowloris est une attaque DDoS de la couche 7 (application) qui :
              </p>
              <ul className="space-y-2">
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Ouvre de nombreuses connexions HTTP simultanées</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Envoie des requêtes partielles très lentement</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Maintient les connexions ouvertes indéfiniment</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Épuise le pool de connexions du serveur</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Empêche les utilisateurs légitimes de se connecter</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Impact */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Server className="w-5 h-5 text-orange-600" />
                Impact sur votre serveur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                L'efficacité de Slowloris vient du fait qu'il nécessite très peu de ressources côté attaquant :
              </p>
              <ul className="space-y-2">
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span>Une seule machine peut paralyser un serveur</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span>Difficile à détecter (trafic faible)</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span>Serveur inaccessible pour tous les utilisateurs</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span>Perte de revenus et de réputation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Defense Strategies */}
        <div className="mb-8">
          <h2 className="text-slate-800 mb-6">Solutions de protection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <Clock className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Timeouts stricts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Configurez des timeouts agressifs pour fermer les connexions lentes.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Timeout de connexion : 10-20 secondes</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Timeout de header : 20-30 secondes</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Keep-alive limité</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Server className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Limite de connexions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Limitez le nombre de connexions simultanées par IP.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Max 10-50 connexions par IP</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Bannissement automatique si dépassement</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Augmenter le pool de connexions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Shield className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Reverse Proxy / CDN</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Utilisez un reverse proxy ou CDN pour absorber l'attaque.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Nginx, HAProxy, Cloudflare</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Filtrage intelligent du trafic</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Protection DDoS intégrée</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resource Link */}
        <Card className="border-slate-200 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-800">Ressource détaillée</CardTitle>
          </CardHeader>
          <CardContent>
            <a 
              href="https://www.cloudflare.com/learning/ddos/ddos-attack-tools/slowloris/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-6 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg hover:from-blue-100 hover:to-slate-100 transition-all border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-800 mb-2">📚 Guide complet : Attaque Slowloris</h3>
                  <p className="text-slate-600 mb-2">
                    Apprenez comment fonctionne Slowloris et comment protéger efficacement votre serveur web.
                  </p>
                  <p className="text-blue-600">Cloudflare Learning Center →</p>
                </div>
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          </CardContent>
        </Card>

        {/* Configuration Examples */}
        <Card className="border-slate-200 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-800">Exemples de configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-slate-700 mb-2">Apache (mod_reqtimeout)</h4>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono overflow-x-auto">
                  <div>RequestReadTimeout header=20-40,MinRate=500 body=20,MinRate=500</div>
                </div>
              </div>
              <div>
                <h4 className="text-slate-700 mb-2">Nginx</h4>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono overflow-x-auto">
                  <div>client_body_timeout 10s;</div>
                  <div>client_header_timeout 10s;</div>
                  <div>keepalive_timeout 5s 5s;</div>
                  <div>send_timeout 10s;</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
<Button
  onClick={() => setCurrentPage?.('simulation')}
  className="border-slate-300 text-slate-700 hover:bg-slate-100"
>
  Relancer un test
</Button>

<Button
  onClick={() => setCurrentPage?.('home')}
  className="bg-blue-600 hover:bg-blue-700 text-white"
>
  Retour à l'accueil
</Button>
        </div>
      </div>
    </div>
  );
}

