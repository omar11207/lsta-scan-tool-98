import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResultsCharts from "@/components/ResultsCharts";
import { ArrowLeft, Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentData {
  id: string;
  name: string;
  frenchReading: { correct: boolean; partiel: boolean; faux: boolean };
  frenchCalcul: { correct: boolean; partiel: boolean; faux: boolean };
  frenchWriting: { oui: boolean; incomplet: boolean };
  arabicReading: { correct: boolean; partiel: boolean; wrong: boolean };
  finalCategory: "rapide" | "normal" | "lent" | "";
}

const ResultsPage = () => {
  const [studentsData, setStudentsData] = useState<StudentData[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('diagnosticResults');
    if (savedData) {
      setStudentsData(JSON.parse(savedData));
    } else {
      // Redirect if no data found
      navigate('/');
    }
  }, [navigate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Résultats diagnostic - Classe`,
        text: `Résultats du diagnostic LSTA Academy pour la classe`,
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

  if (studentsData.length === 0) {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/20 to-success-soft/20 py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Résultats du Diagnostic
                </CardTitle>
                <CardDescription className="text-lg">
                  LSTA Academy - Évaluation du rythme d'apprentissage
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
        <ResultsCharts data={studentsData} />

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/diagnostic/rythme')}
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

export default ResultsPage;