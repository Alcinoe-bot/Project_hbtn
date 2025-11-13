import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Lock, Activity, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface HttpBypassDefenseProps {
  setCurrentPage?: (page: string) => void;
}

export function HttpBypassDefense({ setCurrentPage }: HttpBypassDefenseProps) {
  const navigate = useNavigate();

  const goToSimulation = () => {
    if (setCurrentPage) setCurrentPage("simulation");
    else navigate("/simulate");
  };

  const goHome = () => {
    if (setCurrentPage) setCurrentPage("home");
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-slate-800">Protection contre HTTP Bypass</h1>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Votre test HTTP a révélé des vulnérabilités. Les attaques HTTP Bypass exploitent les faiblesses 
            des applications web pour contourner les mécanismes de sécurité. Découvrez comment vous protéger.
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="border-red-200 bg-red-50 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-red-900 mb-1">Vulnérabilité HTTP Détectée</h3>
                <p className="text-red-800">
                  Votre application web est vulnérable aux attaques HTTP. Un attaquant pourrait exploiter 
                  cette faille pour surcharger votre serveur, contourner la sécurité ou accéder à des données sensibles.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Qu'est-ce qu'une attaque HTTP Bypass */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Qu'est-ce qu'une attaque HTTP Bypass ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Les attaques HTTP Bypass exploitent les vulnérabilités des applications web pour :
              </p>
              <ul className="space-y-2">
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Contourner les mécanismes d'authentification</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Surcharger le serveur avec des requêtes malformées</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Exploiter les failles dans le traitement HTTP</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Accéder à des ressources non autorisées</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Solution principale : WAF */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Solution recommandée : WAF
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                Un <strong>Web Application Firewall (WAF)</strong> est votre meilleure défense contre les attaques HTTP.
              </p>
              <ul className="space-y-2">
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Filtre les requêtes HTTP malveillantes</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Bloque les tentatives de bypass</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Protection OWASP Top 10</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Règles personnalisables</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Defense Strategies */}
        <div className="mb-8">
          <h2 className="text-slate-800 mb-6">Stratégies de défense complètes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <Lock className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Validation des entrées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Validez et sanitisez toutes les entrées utilisateur pour empêcher l'injection de code malveillant.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Whitelist des caractères autorisés</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Validation côté serveur obligatoire</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Échappement des caractères spéciaux</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Activity className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Rate Limiting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Limitez le nombre de requêtes par IP pour empêcher les abus et les attaques automatisées.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Limite par IP et par endpoint</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Bannissement temporaire des IPs abusives</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>CAPTCHA pour les comportements suspects</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Shield className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Headers de sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Configurez les headers HTTP de sécurité pour renforcer la protection de votre application.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Content-Security-Policy</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>X-Frame-Options</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Strict-Transport-Security</span>
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
              href="https://www.cloudflare.com/learning/ddos/glossary/web-application-firewall-waf/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-6 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg hover:from-blue-100 hover:to-slate-100 transition-all border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-800 mb-2">📚 Guide complet : Web Application Firewall (WAF)</h3>
                  <p className="text-slate-600 mb-2">
                    Apprenez tout sur les WAF et comment ils protègent vos applications web contre les attaques HTTP.
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

        {/* Best Practices */}
        <Card className="border-slate-200 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-800">Bonnes pratiques HTTP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Utiliser HTTPS pour toutes les communications",
                "Implémenter une authentification forte (OAuth, JWT)",
                "Valider toutes les entrées côté serveur",
                "Utiliser des tokens CSRF pour les formulaires",
                "Mettre à jour régulièrement les frameworks web",
                "Logger et monitorer toutes les requêtes suspectes"
              ].map((practice, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="text-green-600 mt-0.5">✓</div>
                  <span className="text-slate-700">{practice}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={goToSimulation}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Relancer un test
          </Button>

          <Button
            onClick={goHome}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
