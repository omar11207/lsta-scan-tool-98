import { useState, useEffect } from "react";
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
  participation: { active: boolean; moyenne: boolean; faible: boolean };
  motivation: { forte: boolean; moyenne: boolean; faible: boolean };
  observationEnseignant: string;
  niveauGlobal: "haute" | "moyenne" | "basse" | "";
}

const MotivationParticipationGrid = () => {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const navigate = useNavigate();

  // Charger les étudiants depuis la liste globale ou créer une ligne vide
  useEffect(() => {
    const globalStudents = localStorage.getItem('globalStudents');
    if (globalStudents) {
      const studentNames = JSON.parse(globalStudents);
      const initialStudents = studentNames.map((name: string, index: number) => ({
        id: (index + 1).toString(),
        name: name,
        participation: { active: false, moyenne: false, faible: false },
        motivation: { forte: false, moyenne: false, faible: false },
        observationEnseignant: "",
        niveauGlobal: "" as const
      }));
      setStudents(initialStudents);
    } else {
      // Si aucune liste globale, créer une ligne vide par défaut
      setStudents([{
        id: "1",
        name: "",
        participation: { active: false, moyenne: false, faible: false },
        motivation: { forte: false, moyenne: false, faible: false },
        observationEnseignant: "",
        niveauGlobal: ""
      }]);
    }
  }, []);

  const calculateGlobalLevel = (student: StudentRow): "haute" | "moyenne" | "basse" | "" => {
    let score = 0;
    let totalChecked = 0;

    // Participation
    if (student.participation.active) { score += 3; totalChecked++; }
    else if (student.participation.moyenne) { score += 2; totalChecked++; }
    else if (student.participation.faible) { score += 1; totalChecked++; }

    // Motivation
    if (student.motivation.forte) { score += 3; totalChecked++; }
    else if (student.motivation.moyenne) { score += 2; totalChecked++; }
    else if (student.motivation.faible) { score += 1; totalChecked++; }

    if (totalChecked === 0) return "";

    const average = score / totalChecked;
    if (average >= 2.5) return "haute";
    if (average >= 1.5) return "moyenne";
    return "basse";
  };

  const updateStudentField = (id: string, field: keyof StudentRow, subfield: string, value: boolean) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const updated = { ...student };
        
        // Reset le groupe avant de mettre à jour
        if (field === "participation") {
          updated.participation = { active: false, moyenne: false, faible: false };
        } else if (field === "motivation") {
          updated.motivation = { forte: false, moyenne: false, faible: false };
        }

        // Mettre à jour la valeur spécifique
        (updated[field] as any)[subfield] = value;
        
        // Calculer automatiquement le niveau global
        updated.niveauGlobal = calculateGlobalLevel(updated);
        return updated;
      }
      return student;
    }));
  };

  const updateStudent = (id: string, updates: Partial<StudentRow>) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const updated = { ...student, ...updates };
        // Recalculer le niveau global si nécessaire
        if (!updates.niveauGlobal) {
          updated.niveauGlobal = calculateGlobalLevel(updated);
        }
        return updated;
      }
      return student;
    }));
  };

  const addStudent = () => {
    const newStudent: StudentRow = {
      id: Date.now().toString(),
      name: "",
      participation: { active: false, moyenne: false, faible: false },
      motivation: { forte: false, moyenne: false, faible: false },
      observationEnseignant: "",
      niveauGlobal: ""
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
    
    localStorage.setItem('motivationParticipationResults', JSON.stringify(validStudents));
    navigate('/results/motivation-participation');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Instructions */}
      <Card className="bg-gradient-warm/10 border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Clock className="w-5 h-5" />
            Grille d'observation – Participation et motivation
          </CardTitle>
          <CardDescription className="text-base">
            Cette grille permet d'évaluer la participation et la motivation des élèves lors d'une activité orale ou collective. L'enseignant observe la spontanéité, l'engagement et l'attitude des élèves.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Grid Form */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Grille d'observation – Participation et motivation
              </CardTitle>
              <CardDescription className="mt-2">
                Évaluation du niveau de participation et motivation : 
                <Badge variant="secondary" className="mx-1 bg-success/20 text-success">Haute</Badge>
                <Badge variant="secondary" className="mx-1 bg-primary/20 text-primary">Moyenne</Badge>
                <Badge variant="secondary" className="mx-1 bg-warning/20 text-warning">Basse</Badge>
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
              <table className="w-full border-collapse border border-border rounded-lg">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="border border-border p-3 text-left font-semibold min-w-[150px]">
                      Nom de l'élève
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[150px]">
                      Participation
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[150px]">
                      Motivation
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[200px]">
                      Observation de l'enseignant
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[150px]">
                      Niveau global
                    </th>
                    <th className="border border-border p-3 text-center font-semibold w-[60px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      {/* Nom de l'élève */}
                      <td className="border border-border p-3">
                        <Input
                          value={student.name}
                          onChange={(e) => updateStudent(student.id, { name: e.target.value })}
                          placeholder="Nom de l'élève"
                          className="border-0 focus-visible:ring-0"
                        />
                      </td>

                      {/* Participation */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.participation.active}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "participation", "active", !!checked)
                              }
                            />
                            <span className="text-sm">Active</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.participation.moyenne}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "participation", "moyenne", !!checked)
                              }
                            />
                            <span className="text-sm">Moyenne</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.participation.faible}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "participation", "faible", !!checked)
                              }
                            />
                            <span className="text-sm">Faible</span>
                          </label>
                        </div>
                      </td>

                      {/* Motivation */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.motivation.forte}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "motivation", "forte", !!checked)
                              }
                            />
                            <span className="text-sm">Forte</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.motivation.moyenne}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "motivation", "moyenne", !!checked)
                              }
                            />
                            <span className="text-sm">Moyenne</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.motivation.faible}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "motivation", "faible", !!checked)
                              }
                            />
                            <span className="text-sm">Faible</span>
                          </label>
                        </div>
                      </td>

                      {/* Observation de l'enseignant */}
                      <td className="border border-border p-3">
                        <Input
                          value={student.observationEnseignant}
                          onChange={(e) => updateStudent(student.id, { observationEnseignant: e.target.value })}
                          placeholder="Observations..."
                          className="border-0 focus-visible:ring-0"
                        />
                      </td>

                      {/* Niveau global */}
                      <td className="border border-border p-3 text-center">
                        {student.niveauGlobal && (
                          <Badge
                            className={`
                              ${student.niveauGlobal === "haute" ? "bg-success/20 text-success" : ""}
                              ${student.niveauGlobal === "moyenne" ? "bg-primary/20 text-primary" : ""}
                              ${student.niveauGlobal === "basse" ? "bg-warning/20 text-warning" : ""}
                            `}
                          >
                            {student.niveauGlobal.charAt(0).toUpperCase() + student.niveauGlobal.slice(1)}
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="border border-border p-3 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStudent(student.id)}
                          disabled={students.length === 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
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

export default MotivationParticipationGrid;