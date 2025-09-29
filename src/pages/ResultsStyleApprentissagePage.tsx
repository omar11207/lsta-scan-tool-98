import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import StyleApprentissageCharts from "@/components/StyleApprentissageCharts";
import { ArrowLeft, Share, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentData {
  id: string;
  name: string;
  visuel: { faible: boolean; moyen: boolean; parfait: boolean };
  auditif: { faible: boolean; moyen: boolean; parfait: boolean };
  kinesthesique: { faible: boolean; moyen: boolean; parfait: boolean };
  styleDominant: "visuel" | "auditif" | "kinesthesique" | "";
}

const ResultsStyleApprentissagePage = () => {
  const [data, setData] = useState<StudentData[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('styleApprentissageResults');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Résultats diagnostic - Style d'apprentissage`,
        text: `Résultats du diagnostic LSTA Academy pour les styles d'apprentissage`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien vers les résultats a été copié dans le presse-papiers",
      });
    }
  };

  const handleDownload = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "Le téléchargement des résultats sera bientôt disponible",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/20 to-success-soft/20 py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Résultats - Style d'apprentissage
                </CardTitle>
                <CardDescription className="text-lg">
                  Analyse des styles d'apprentissage dominants de la classe
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share className="w-4 h-4" />
                  Partager
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Results Charts */}
        <StyleApprentissageCharts data={data} />

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/diagnostic/style-apprentissage')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Nouveau diagnostic
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-primary hover:opacity-90"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsStyleApprentissagePage;