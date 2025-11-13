import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Zap, Server, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface HttpFloodDefenseProps {
  setCurrentPage?: (page: string) => void;
}

export function HttpFloodDefense({ setCurrentPage }: HttpFloodDefenseProps) {
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
            <Zap className="w-10 h-10 text-blue-600" />
            <h1 className="text-slate-800">Protection contre HTTP Flood</h1>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Votre test HTTP Flood a révélé une vulnérabilité. Cette attaque volumétrique submerge votre 
            serveur avec des milliers de requêtes HTTP GET/POST légitimes pour épuiser ses ressources.
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="border-red-200 bg-red-50 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-red-900 mb-1">Vulnérabilité HTTP Flood Détectée</h3>
                <p className="text-red-800">
                  Votre serveur web est vulnérable aux attaques HTTP Flood. Un attaquant peut envoyer des 
                  millions de requêtes HTTP valides pour saturer vos ressources CPU, mémoire et bande passante.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Qu'est-ce qu'une attaque HTTP Flood */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Qu'est-ce qu'une attaque HTTP Flood ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                HTTP Flood est une attaque DDoS de la couche 7 qui exploite des requêtes HTTP valides :
              </p>
              <ul className="space-y-2">
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span><strong>GET Flood :</strong> Millions de requêtes GET vers des pages lourdes</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span><strong>POST Flood :</strong> Envoi massif de formulaires et données</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Requêtes semblent légitimes (difficile à filtrer)</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Sature CPU, mémoire et base de données</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Serveur inaccessible en quelques minutes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Différence avec autres attaques HTTP */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Pourquoi c'est dangereux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                HTTP Flood est particulièrement difficile à bloquer car :
              </p>
              <ul className="space-y-2">
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">⚠</span>
                  <span>Requêtes HTTP valides et bien formées</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">⚠</span>
                  <span>Impossible à distinguer du trafic légitime</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">⚠</span>
                  <span>Cible les ressources serveur intensives (DB, API)</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">⚠</span>
                  <span>Utilisation de botnets pour distribuer l'attaque</span>
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
                <Shield className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Rate Limiting avancé</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Limitez strictement le nombre de requêtes par IP et par session.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Limite par IP : 10-50 req/seconde</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Limite par endpoint (API, formulaires)</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Bannissement temporaire automatique</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">CDN & Caching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Utilisez un CDN pour absorber le trafic malveillant avant qu'il n'atteigne votre serveur.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Cloudflare, AWS CloudFront, Akamai</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Cache agressif des pages statiques</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Protection DDoS automatique</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Server className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Challenge-Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Vérifiez que les clients sont réels avec des challenges JavaScript ou CAPTCHA.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>JavaScript Challenge (Cloudflare)</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>CAPTCHA pour comportements suspects</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Cookie/Token de validation</span>
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
              href="https://www.cloudflare.com/learning/ddos/http-flood-ddos-attack/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-6 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg hover:from-blue-100 hover:to-slate-100 transition-all border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-800 mb-2">📚 Guide complet : HTTP Flood Attack</h3>
                  <p className="text-slate-600 mb-2">
                    Apprenez tout sur les attaques HTTP Flood et les meilleures stratégies de mitigation.
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

        {/* Advanced Strategies */}
        <div className="mb-8">
          <h2 className="text-slate-800 mb-6">Stratégies avancées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Analyse comportementale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Détectez les patterns anormaux pour identifier les bots :
                </p>
                <ul className="space-y-2">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Analyse du User-Agent et fingerprinting</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Détection de patterns de navigation suspects</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Machine Learning pour identifier les bots</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Scoring de réputation des IPs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-800">Optimisation serveur</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Renforcez votre infrastructure pour résister aux pics de trafic :
                </p>
                <ul className="space-y-2">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Auto-scaling horizontal (plus de serveurs)</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Load balancer avec health checks</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Optimisation des requêtes base de données</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Cache Redis/Memcached pour réduire la charge</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Configuration Examples */}
        <Card className="border-slate-200 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-800">Exemples de configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-slate-700 mb-2">Nginx Rate Limiting</h4>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono overflow-x-auto">
                  <div># Définir une zone de rate limiting</div>
                  <div>limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;</div>
                  <div className="mt-2"># Appliquer aux locations</div>
                  <div>location / {'{'}</div>
                  <div>    limit_req zone=one burst=20 nodelay;</div>
                  <div>    limit_req_status 429;</div>
                  <div>{'}'}</div>
                </div>
              </div>
              <div>
                <h4 className="text-slate-700 mb-2">iptables (Protection réseau)</h4>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono overflow-x-auto">
                  <div># Limiter les connexions HTTP par IP</div>
                  <div>iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 20 -j REJECT</div>
                  <div>iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 20 -j REJECT</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="border-slate-200 mb-8">
          <CardHeader>
            <CardTitle className="text-slate-800">Bonnes pratiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Utiliser un CDN avec protection DDoS intégrée",
                "Implémenter un rate limiting agressif",
                "Monitorer les métriques en temps réel (CPU, RAM, requêtes/sec)",
                "Mettre en place des alertes automatiques",
                "Avoir un plan de réponse aux incidents DDoS",
                "Tester régulièrement la résilience avec des stress tests",
                "Utiliser HTTPS pour toutes les communications",
                "Implémenter une WAF (Web Application Firewall)"
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
