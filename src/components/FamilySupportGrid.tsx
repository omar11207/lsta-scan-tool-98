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
  organisation: { bonne: boolean; moyenne: boolean; faible: boolean };
  encadrement: { present: boolean; occasionnel: boolean; absent: boolean };
  motivation: { forte: boolean; moyenne: boolean; faible: boolean };
  observationEnseignant: string;
  niveauSoutien: "fort" | "moyen" | "faible" | "";
}

const FamilySupportGrid = () => {
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
        organisation: { bonne: false, moyenne: false, faible: false },
        encadrement: { present: false, occasionnel: false, absent: false },
        motivation: { forte: false, moyenne: false, faible: false },
        observationEnseignant: "",
        niveauSoutien: "" as const
      }));
      setStudents(initialStudents);
    } else {
      // Si aucune liste globale, créer une ligne vide par défaut
      setStudents([{
        id: "1",
        name: "",
        organisation: { bonne: false, moyenne: false, faible: false },
        encadrement: { present: false, occasionnel: false, absent: false },
        motivation: { forte: false, moyenne: false, faible: false },
        observationEnseignant: "",
        niveauSoutien: ""
      }]);
    }
  }, []);

  const calculateSupportLevel = (student: StudentRow): "fort" | "moyen" | "faible" | "" => {
    let score = 0;
    let totalChecked = 0;

    // Organisation
    if (student.organisation.bonne) { score += 3; totalChecked++; }
    else if (student.organisation.moyenne) { score += 2; totalChecked++; }
    else if (student.organisation.faible) { score += 1; totalChecked++; }

    // Encadrement
    if (student.encadrement.present) { score += 3; totalChecked++; }
    else if (student.encadrement.occasionnel) { score += 2; totalChecked++; }
    else if (student.encadrement.absent) { score += 1; totalChecked++; }

    // Motivation
    if (student.motivation.forte) { score += 3; totalChecked++; }
    else if (student.motivation.moyenne) { score += 2; totalChecked++; }
    else if (student.motivation.faible) { score += 1; totalChecked++; }

    if (totalChecked === 0) return "";

    const average = score / totalChecked;
    if (average >= 2.5) return "fort";
    if (average >= 1.5) return "moyen";
    return "faible";
  };

  const updateStudentField = (id: string, field: keyof StudentRow, subfield: string, value: boolean) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const updated = { ...student };
        
        // Reset le groupe avant de mettre à jour
        if (field === "organisation") {
          updated.organisation = { bonne: false, moyenne: false, faible: false };
        } else if (field === "encadrement") {
          updated.encadrement = { present: false, occasionnel: false, absent: false };
        } else if (field === "motivation") {
          updated.motivation = { forte: false, moyenne: false, faible: false };
        }

        // Mettre à jour la valeur spécifique
        (updated[field] as any)[subfield] = value;
        
        // Calculer automatiquement le niveau de soutien
        updated.niveauSoutien = calculateSupportLevel(updated);
        return updated;
      }
      return student;
    }));
  };

  const updateStudent = (id: string, updates: Partial<StudentRow>) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const updated = { ...student, ...updates };
        // Recalculer le niveau de soutien si nécessaire
        if (!updates.niveauSoutien) {
          updated.niveauSoutien = calculateSupportLevel(updated);
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
      organisation: { bonne: false, moyenne: false, faible: false },
      encadrement: { present: false, occasionnel: false, absent: false },
      motivation: { forte: false, moyenne: false, faible: false },
      observationEnseignant: "",
      niveauSoutien: ""
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
    
    localStorage.setItem('soutienFamilialResults', JSON.stringify(validStudents));
    navigate('/results/soutien-familial');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Instructions */}
      <Card className="bg-gradient-warm/10 border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Clock className="w-5 h-5" />
            Grille d'observation – Soutien familial
          </CardTitle>
          <CardDescription className="text-base">
            Cette grille permet d'évaluer indirectement le niveau de soutien familial des élèves à travers une activité d'écriture (« Raconte comment tu prépares tes devoirs à la maison »). L'enseignant observe l'organisation, l'encadrement et la motivation dans les réponses des élèves.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Grid Form */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Grille d'observation – Soutien familial
              </CardTitle>
              <CardDescription className="mt-2">
                Évaluation du niveau de soutien familial : 
                <Badge variant="secondary" className="mx-1 bg-success/20 text-success">Fort</Badge>
                <Badge variant="secondary" className="mx-1 bg-primary/20 text-primary">Moyen</Badge>
                <Badge variant="secondary" className="mx-1 bg-warning/20 text-warning">Faible</Badge>
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
                    <th className="border border-border p-3 text-center font-semibold min-w-[180px]">
                      Organisation (matériel, devoirs)
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[180px]">
                      Encadrement (aide familiale)
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[150px]">
                      Motivation (attitude)
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[200px]">
                      Observation de l'enseignant
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[150px]">
                      Niveau de soutien
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

                      {/* Organisation */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.organisation.bonne}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "organisation", "bonne", !!checked)
                              }
                            />
                            <span className="text-sm">Bonne</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.organisation.moyenne}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "organisation", "moyenne", !!checked)
                              }
                            />
                            <span className="text-sm">Moyenne</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.organisation.faible}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "organisation", "faible", !!checked)
                              }
                            />
                            <span className="text-sm">Faible</span>
                          </label>
                        </div>
                      </td>

                      {/* Encadrement */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.encadrement.present}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "encadrement", "present", !!checked)
                              }
                            />
                            <span className="text-sm">Présent</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.encadrement.occasionnel}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "encadrement", "occasionnel", !!checked)
                              }
                            />
                            <span className="text-sm">Occasionnel</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.encadrement.absent}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "encadrement", "absent", !!checked)
                              }
                            />
                            <span className="text-sm">Absent</span>
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

                      {/* Niveau de soutien */}
                      <td className="border border-border p-3 text-center">
                        {student.niveauSoutien && (
                          <Badge
                            className={`
                              ${student.niveauSoutien === "fort" ? "bg-success/20 text-success" : ""}
                              ${student.niveauSoutien === "moyen" ? "bg-primary/20 text-primary" : ""}
                              ${student.niveauSoutien === "faible" ? "bg-warning/20 text-warning" : ""}
                            `}
                          >
                            {student.niveauSoutien.charAt(0).toUpperCase() + student.niveauSoutien.slice(1)}
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

export default FamilySupportGrid;