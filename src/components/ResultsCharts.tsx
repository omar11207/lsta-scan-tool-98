import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, User, BookOpen } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  frenchReading: { correct: boolean; partiel: boolean; faux: boolean };
  frenchCalcul: { correct: boolean; partiel: boolean; faux: boolean };
  frenchWriting: { oui: boolean; incomplet: boolean };
  arabicReading: { correct: boolean; partiel: boolean; wrong: boolean };
  finalCategory: "rapide" | "normal" | "lent" | "";
}

interface ResultsChartsProps {
  data: StudentData[];
}

const ResultsCharts = ({ data }: ResultsChartsProps) => {
  // Prepare data for pie chart (global result distribution)
  const categoryCount = data.reduce((acc, student) => {
    if (student.finalCategory) {
      acc[student.finalCategory] = (acc[student.finalCategory] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const globalResultData = [
    { name: "Rapide", value: categoryCount.rapide || 0, color: "hsl(142 71% 45%)" },
    { name: "Normal", value: categoryCount.normal || 0, color: "hsl(214 84% 56%)" },
    { name: "Lent", value: categoryCount.lent || 0, color: "hsl(38 92% 50%)" }
  ].filter(item => item.value > 0);

  // Prepare data for bar chart (overall performance by subject)
  const getAverageScore = (students: StudentData[], subject: string) => {
    let totalScore = 0;
    let validCount = 0;

    students.forEach(student => {
      let score = 0;
      let hasData = false;

      switch (subject) {
        case "Français Lecture":
          if (student.frenchReading.correct) { score = 100; hasData = true; }
          else if (student.frenchReading.partiel) { score = 50; hasData = true; }
          else if (student.frenchReading.faux) { score = 0; hasData = true; }
          break;
        case "Français Calcul":
          if (student.frenchCalcul.correct) { score = 100; hasData = true; }
          else if (student.frenchCalcul.partiel) { score = 50; hasData = true; }
          else if (student.frenchCalcul.faux) { score = 0; hasData = true; }
          break;
        case "Français Écriture":
          if (student.frenchWriting.oui) { score = 100; hasData = true; }
          else if (student.frenchWriting.incomplet) { score = 50; hasData = true; }
          break;
        case "Arabe Lecture":
          if (student.arabicReading.correct) { score = 100; hasData = true; }
          else if (student.arabicReading.partiel) { score = 50; hasData = true; }
          else if (student.arabicReading.wrong) { score = 0; hasData = true; }
          break;
      }

      if (hasData) {
        totalScore += score;
        validCount++;
      }
    });

    return validCount > 0 ? Math.round(totalScore / validCount) : 0;
  };

  const detailedResults = [
    {
      subject: "Français Lecture",
      average: getAverageScore(data, "Français Lecture"),
      color: "hsl(214 84% 56%)"
    },
    {
      subject: "Français Calcul",
      average: getAverageScore(data, "Français Calcul"),
      color: "hsl(214 84% 56%)"
    },
    {
      subject: "Français Écriture",
      average: getAverageScore(data, "Français Écriture"),
      color: "hsl(214 84% 56%)"
    },
    {
      subject: "Arabe Lecture",
      average: getAverageScore(data, "Arabe Lecture"),
      color: "hsl(142 71% 45%)"
    }
  ];

  // Generate summary for the class
  const generateClassSummary = () => {
    const totalStudents = data.length;
    const validStudents = data.filter(s => s.finalCategory);
    
    if (validStudents.length === 0) return "Aucun diagnostic complété.";

    const rapidCount = categoryCount.rapide || 0;
    const normalCount = categoryCount.normal || 0;
    const lentCount = categoryCount.lent || 0;

    let summary = `Sur ${totalStudents} élève(s) évalué(s) : `;
    
    const results = [];
    if (rapidCount > 0) results.push(`${rapidCount} avec un rythme rapide`);
    if (normalCount > 0) results.push(`${normalCount} avec un rythme normal`);
    if (lentCount > 0) results.push(`${lentCount} avec un rythme lent`);
    
    summary += results.join(", ") + ".";

    return summary;
  };

  const chartConfig = {
    average: {
      label: "Moyenne",
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
            Diagnostic du rythme d'apprentissage - CM2 / 5ᵉ AEP
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Global Result */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Répartition des rythmes d'apprentissage
            </CardTitle>
            <CardDescription>
              Distribution des catégories dans la classe
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

        {/* Bar Chart - Detailed Results */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Moyennes par matière
            </CardTitle>
            <CardDescription>
              Performance moyenne de la classe dans chaque domaine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detailedResults} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                  <XAxis 
                    dataKey="subject" 
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
                              Moyenne de la classe: <span className="font-medium">{data.average}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="average" 
                    name="Moyenne"
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
            <h4 className="font-semibold mb-2">Recommandations générales :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {(categoryCount.rapide || 0) > 0 && (
                <li>Élèves rapides : Proposer des activités d'enrichissement et encourager le tutorat</li>
              )}
              {(categoryCount.normal || 0) > 0 && (
                <li>Élèves au rythme normal : Maintenir le suivi régulier et renforcer les points faibles</li>
              )}
              {(categoryCount.lent || 0) > 0 && (
                <li>Élèves au rythme lent : Adapter le rythme avec plus de temps, répétitions et supports visuels</li>
              )}
              <li>Organiser des groupes de travail selon les rythmes d'apprentissage</li>
              <li>Proposer un accompagnement personnalisé pour les élèves en difficulté</li>
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
                    {student.finalCategory && (
                      <Badge
                        variant="secondary"
                        className={`
                          ${student.finalCategory === "rapide" ? "bg-success/20 text-success" : ""}
                          ${student.finalCategory === "normal" ? "bg-primary/20 text-primary" : ""}
                          ${student.finalCategory === "lent" ? "bg-warning/20 text-warning" : ""}
                        `}
                      >
                        {student.finalCategory.charAt(0).toUpperCase() + student.finalCategory.slice(1)}
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

export default ResultsCharts;