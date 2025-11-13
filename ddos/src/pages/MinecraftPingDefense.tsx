import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, Gamepad2, Network, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MinecraftPingDefenseProps {
  setCurrentPage?: (page: string) => void;
}

export function MinecraftPingDefense({ setCurrentPage }: MinecraftPingDefenseProps) {
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
            <Gamepad2 className="w-10 h-10 text-blue-600" />
            <h1 className="text-slate-800">Protection contre les attaques Ping</h1>
          </div>
          <p className="text-slate-600 max-w-3xl">
            Votre test ping a révélé une vulnérabilité aux attaques par flood ICMP et UDP. Ces attaques 
            peuvent saturer votre bande passante et rendre votre serveur inaccessible.
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="border-red-200 bg-red-50 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
              <div>
                <h3 className="text-red-900 mb-1">Vulnérabilité Ping Flood Détectée</h3>
                <p className="text-red-800">
                  Votre serveur est vulnérable aux attaques ping flood. Un attaquant peut saturer votre 
                  connexion réseau en envoyant massivement des paquets ICMP ou des requêtes de status.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Qu'est-ce qu'un Ping Flood */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Qu'est-ce qu'une attaque Ping Flood ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Les attaques ping flood exploitent les protocoles réseau de base :
              </p>
              <ul className="space-y-2">
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span><strong>ICMP Flood :</strong> Millions de paquets ping</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span><strong>UDP Flood :</strong> Paquets UDP vers ports aléatoires</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span><strong>Minecraft Ping :</strong> Requêtes de status serveur</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Saturation de la bande passante</span>
                </li>
                <li className="text-slate-600 flex items-start gap-2">
                  <span className="text-red-600 mt-1">•</span>
                  <span>Surcharge du serveur et du routeur</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Cas spécifique Minecraft */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-600" />
                Cas spécifique : Serveurs Minecraft
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">
                Les serveurs Minecraft sont particulièrement vulnérables :
              </p>
              <ul className="space-y-2">
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">⚠</span>
                  <span>Requêtes de status (Server List Ping)</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">⚠</span>
                  <span>Bots envoyant des milliers de pings/sec</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">⚠</span>
                  <span>Crash du serveur ou lag extrême</span>
                </li>
                <li className="text-slate-700 flex items-start gap-2">
                  <span className="text-purple-600 mt-1">⚠</span>
                  <span>IP exposée publiquement</span>
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
                <CardTitle className="text-slate-800">Règles Firewall</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Configurez votre firewall pour limiter les paquets ICMP et UDP.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Limiter ICMP à 1-5 paquets/sec par IP</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Bloquer les paquets fragmentés suspects</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Géoblocage des régions non utilisées</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Network className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Rate Limiting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Limitez le nombre de requêtes acceptées par IP et par seconde.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Max 10 pings par IP par seconde</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Ban temporaire si dépassement</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Whitelist pour IPs de confiance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <Gamepad2 className="w-8 h-8 text-blue-600 mb-3" />
                <CardTitle className="text-slate-800">Protection Minecraft</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-3">
                  Solutions spécifiques pour serveurs de jeux.
                </p>
                <ul className="space-y-1">
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Utiliser un proxy (BungeeCord, Velocity)</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>Masquer l'IP réelle du serveur</span>
                  </li>
                  <li className="text-slate-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>AntiBot plugins (AntiAttackRL, etc.)</span>
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
              href="https://www.spigotmc.org/wiki/firewall-guide/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-6 bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg hover:from-blue-100 hover:to-slate-100 transition-all border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-slate-800 mb-2">📚 Guide : Configuration Firewall pour serveurs Minecraft</h3>
                  <p className="text-slate-600 mb-2">
                    Guide complet pour sécuriser votre serveur Minecraft contre les attaques DDoS et ping flood.
                  </p>
                  <p className="text-blue-600">Spigot Wiki →</p>
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
            <CardTitle className="text-slate-800">Exemples de configuration Firewall</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-slate-700 mb-2">iptables (Linux)</h4>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono overflow-x-auto">
                  <div># Limiter ICMP ping à 1/seconde</div>
                  <div>iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT</div>
                  <div>iptables -A INPUT -p icmp --icmp-type echo-request -j DROP</div>
                  <div className="mt-2"># Limiter connexions UDP (Minecraft)</div>
                  <div>iptables -A INPUT -p udp --dport 25565 -m state --state NEW -m recent --set</div>
                  <div>iptables -A INPUT -p udp --dport 25565 -m state --state NEW -m recent --update --seconds 1 --hitcount 10 -j DROP</div>
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
                "Ne jamais exposer l'IP réelle publiquement",
                "Utiliser un reverse proxy ou CDN",
                "Activer la protection DDoS de votre hébergeur",
                "Monitorer le trafic réseau en temps réel",
                "Mettre en place des alertes automatiques",
                "Garder des backups réguliers"
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
