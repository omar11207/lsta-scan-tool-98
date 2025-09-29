import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Brain, BookOpen, Users, Home, Heart, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import GlobalResultsCharts from "@/components/GlobalResultsCharts";

interface GlobalData {
  rythme?: any[];
  styleApprentissage?: any[];
  intelligencesMultiples?: any[];
  soutienFamilial?: any[];
  motivationParticipation?: any[];
}

const GlobalResultsPage = () => {
  const [globalData, setGlobalData] = useState<GlobalData>({});
  const [savedDiagnostics, setSavedDiagnostics] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Récupérer tous les résultats des diagnostics
    const data: GlobalData = {};
    
    const rythmeData = localStorage.getItem('diagnosticResults');
    if (rythmeData) data.rythme = JSON.parse(rythmeData);
    
    const styleData = localStorage.getItem('styleApprentissageResults');
    if (styleData) data.styleApprentissage = JSON.parse(styleData);
    
    const intelligencesData = localStorage.getItem('intelligencesMultiplesResults');
    if (intelligencesData) data.intelligencesMultiples = JSON.parse(intelligencesData);
    
    const soutienData = localStorage.getItem('soutienFamilialResults');
    if (soutienData) data.soutienFamilial = JSON.parse(soutienData);
    
    const motivationData = localStorage.getItem('motivationParticipationResults');
    if (motivationData) data.motivationParticipation = JSON.parse(motivationData);

    setGlobalData(data);

    // Récupérer les diagnostics sauvegardés
    const saved = localStorage.getItem('savedDiagnostics');
    if (saved) {
      setSavedDiagnostics(JSON.parse(saved));
    }
  }, []);


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Résultats globaux - Classe`,
        text: `Résultats globaux LSTA Academy pour la classe`,
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

  const getTotalStudents = () => {
    const allStudents = new Set();
    Object.values(globalData).forEach(results => {
      if (results) {
        results.forEach((student: any) => allStudents.add(student.name));
      }
    });
    return allStudents.size;
  };

  const getDiagnosticCount = () => {
    return Object.keys(globalData).filter(key => globalData[key as keyof GlobalData]).length;
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
                  Résultats Globaux - Niveau 5
                </CardTitle>
                <CardDescription className="text-lg">
                  Vue d'ensemble des diagnostics réalisés pour le niveau 5
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


        {/* Global Statistics */}
        <div id="global-results">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Statistiques Globales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{getTotalStudents()}</div>
                  <div className="text-sm text-muted-foreground">Élèves évalués</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{getDiagnosticCount()}</div>
                  <div className="text-sm text-muted-foreground">Diagnostics réalisés</div>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">5</div>
                  <div className="text-sm text-muted-foreground">Types de diagnostics</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts and Detailed Analysis */}
          {Object.keys(globalData).length > 0 && (
            <div className="mb-6">
              <GlobalResultsCharts data={globalData} />
            </div>
          )}

          {/* Detailed Analysis by Diagnostic Type */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {globalData.rythme && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Rythme d'apprentissage
                  </CardTitle>
                  <CardDescription>
                    Analyse de la vitesse d'apprentissage des élèves
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {globalData.rythme.map((student: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Score global: {((student.frenchReading?.correct ? 100 : student.frenchReading?.partiel ? 50 : 0) + 
                                          (student.frenchCalcul?.correct ? 100 : student.frenchCalcul?.partiel ? 50 : 0) + 
                                          (student.frenchWriting?.oui ? 100 : student.frenchWriting?.incomplet ? 50 : 0) + 
                                          (student.arabicReading?.correct ? 100 : student.arabicReading?.partiel ? 50 : 0)) / 4}%
                          </div>
                        </div>
                        <Badge
                          className={`
                            ${student.finalCategory === "rapide" ? "bg-success/20 text-success" : ""}
                            ${student.finalCategory === "normal" ? "bg-primary/20 text-primary" : ""}
                            ${student.finalCategory === "lent" ? "bg-warning/20 text-warning" : ""}
                          `}
                        >
                          {student.finalCategory?.charAt(0).toUpperCase() + student.finalCategory?.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {globalData.styleApprentissage && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Style d'apprentissage
                  </CardTitle>
                  <CardDescription>
                    Identification des préférences d'apprentissage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {globalData.styleApprentissage.map((student: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Profil dominant identifié
                          </div>
                        </div>
                        <Badge className="bg-primary/20 text-primary">
                          {student.styleDominant || "Non défini"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {globalData.intelligencesMultiples && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Intelligences multiples
                  </CardTitle>
                  <CardDescription>
                    Découverte des intelligences dominantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {globalData.intelligencesMultiples.map((student: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Intelligence dominante
                          </div>
                        </div>
                        <Badge className="bg-primary/20 text-primary text-xs">
                          {student.profilDominant || "Non défini"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {globalData.soutienFamilial && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Soutien familial
                  </CardTitle>
                  <CardDescription>
                    Évaluation du support familial disponible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {globalData.soutienFamilial.map((student: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Niveau de soutien disponible
                          </div>
                        </div>
                        <Badge
                          className={`
                            ${student.niveauSoutien === "fort" ? "bg-success/20 text-success" : ""}
                            ${student.niveauSoutien === "moyen" ? "bg-primary/20 text-primary" : ""}
                            ${student.niveauSoutien === "faible" ? "bg-warning/20 text-warning" : ""}
                          `}
                        >
                          {student.niveauSoutien?.charAt(0).toUpperCase() + student.niveauSoutien?.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {globalData.motivationParticipation && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Motivation et participation
                  </CardTitle>
                  <CardDescription>
                    Mesure de l'engagement des élèves
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {globalData.motivationParticipation.map((student: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Niveau d'engagement global
                          </div>
                        </div>
                        <Badge
                          className={`
                            ${student.niveauGlobal === "haute" ? "bg-success/20 text-success" : ""}
                            ${student.niveauGlobal === "moyenne" ? "bg-primary/20 text-primary" : ""}
                            ${student.niveauGlobal === "basse" ? "bg-warning/20 text-warning" : ""}
                          `}
                        >
                          {student.niveauGlobal?.charAt(0).toUpperCase() + student.niveauGlobal?.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlobalResultsPage;