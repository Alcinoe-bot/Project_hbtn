import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Network, Activity, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TcpFloodDefenseProps {
  setCurrentPage?: (page: string) => void;
}

export function TcpFloodDefense({ setCurrentPage }: TcpFloodDefenseProps) {
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
            <Network className="w-10 h-10 text-blue-600" />
            <h1 className="text-slate-800">Protection contre TCP/SYN Flood</h1>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Votre test TCP a révélé une vulnérabilité aux attaques SYN Flood. Ces attaques exploitent 
            le protocole de handshake TCP pour saturer votre serveur de connexions semi-ouvertes.
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="border-red-200 bg-red-50 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-red-900 mb-1">Vulnérabilité TCP/SYN Flood Détectée</h3>
                <p className="text-red-800">
                  Votre serveur est vulnérable aux attaques SYN Flood. Un attaquant peut saturer votre table 
                  de connexions TCP en envoyant des millions de requêtes SYN sans jamais compléter le handshake.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Qu'est-ce qu'un SYN Flood */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Qu'est-ce qu'une attaque SYN Flood ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                L'attaque SYN Flood exploite le handshake TCP en trois étapes :
              </p>
              <div className="bg-slate-100 p-4 rounded-lg mb-4 font-mono">
                <div className="text-slate-700">1. Client → Serveur : SYN</div>
                <div className="text-slate-700">2. Serveur → Client : SYN-ACK</div>
                <div className="text-red-600">3. Client → Serveur : ACK (jamais envoyé !)</div>
              </div>
              <ul className="space-y-2">
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Envoie des millions de paquets SYN</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>N'envoie jamais le ACK final</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Sature la table des connexions TCP</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Empêche les connexions légitimes</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Comment ça fonctionne */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-600" />
                Impact de l'attaque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                Le serveur maintient des connexions semi-ouvertes en attendant un ACK qui ne viendra jamais :
              </p>
              <ul className="space-y-2">
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span>Mémoire saturée par les connexions en attente</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span>CPU surchargé par la gestion des timeouts</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span>Service indisponible en quelques secondes</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-orange-600 mt-1">⚠</span>
                  <span>Facile à exécuter (outils automatisés)</span>
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
                <CardTitle className="text-slate-800">SYN Cookies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Méthode la plus efficace contre SYN Flood - évite de stocker les connexions semi-ouvertes.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Pas de stockage de connexion</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Calcul cryptographique stateless</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Activé par défaut sur Linux</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Network className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Firewall filtrage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Configurez votre firewall pour détecter et bloquer les patterns d'attaque.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Limite de paquets SYN par seconde</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Blacklist automatique des IPs abusives</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Géoblocage si nécessaire</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Activity className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Tuning du noyau</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Optimisez les paramètres TCP de votre système d'exploitation.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Augmenter tcp_max_syn_backlog</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Réduire tcp_syn_retries</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Activer tcp_syncookies</span>
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
              href="https://www.cloudflare.com/learning/ddos/syn-flood-ddos-attack/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-6 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg hover:from-blue-100 hover:to-slate-100 transition-all border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-800 mb-2">📚 Guide complet : Attaque SYN Flood</h3>
                  <p className="text-slate-600 mb-2">
                    Comprenez en détail comment fonctionnent les attaques SYN Flood et comment les mitiger efficacement.
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
            <CardTitle className="text-slate-800">Configuration Linux (sysctl)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono overflow-x-auto">
              <div># Activer SYN Cookies</div>
              <div>net.ipv4.tcp_syncookies = 1</div>
              <div className="mt-2"># Augmenter la file d'attente SYN</div>
              <div>net.ipv4.tcp_max_syn_backlog = 4096</div>
              <div className="mt-2"># Réduire les tentatives de retransmission</div>
              <div>net.ipv4.tcp_syn_retries = 2</div>
              <div>net.ipv4.tcp_synack_retries = 2</div>
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
