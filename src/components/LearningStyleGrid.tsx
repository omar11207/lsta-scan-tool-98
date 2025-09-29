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
  visuel: { faible: boolean; moyen: boolean; parfait: boolean };
  auditif: { faible: boolean; moyen: boolean; parfait: boolean };
  kinesthesique: { faible: boolean; moyen: boolean; parfait: boolean };
  styleDominant: "visuel" | "auditif" | "kinesthesique" | "";
}

const LearningStyleGrid = () => {
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
        visuel: { faible: false, moyen: false, parfait: false },
        auditif: { faible: false, moyen: false, parfait: false },
        kinesthesique: { faible: false, moyen: false, parfait: false },
        styleDominant: "" as const
      }));
      setStudents(initialStudents);
    } else {
      // Si aucune liste globale, créer une ligne vide par défaut
      setStudents([{
        id: "1",
        name: "",
        visuel: { faible: false, moyen: false, parfait: false },
        auditif: { faible: false, moyen: false, parfait: false },
        kinesthesique: { faible: false, moyen: false, parfait: false },
        styleDominant: ""
      }]);
    }
  }, []);

  const calculateDominantStyle = (student: StudentRow): "visuel" | "auditif" | "kinesthesique" | "" => {
    let visuelScore = 0;
    let auditifScore = 0;
    let kinesthesiqueScore = 0;

    // Calcul des scores
    if (student.visuel.parfait) visuelScore = 3;
    else if (student.visuel.moyen) visuelScore = 2;
    else if (student.visuel.faible) visuelScore = 1;

    if (student.auditif.parfait) auditifScore = 3;
    else if (student.auditif.moyen) auditifScore = 2;
    else if (student.auditif.faible) auditifScore = 1;

    if (student.kinesthesique.parfait) kinesthesiqueScore = 3;
    else if (student.kinesthesique.moyen) kinesthesiqueScore = 2;
    else if (student.kinesthesique.faible) kinesthesiqueScore = 1;

    const maxScore = Math.max(visuelScore, auditifScore, kinesthesiqueScore);
    if (maxScore === 0) return "";

    if (visuelScore === maxScore) return "visuel";
    if (auditifScore === maxScore) return "auditif";
    if (kinesthesiqueScore === maxScore) return "kinesthesique";
    return "";
  };

  const updateStudentField = (id: string, field: keyof StudentRow, subfield: string, value: boolean) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const updated = { ...student };
        
        // Reset le groupe avant de mettre à jour
        if (field === "visuel") {
          updated.visuel = { faible: false, moyen: false, parfait: false };
        } else if (field === "auditif") {
          updated.auditif = { faible: false, moyen: false, parfait: false };
        } else if (field === "kinesthesique") {
          updated.kinesthesique = { faible: false, moyen: false, parfait: false };
        }

        // Mettre à jour la valeur spécifique
        (updated[field] as any)[subfield] = value;
        
        // Calculer automatiquement le style dominant
        updated.styleDominant = calculateDominantStyle(updated);
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
      visuel: { faible: false, moyen: false, parfait: false },
      auditif: { faible: false, moyen: false, parfait: false },
      kinesthesique: { faible: false, moyen: false, parfait: false },
      styleDominant: ""
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
    
    localStorage.setItem('styleApprentissageResults', JSON.stringify(validStudents));
    navigate('/results/style-apprentissage');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Instructions */}
      <Card className="bg-gradient-warm/10 border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Clock className="w-5 h-5" />
            Activité de diagnostic - Style d'apprentissage (10 minutes)
          </CardTitle>
          <CardDescription className="text-base">
            Cette grille permet d'identifier le style d'apprentissage dominant de chaque élève : Visuel – Auditif – Kinesthésique. Elle est basée sur une activité de 10 minutes.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Grid Form */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Grille d'observation – Diagnostic du style d'apprentissage
              </CardTitle>
              <CardDescription className="mt-2">
                Classement par style d'apprentissage dominant : 
                <Badge variant="secondary" className="mx-1 bg-primary/20 text-primary">Visuel</Badge>
                <Badge variant="secondary" className="mx-1 bg-success/20 text-success">Auditif</Badge>
                <Badge variant="secondary" className="mx-1 bg-warning/20 text-warning">Kinesthésique</Badge>
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
                      Visuel (décrit l'image)
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[180px]">
                      Auditif (retient ce qu'il entend)
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[180px]">
                      Kinesthésique (mime l'action)
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[150px]">
                      Style dominant
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

                      {/* Visuel */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.visuel.faible}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "visuel", "faible", !!checked)
                              }
                            />
                            <span className="text-sm">Faible</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.visuel.moyen}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "visuel", "moyen", !!checked)
                              }
                            />
                            <span className="text-sm">Moyen</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.visuel.parfait}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "visuel", "parfait", !!checked)
                              }
                            />
                            <span className="text-sm">Parfait</span>
                          </label>
                        </div>
                      </td>

                      {/* Auditif */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.auditif.faible}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "auditif", "faible", !!checked)
                              }
                            />
                            <span className="text-sm">Faible</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.auditif.moyen}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "auditif", "moyen", !!checked)
                              }
                            />
                            <span className="text-sm">Moyen</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.auditif.parfait}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "auditif", "parfait", !!checked)
                              }
                            />
                            <span className="text-sm">Parfait</span>
                          </label>
                        </div>
                      </td>

                      {/* Kinesthésique */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.kinesthesique.faible}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "kinesthesique", "faible", !!checked)
                              }
                            />
                            <span className="text-sm">Faible</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.kinesthesique.moyen}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "kinesthesique", "moyen", !!checked)
                              }
                            />
                            <span className="text-sm">Moyen</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.kinesthesique.parfait}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "kinesthesique", "parfait", !!checked)
                              }
                            />
                            <span className="text-sm">Parfait</span>
                          </label>
                        </div>
                      </td>

                      {/* Style dominant */}
                      <td className="border border-border p-3 text-center">
                        {student.styleDominant && (
                          <Badge
                            className={`
                              ${student.styleDominant === "visuel" ? "bg-primary/20 text-primary" : ""}
                              ${student.styleDominant === "auditif" ? "bg-success/20 text-success" : ""}
                              ${student.styleDominant === "kinesthesique" ? "bg-warning/20 text-warning" : ""}
                            `}
                          >
                            {student.styleDominant.charAt(0).toUpperCase() + student.styleDominant.slice(1)}
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

export default LearningStyleGrid;