import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, User, BookOpen } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  visuel: { faible: boolean; moyen: boolean; parfait: boolean };
  auditif: { faible: boolean; moyen: boolean; parfait: boolean };
  kinesthesique: { faible: boolean; moyen: boolean; parfait: boolean };
  styleDominant: "visuel" | "auditif" | "kinesthesique" | "";
}

interface StyleApprentissageChartsProps {
  data: StudentData[];
}

const StyleApprentissageCharts = ({ data }: StyleApprentissageChartsProps) => {
  // Prepare data for pie chart (learning style distribution)
  const styleCount = data.reduce((acc, student) => {
    if (student.styleDominant) {
      acc[student.styleDominant] = (acc[student.styleDominant] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const globalResultData = [
    { name: "Visuel", value: styleCount.visuel || 0, color: "hsl(214 84% 56%)" },
    { name: "Auditif", value: styleCount.auditif || 0, color: "hsl(142 71% 45%)" },
    { name: "Kinesthésique", value: styleCount.kinesthesique || 0, color: "hsl(38 92% 50%)" }
  ].filter(item => item.value > 0);

  // Calculate average scores for each style
  const getAverageScore = (style: "visuel" | "auditif" | "kinesthesique") => {
    let totalScore = 0;
    let validCount = 0;

    data.forEach(student => {
      if (student[style]) {
        let score = 0;
        if (student[style].parfait) score = 100;
        else if (student[style].moyen) score = 50;
        else if (student[style].faible) score = 25;
        
        if (score > 0) {
          totalScore += score;
          validCount++;
        }
      }
    });

    return validCount > 0 ? Math.round(totalScore / validCount) : 0;
  };

  const detailedResults = [
    {
      style: "Visuel",
      average: getAverageScore("visuel"),
      color: "hsl(214 84% 56%)"
    },
    {
      style: "Auditif", 
      average: getAverageScore("auditif"),
      color: "hsl(142 71% 45%)"
    },
    {
      style: "Kinesthésique",
      average: getAverageScore("kinesthesique"),
      color: "hsl(38 92% 50%)"
    }
  ];

  // Generate summary for the class
  const generateClassSummary = () => {
    const totalStudents = data.length;
    const validStudents = data.filter(s => s.styleDominant);
    
    if (validStudents.length === 0) return "Aucun diagnostic complété.";

    const visuelCount = styleCount.visuel || 0;
    const auditifCount = styleCount.auditif || 0;
    const kinesthesiqueCount = styleCount.kinesthesique || 0;

    let summary = `Sur ${totalStudents} élève(s) évalué(s) : `;
    
    const results = [];
    if (visuelCount > 0) results.push(`${visuelCount} avec un style visuel`);
    if (auditifCount > 0) results.push(`${auditifCount} avec un style auditif`);
    if (kinesthesiqueCount > 0) results.push(`${kinesthesiqueCount} avec un style kinesthésique`);
    
    summary += results.join(", ") + ".";

    return summary;
  };

  const chartConfig = {
    style: {
      label: "Style d'apprentissage",
      color: "hsl(214 84% 56%)",
    },
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Class Summary Header */}
      <Card className="bg-gradient-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5" />
            Résultats de la classe ({data.length} élève{data.length > 1 ? "s" : ""})
          </CardTitle>
          <CardDescription>
            Diagnostic des styles d'apprentissage - Profils dominants identifiés
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Learning Style Distribution */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Répartition des styles d'apprentissage
            </CardTitle>
            <CardDescription>
              Distribution des styles dominants dans la classe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={globalResultData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {globalResultData.map((entry, index) => (
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

        {/* Bar Chart - Average Scores by Style */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Scores moyens par style
            </CardTitle>
            <CardDescription>
              Performance moyenne de la classe dans chaque style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detailedResults} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                  <XAxis 
                    dataKey="style" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-muted-foreground">
                              Score moyen: <span className="font-medium">{data.average}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="average" 
                    name="Score moyen"
                    radius={[4, 4, 0, 0]}
                    fill="hsl(214 84% 56%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Class Analysis Summary */}
      <Card className="shadow-medium border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-lg">Analyse de la classe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed">{generateClassSummary()}</p>
          
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Recommandations pédagogiques :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {(styleCount.visuel || 0) > 0 && (
                <li>Élèves visuels : Utilisez des supports visuels, schémas, graphiques et couleurs</li>
              )}
              {(styleCount.auditif || 0) > 0 && (
                <li>Élèves auditifs : Privilégiez les explications orales, discussions et supports audio</li>
              )}
              {(styleCount.kinesthesique || 0) > 0 && (
                <li>Élèves kinesthésiques : Intégrez des activités pratiques, manipulations et mouvement</li>
              )}
              <li>Varier les méthodes d'enseignement pour toucher tous les profils</li>
              <li>Créer des activités multisensorielles pour optimiser l'apprentissage</li>
            </ul>
          </div>

          {/* Individual Students List */}
          {data.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-semibold mb-3">Détail par élève :</h4>
              <div className="grid gap-2">
                {data.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="font-medium">{student.name || "Sans nom"}</span>
                    {student.styleDominant && (
                      <Badge
                        variant="secondary"
                        className={`
                          ${student.styleDominant === "visuel" ? "bg-primary/20 text-primary" : ""}
                          ${student.styleDominant === "auditif" ? "bg-success/20 text-success" : ""}
                          ${student.styleDominant === "kinesthesique" ? "bg-warning/20 text-warning" : ""}
                        `}
                      >
                        {student.styleDominant.charAt(0).toUpperCase() + student.styleDominant.slice(1)}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleApprentissageCharts;