import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, User, BarChart3, Activity } from "lucide-react";

interface GlobalData {
  rythme?: any[];
  styleApprentissage?: any[];
  intelligencesMultiples?: any[];
  soutienFamilial?: any[];
  motivationParticipation?: any[];
}

interface GlobalResultsChartsProps {
  data: GlobalData;
}

const GlobalResultsCharts = ({ data }: GlobalResultsChartsProps) => {
  // Get total students across all diagnostics
  const getTotalStudents = () => {
    const allStudents = new Set();
    Object.values(data).forEach(results => {
      if (results) {
        results.forEach((student: any) => allStudents.add(student.name));
      }
    });
    return allStudents.size;
  };

  // Get diagnostic completion data
  const getDiagnosticCompletionData = () => {
    const diagnostics = [
      { name: "Rythme d'apprentissage", completed: data.rythme?.length || 0, color: "hsl(214 84% 56%)" },
      { name: "Style d'apprentissage", completed: data.styleApprentissage?.length || 0, color: "hsl(142 71% 45%)" },
      { name: "Intelligences multiples", completed: data.intelligencesMultiples?.length || 0, color: "hsl(38 92% 50%)" },
      { name: "Soutien familial", completed: data.soutienFamilial?.length || 0, color: "hsl(195 12% 94%)" },
      { name: "Motivation", completed: data.motivationParticipation?.length || 0, color: "hsl(195 12% 94%)" }
    ];
    return diagnostics.filter(d => d.completed > 0);
  };

  // Generate radar chart data for overall class profile
  const getRadarData = () => {
    const radarData = [];
    
    if (data.rythme) {
      const rapideCount = data.rythme.filter((s: any) => s.finalCategory === "rapide").length;
      const total = data.rythme.length;
      radarData.push({
        subject: "Rythme rapide",
        score: total > 0 ? Math.round((rapideCount / total) * 100) : 0,
        fullMark: 100
      });
    }

    if (data.motivationParticipation) {
      const hauteCount = data.motivationParticipation.filter((s: any) => s.niveauGlobal === "haute").length;
      const total = data.motivationParticipation.length;
      radarData.push({
        subject: "Motivation haute",
        score: total > 0 ? Math.round((hauteCount / total) * 100) : 0,
        fullMark: 100
      });
    }

    if (data.soutienFamilial) {
      const fortCount = data.soutienFamilial.filter((s: any) => s.niveauSoutien === "fort").length;
      const total = data.soutienFamilial.length;
      radarData.push({
        subject: "Soutien fort",
        score: total > 0 ? Math.round((fortCount / total) * 100) : 0,
        fullMark: 100
      });
    }

    if (data.styleApprentissage) {
      const visuelCount = data.styleApprentissage.filter((s: any) => s.styleDominant === "visuel").length;
      const total = data.styleApprentissage.length;
      radarData.push({
        subject: "Style visuel",
        score: total > 0 ? Math.round((visuelCount / total) * 100) : 0,
        fullMark: 100
      });
    }

    return radarData;
  };

  // Generate summary
  const generateGlobalSummary = () => {
    const totalStudents = getTotalStudents();
    const completedDiagnostics = Object.keys(data).filter(key => data[key as keyof GlobalData]).length;
    
    if (totalStudents === 0) return "Aucun diagnostic disponible.";
    
    return `Analyse globale de ${totalStudents} élève(s) avec ${completedDiagnostics} type(s) de diagnostic réalisé(s). Les données permettent une vue d'ensemble des profils d'apprentissage de la classe.`;
  };

  const chartConfig = {
    global: {
      label: "Analyse globale",
      color: "hsl(214 84% 56%)",
    },
  };

  const completionData = getDiagnosticCompletionData();
  const radarData = getRadarData();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Global Summary Header */}
      <Card className="bg-gradient-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5" />
            Vue d'ensemble - Analyse globale ({getTotalStudents()} élève{getTotalStudents() > 1 ? "s" : ""})
          </CardTitle>
          <CardDescription>
            Synthèse de tous les diagnostics réalisés pour la classe
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Diagnostic Completion */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Diagnostics réalisés
            </CardTitle>
            <CardDescription>
              Répartition des diagnostics complétés par type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="completed"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Radar Chart - Class Profile */}
        {radarData.length > 0 && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Profil global de la classe
              </CardTitle>
              <CardDescription>
                Vue radar des caractéristiques dominantes (en %)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(214 84% 56%)"
                      fill="hsl(214 84% 56%)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Bar Chart - Completion Stats */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Nombre d'élèves par diagnostic
            </CardTitle>
            <CardDescription>
              Statistiques de participation aux différents diagnostics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={completionData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              Élèves diagnostiqués: <span className="font-medium">{data.completed}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="completed" 
                    name="Élèves"
                    radius={[4, 4, 0, 0]}
                    fill="hsl(214 84% 56%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Global Analysis Summary */}
      <Card className="shadow-medium border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-lg">Synthèse globale</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">{generateGlobalSummary()}</p>
          
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Recommandations générales :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Utiliser les résultats croisés pour créer des groupes d'apprentissage optimaux</li>
              <li>Adapter les méthodes pédagogiques aux profils identifiés</li>
              <li>Mettre en place un accompagnement différencié selon les besoins</li>
              <li>Suivre l'évolution des élèves sur plusieurs diagnostics</li>
              <li>Impliquer les familles selon leur niveau de soutien disponible</li>
              <li>Valoriser la diversité des profils comme richesse de la classe</li>
            </ul>
          </div>

          {/* Statistics Grid */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold mb-3">Statistiques détaillées :</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {completionData.map((diagnostic, index) => (
                <div key={index} className="text-center p-3 bg-muted/20 rounded-lg">
                  <div className="text-lg font-bold" style={{ color: diagnostic.color }}>
                    {diagnostic.completed}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {diagnostic.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalResultsCharts;