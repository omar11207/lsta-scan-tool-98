import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, User, Heart } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  niveauGlobal: "haute" | "moyenne" | "basse" | "";
}

interface MotivationParticipationChartsProps {
  data: StudentData[];
}

const MotivationParticipationCharts = ({ data }: MotivationParticipationChartsProps) => {
  // Prepare data for pie chart (motivation distribution)
  const motivationCount = data.reduce((acc, student) => {
    if (student.niveauGlobal) {
      acc[student.niveauGlobal] = (acc[student.niveauGlobal] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const globalResultData = [
    { name: "Motivation haute", value: motivationCount.haute || 0, color: "hsl(var(--success))" },
    { name: "Motivation moyenne", value: motivationCount.moyenne || 0, color: "hsl(var(--primary))" },
    { name: "Motivation basse", value: motivationCount.basse || 0, color: "hsl(var(--warning))" }
  ].filter(item => item.value > 0);

  // Generate summary for the class
  const generateClassSummary = () => {
    const totalStudents = data.length;
    const validStudents = data.filter(s => s.niveauGlobal);
    
    if (validStudents.length === 0) return "Aucun diagnostic complété.";

    const hauteCount = motivationCount.haute || 0;
    const moyenneCount = motivationCount.moyenne || 0;
    const basseCount = motivationCount.basse || 0;

    let summary = `Sur ${totalStudents} élève(s) évalué(s) : `;
    
    const results = [];
    if (hauteCount > 0) results.push(`${hauteCount} avec une motivation haute`);
    if (moyenneCount > 0) results.push(`${moyenneCount} avec une motivation moyenne`);
    if (basseCount > 0) results.push(`${basseCount} avec une motivation basse`);
    
    summary += results.join(", ") + ".";

    return summary;
  };

  const chartConfig = {
    niveau: {
      label: "Niveau de motivation",
      color: "hsl(var(--primary))",
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
            Diagnostic de motivation et participation - Niveaux d'engagement identifiés
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Motivation Distribution */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Répartition de la motivation
            </CardTitle>
            <CardDescription>
              Distribution des niveaux de motivation dans la classe
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

        {/* Bar Chart - Motivation Levels */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Niveaux de motivation
            </CardTitle>
            <CardDescription>
              Répartition quantitative de l'engagement des élèves
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={globalResultData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
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
                              Nombre d'élèves: <span className="font-medium">{data.value}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Nombre"
                    radius={[4, 4, 0, 0]}
                    fill="hsl(var(--primary))"
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
            <h4 className="font-semibold mb-2">Stratégies de motivation :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {(motivationCount.haute || 0) > 0 && (
                <li>Élèves très motivés : Maintenir l'engagement par des défis adaptés et la responsabilisation</li>
              )}
              {(motivationCount.moyenne || 0) > 0 && (
                <li>Élèves moyennement motivés : Varier les activités et renforcer les encouragements positifs</li>
              )}
              {(motivationCount.basse || 0) > 0 && (
                <li>Élèves peu motivés : Identifier les causes et mettre en place un accompagnement personnalisé</li>
              )}
              <li>Créer un environnement d'apprentissage stimulant et bienveillant</li>
              <li>Valoriser les progrès individuels et collectifs</li>
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
                    {student.niveauGlobal && (
                      <Badge
                        variant="secondary"
                        className={`
                          ${student.niveauGlobal === "haute" ? "bg-success/20 text-success" : ""}
                          ${student.niveauGlobal === "moyenne" ? "bg-primary/20 text-primary" : ""}
                          ${student.niveauGlobal === "basse" ? "bg-warning/20 text-warning" : ""}
                        `}
                      >
                        {student.niveauGlobal.charAt(0).toUpperCase() + student.niveauGlobal.slice(1)}
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

export default MotivationParticipationCharts;