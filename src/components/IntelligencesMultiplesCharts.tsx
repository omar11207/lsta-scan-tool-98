import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, User, Brain } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  profilDominant: string;
}

interface IntelligencesMultiplesChartsProps {
  data: StudentData[];
}

const IntelligencesMultiplesCharts = ({ data }: IntelligencesMultiplesChartsProps) => {
  // Prepare data for pie chart (intelligence distribution)
  const intelligenceCount = data.reduce((acc, student) => {
    if (student.profilDominant) {
      acc[student.profilDominant] = (acc[student.profilDominant] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(intelligenceCount).map(([key, value], index) => ({
    name: key,
    value,
    color: [
      "hsl(var(--primary))",
      "hsl(var(--success))", 
      "hsl(var(--warning))",
      "hsl(var(--secondary))",
      "hsl(var(--accent))"
    ][index % 5]
  }));

  // Generate summary for the class
  const generateClassSummary = () => {
    const totalStudents = data.length;
    const validStudents = data.filter(s => s.profilDominant);
    
    if (validStudents.length === 0) return "Aucun diagnostic complété.";

    const mostCommon = Object.entries(intelligenceCount).sort(([,a], [,b]) => b - a)[0];
    const diversityCount = Object.keys(intelligenceCount).length;

    return `Sur ${totalStudents} élève(s) évalué(s), ${diversityCount} type(s) d'intelligence différent(s) identifié(s). L'intelligence ${mostCommon?.[0]} est la plus représentée avec ${mostCommon?.[1]} élève(s).`;
  };

  const chartConfig = {
    intelligence: {
      label: "Intelligence",
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
            Diagnostic des intelligences multiples - Profils dominants identifiés
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Intelligence Distribution */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Répartition des intelligences
            </CardTitle>
            <CardDescription>
              Distribution des intelligences dominantes dans la classe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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

        {/* Bar Chart - Intelligence Counts */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Nombre d'élèves par intelligence
            </CardTitle>
            <CardDescription>
              Comptage des élèves pour chaque type d'intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pieData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
            <h4 className="font-semibold mb-2">Recommandations générales :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Adaptez les méthodes d'enseignement selon les intelligences dominantes</li>
              <li>Encouragez le développement des intelligences secondaires</li>
              <li>Variez les supports et activités pédagogiques</li>
              <li>Créez des groupes de travail complémentaires</li>
              <li>Exploitez la diversité des profils pour l'apprentissage coopératif</li>
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
                    {student.profilDominant && (
                      <Badge variant="secondary" className="bg-primary/20 text-primary">
                        {student.profilDominant}
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

export default IntelligencesMultiplesCharts;