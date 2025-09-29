import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Trash2 } from "lucide-react";

interface StudentRow {
  id: string;
  name: string;
  linguistique: { fort: boolean; moyen: boolean; faible: boolean };
  logicoMath: { fort: boolean; moyen: boolean; faible: boolean };
  spatiale: { fort: boolean; moyen: boolean; faible: boolean };
  musicale: { fort: boolean; moyen: boolean; faible: boolean };
  corporelle: { fort: boolean; moyen: boolean; faible: boolean };
  interpersonnelle: { fort: boolean; moyen: boolean; faible: boolean };
  intrapersonnelle: { fort: boolean; moyen: boolean; faible: boolean };
  naturaliste: { fort: boolean; moyen: boolean; faible: boolean };
  profilDominant: string;
}

const MultipleIntelligencesGrid = () => {
  const [students, setStudents] = useState<StudentRow[]>([
    {
      id: "1",
      name: "",
      linguistique: { fort: false, moyen: false, faible: false },
      logicoMath: { fort: false, moyen: false, faible: false },
      spatiale: { fort: false, moyen: false, faible: false },
      musicale: { fort: false, moyen: false, faible: false },
      corporelle: { fort: false, moyen: false, faible: false },
      interpersonnelle: { fort: false, moyen: false, faible: false },
      intrapersonnelle: { fort: false, moyen: false, faible: false },
      naturaliste: { fort: false, moyen: false, faible: false },
      profilDominant: ""
    }
  ]);
  const navigate = useNavigate();

  const calculateDominantProfile = (student: StudentRow): string => {
    const intelligences = [
      { name: "Linguistique", data: student.linguistique },
      { name: "Logico-mathématique", data: student.logicoMath },
      { name: "Spatiale", data: student.spatiale },
      { name: "Musicale", data: student.musicale },
      { name: "Corporelle", data: student.corporelle },
      { name: "Interpersonnelle", data: student.interpersonnelle },
      { name: "Intrapersonnelle", data: student.intrapersonnelle },
      { name: "Naturaliste", data: student.naturaliste }
    ];

    let maxScore = 0;
    let dominantIntelligences: string[] = [];

    intelligences.forEach(intelligence => {
      let score = 0;
      if (intelligence.data.fort) score = 3;
      else if (intelligence.data.moyen) score = 2;
      else if (intelligence.data.faible) score = 1;

      if (score > maxScore) {
        maxScore = score;
        dominantIntelligences = [intelligence.name];
      } else if (score === maxScore && score > 0) {
        dominantIntelligences.push(intelligence.name);
      }
    });

    return dominantIntelligences.join(" + ");
  };

  const updateStudentField = (id: string, field: keyof StudentRow, subfield: string, value: boolean) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const updated = { ...student };
        
        // Reset le groupe avant de mettre à jour
        const fieldData = updated[field] as any;
        if (fieldData && typeof fieldData === 'object') {
          Object.keys(fieldData).forEach(key => {
            fieldData[key] = false;
          });
          fieldData[subfield] = value;
        }
        
        // Calculer automatiquement le profil dominant
        updated.profilDominant = calculateDominantProfile(updated);
        return updated;
      }
      return student;
    }));
  };

  const updateStudent = (id: string, updates: Partial<StudentRow>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const addStudent = () => {
    const newStudent: StudentRow = {
      id: Date.now().toString(),
      name: "",
      linguistique: { fort: false, moyen: false, faible: false },
      logicoMath: { fort: false, moyen: false, faible: false },
      spatiale: { fort: false, moyen: false, faible: false },
      musicale: { fort: false, moyen: false, faible: false },
      corporelle: { fort: false, moyen: false, faible: false },
      interpersonnelle: { fort: false, moyen: false, faible: false },
      intrapersonnelle: { fort: false, moyen: false, faible: false },
      naturaliste: { fort: false, moyen: false, faible: false },
      profilDominant: ""
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const removeStudent = (id: string) => {
    if (students.length > 1) {
      setStudents(prev => prev.filter(student => student.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validStudents = students.filter(s => s.name.trim() !== "");
    if (validStudents.length === 0) return;
    
    localStorage.setItem('intelligencesMultiplesResults', JSON.stringify(validStudents));
    navigate('/results/intelligences-multiples');
  };

  const renderIntelligenceColumn = (student: StudentRow, field: keyof StudentRow, label: string) => (
    <td className="border border-border p-3">
      <div className="flex flex-col gap-2 items-center">
        <label className="flex items-center space-x-1 cursor-pointer">
          <Checkbox
            checked={(student[field] as any)?.fort || false}
            onCheckedChange={(checked) => 
              updateStudentField(student.id, field, "fort", !!checked)
            }
          />
          <span className="text-xs">Fort</span>
        </label>
        <label className="flex items-center space-x-1 cursor-pointer">
          <Checkbox
            checked={(student[field] as any)?.moyen || false}
            onCheckedChange={(checked) => 
              updateStudentField(student.id, field, "moyen", !!checked)
            }
          />
          <span className="text-xs">Moyen</span>
        </label>
        <label className="flex items-center space-x-1 cursor-pointer">
          <Checkbox
            checked={(student[field] as any)?.faible || false}
            onCheckedChange={(checked) => 
              updateStudentField(student.id, field, "faible", !!checked)
            }
          />
          <span className="text-xs">Faible</span>
        </label>
      </div>
    </td>
  );

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Instructions */}
      <Card className="bg-gradient-warm/10 border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Clock className="w-5 h-5" />
            Grille d'observation : les intelligences multiples
          </CardTitle>
          <CardDescription className="text-base">
            Cette grille permet d'identifier les intelligences multiples dominantes de chaque élève selon la théorie de Howard Gardner.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Grid Form */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Grille d'observation : les intelligences multiples
              </CardTitle>
              <CardDescription className="mt-2">
                Évaluation des 8 types d'intelligences multiples
              </CardDescription>
            </div>
            <Button onClick={addStudent} className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter élève
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border rounded-lg text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="border border-border p-2 text-left font-semibold min-w-[120px]">
                      Nom de l'élève
                    </th>
                    <th className="border border-border p-2 text-center font-semibold min-w-[100px]">
                      Linguistique
                    </th>
                    <th className="border border-border p-2 text-center font-semibold min-w-[100px]">
                      Logico-math.
                    </th>
                    <th className="border border-border p-2 text-center font-semibold min-w-[100px]">
                      Spatiale
                    </th>
                    <th className="border border-border p-2 text-center font-semibold min-w-[100px]">
                      Musicale
                    </th>
                    <th className="border border-border p-2 text-center font-semibold min-w-[100px]">
                      Corporelle
                    </th>
                    <th className="border border-border p-2 text-center font-semibold min-w-[110px]">
                      Interpersonnelle
                    </th>
                    <th className="border border-border p-2 text-center font-semibold min-w-[110px]">
                      Intrapersonnelle
                    </th>
                    <th className="border border-border p-2 text-center font-semibold min-w-[100px]">
                      Naturaliste
                    </th>
                    <th className="border border-border p-2 text-center font-semibold min-w-[150px]">
                      Profil dominant
                    </th>
                    <th className="border border-border p-2 text-center font-semibold w-[60px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      {/* Nom de l'élève */}
                      <td className="border border-border p-2">
                        <Input
                          value={student.name}
                          onChange={(e) => updateStudent(student.id, { name: e.target.value })}
                          placeholder="Nom de l'élève"
                          className="border-0 focus-visible:ring-0 text-sm"
                        />
                      </td>

                      {/* Intelligences */}
                      {renderIntelligenceColumn(student, "linguistique", "Linguistique")}
                      {renderIntelligenceColumn(student, "logicoMath", "Logico-math")}
                      {renderIntelligenceColumn(student, "spatiale", "Spatiale")}
                      {renderIntelligenceColumn(student, "musicale", "Musicale")}
                      {renderIntelligenceColumn(student, "corporelle", "Corporelle")}
                      {renderIntelligenceColumn(student, "interpersonnelle", "Interpersonnelle")}
                      {renderIntelligenceColumn(student, "intrapersonnelle", "Intrapersonnelle")}
                      {renderIntelligenceColumn(student, "naturaliste", "Naturaliste")}

                      {/* Profil dominant */}
                      <td className="border border-border p-2 text-center">
                        {student.profilDominant && (
                          <Badge className="bg-primary/20 text-primary text-xs">
                            {student.profilDominant}
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="border border-border p-2 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStudent(student.id)}
                          disabled={students.length === 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Retour
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90"
                disabled={students.filter(s => s.name.trim() !== "").length === 0}
              >
                Voir les résultats
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultipleIntelligencesGrid;