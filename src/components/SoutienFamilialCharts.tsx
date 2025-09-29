import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, User, Home } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  niveauSoutien: "fort" | "moyen" | "faible" | "";
}

interface SoutienFamilialChartsProps {
  data: StudentData[];
}

const SoutienFamilialCharts = ({ data }: SoutienFamilialChartsProps) => {
  // Prepare data for pie chart (support distribution)
  const soutienCount = data.reduce((acc, student) => {
    if (student.niveauSoutien) {
      acc[student.niveauSoutien] = (acc[student.niveauSoutien] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const globalResultData = [
    { name: "Soutien fort", value: soutienCount.fort || 0, color: "hsl(142 71% 45%)" },
    { name: "Soutien moyen", value: soutienCount.moyen || 0, color: "hsl(214 84% 56%)" },
    { name: "Soutien faible", value: soutienCount.faible || 0, color: "hsl(38 92% 50%)" }
  ].filter(item => item.value > 0);

  // Generate summary for the class
  const generateClassSummary = () => {
    const totalStudents = data.length;
    const validStudents = data.filter(s => s.niveauSoutien);
    
    if (validStudents.length === 0) return "Aucun diagnostic complété.";

    const fortCount = soutienCount.fort || 0;
    const moyenCount = soutienCount.moyen || 0;
    const faibleCount = soutienCount.faible || 0;

    let summary = `Sur ${totalStudents} élève(s) évalué(s) : `;
    
    const results = [];
    if (fortCount > 0) results.push(`${fortCount} avec un soutien familial fort`);
    if (moyenCount > 0) results.push(`${moyenCount} avec un soutien familial moyen`);
    if (faibleCount > 0) results.push(`${faibleCount} avec un soutien familial faible`);
    
    summary += results.join(", ") + ".";

    return summary;
  };

  const chartConfig = {
    soutien: {
      label: "Niveau de soutien",
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
            Diagnostic du soutien familial - Niveaux de support identifiés
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Support Distribution */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Répartition du soutien familial
            </CardTitle>
            <CardDescription>
              Distribution des niveaux de soutien dans la classe
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

        {/* Bar Chart - Support Levels */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Niveaux de soutien
            </CardTitle>
            <CardDescription>
              Répartition quantitative du support familial disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={globalResultData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
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
            <h4 className="font-semibold mb-2">Recommandations d'accompagnement :</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {(soutienCount.fort || 0) > 0 && (
                <li>Élèves avec soutien fort : Maintenir la collaboration famille-école et valoriser l'engagement parental</li>
              )}
              {(soutienCount.moyen || 0) > 0 && (
                <li>Élèves avec soutien moyen : Renforcer la communication avec les familles et proposer des outils d'accompagnement</li>
              )}
              {(soutienCount.faible || 0) > 0 && (
                <li>Élèves avec soutien faible : Priorité à l'accompagnement scolaire renforcé et mise en place d'un suivi personnalisé</li>
              )}
              <li>Organiser des rencontres parents-enseignants régulières</li>
              <li>Proposer des ressources et formations aux familles</li>
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
                    {student.niveauSoutien && (
                      <Badge
                        variant="secondary"
                        className={`
                          ${student.niveauSoutien === "fort" ? "bg-success/20 text-success" : ""}
                          ${student.niveauSoutien === "moyen" ? "bg-primary/20 text-primary" : ""}
                          ${student.niveauSoutien === "faible" ? "bg-warning/20 text-warning" : ""}
                        `}
                      >
                        {student.niveauSoutien.charAt(0).toUpperCase() + student.niveauSoutien.slice(1)}
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

export default SoutienFamilialCharts;