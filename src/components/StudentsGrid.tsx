import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus, Trash2 } from "lucide-react";

interface StudentRow {
  id: string;
  name: string;
  frenchReading: { correct: boolean; partiel: boolean; faux: boolean };
  frenchCalcul: { correct: boolean; partiel: boolean; faux: boolean };
  frenchWriting: { oui: boolean; incomplet: boolean };
  arabicReading: { correct: boolean; partiel: boolean; wrong: boolean };
  finalCategory: "rapide" | "normal" | "lent" | "";
}

const StudentsGrid = () => {
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
        frenchReading: { correct: false, partiel: false, faux: false },
        frenchCalcul: { correct: false, partiel: false, faux: false },
        frenchWriting: { oui: false, incomplet: false },
        arabicReading: { correct: false, partiel: false, wrong: false },
        finalCategory: "" as const
      }));
      setStudents(initialStudents);
    } else {
      // Si aucune liste globale, créer une ligne vide par défaut
      setStudents([{
        id: "1",
        name: "",
        frenchReading: { correct: false, partiel: false, faux: false },
        frenchCalcul: { correct: false, partiel: false, faux: false },
        frenchWriting: { oui: false, incomplet: false },
        arabicReading: { correct: false, partiel: false, wrong: false },
        finalCategory: ""
      }]);
    }
  }, []);

  const calculateFinalCategory = (student: StudentRow): "rapide" | "normal" | "lent" | "" => {
    // Calculer le score total selon les réponses
    let score = 0;
    let totalChecked = 0;

    // Français lecture
    if (student.frenchReading.correct) { score += 2; totalChecked++; }
    else if (student.frenchReading.partiel) { score += 1; totalChecked++; }
    else if (student.frenchReading.faux) { score += 0; totalChecked++; }

    // Français calcul
    if (student.frenchCalcul.correct) { score += 2; totalChecked++; }
    else if (student.frenchCalcul.partiel) { score += 1; totalChecked++; }
    else if (student.frenchCalcul.faux) { score += 0; totalChecked++; }

    // Français écriture
    if (student.frenchWriting.oui) { score += 2; totalChecked++; }
    else if (student.frenchWriting.incomplet) { score += 1; totalChecked++; }

    // Arabe lecture
    if (student.arabicReading.correct) { score += 2; totalChecked++; }
    else if (student.arabicReading.partiel) { score += 1; totalChecked++; }
    else if (student.arabicReading.wrong) { score += 0; totalChecked++; }

    if (totalChecked === 0) return "";

    const average = score / totalChecked;
    if (average >= 1.5) return "rapide";
    if (average >= 1) return "normal";
    return "lent";
  };

  const updateStudent = (id: string, updates: Partial<StudentRow>) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const updated = { ...student, ...updates };
        // Calculer automatiquement la catégorie finale
        updated.finalCategory = calculateFinalCategory(updated);
        return updated;
      }
      return student;
    }));
  };

  const updateStudentField = (id: string, field: keyof StudentRow, subfield: string, value: boolean) => {
    setStudents(prev => prev.map(student => {
      if (student.id === id) {
        const updated = { ...student };
        
        // Reset le groupe avant de mettre à jour
        if (field === "frenchReading") {
          updated.frenchReading = { correct: false, partiel: false, faux: false };
        } else if (field === "frenchCalcul") {
          updated.frenchCalcul = { correct: false, partiel: false, faux: false };
        } else if (field === "frenchWriting") {
          updated.frenchWriting = { oui: false, incomplet: false };
        } else if (field === "arabicReading") {
          updated.arabicReading = { correct: false, partiel: false, wrong: false };
        }

        // Mettre à jour la valeur spécifique
        (updated[field] as any)[subfield] = value;
        
        // Calculer automatiquement la catégorie finale
        updated.finalCategory = calculateFinalCategory(updated);
        return updated;
      }
      return student;
    }));
  };

  const addStudent = () => {
    const newStudent: StudentRow = {
      id: Date.now().toString(),
      name: "",
      frenchReading: { correct: false, partiel: false, faux: false },
      frenchCalcul: { correct: false, partiel: false, faux: false },
      frenchWriting: { oui: false, incomplet: false },
      arabicReading: { correct: false, partiel: false, wrong: false },
      finalCategory: ""
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
    
    // Vérifier que tous les élèves ont un nom
    const validStudents = students.filter(s => s.name.trim() !== "");
    if (validStudents.length === 0) return;
    
    // Sauvegarder et naviguer vers les résultats
    localStorage.setItem('diagnosticResults', JSON.stringify(validStudents));
    navigate('/results');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Instructions */}
      <Card className="bg-gradient-warm/10 border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <Clock className="w-5 h-5" />
            Activité de diagnostic bilingue (10 minutes)
          </CardTitle>
          <CardDescription className="text-base">
            <div className="space-y-2">
              <p><strong>Français :</strong> Présentez à l'élève un texte court avec des questions de compréhension et quelques exercices de calcul simple.</p>
              <p><strong>العربية :</strong> قدم للتلميذ نصاً قصيراً مع أسئلة الفهم وبعض تمارين الحساب البسيطة.</p>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Grid Form */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Grille d'observation – Diagnostic du rythme d'apprentissage (CM2 / 5ᵉ AEP)
              </CardTitle>
              <CardDescription className="mt-2">
                Cette grille permet de classer les élèves en trois catégories selon leur rythme d'apprentissage : 
                <Badge variant="secondary" className="mx-1 bg-success/20 text-success">Rapide</Badge>
                <Badge variant="secondary" className="mx-1 bg-primary/20 text-primary">Normal</Badge>
                <Badge variant="secondary" className="mx-1 bg-warning/20 text-warning">Lent</Badge>
                <br />
                Elle inclut des activités en français et en arabe.
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
            {/* Grid Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border rounded-lg">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="border border-border p-3 text-left font-semibold min-w-[150px]">
                      Nom de l'élève
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[180px]">
                      Français - Lecture/Compréhension
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[150px]">
                      Français - Calcul
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[160px]">
                      Français - Expression écrite
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[180px]">
                      Arabe - قراءة وفهم
                    </th>
                    <th className="border border-border p-3 text-center font-semibold min-w-[150px]">
                      Catégorie finale
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

                      {/* Français - Lecture */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.frenchReading.correct}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "frenchReading", "correct", !!checked)
                              }
                            />
                            <span className="text-sm">Correct</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.frenchReading.partiel}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "frenchReading", "partiel", !!checked)
                              }
                            />
                            <span className="text-sm">Partiel</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.frenchReading.faux}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "frenchReading", "faux", !!checked)
                              }
                            />
                            <span className="text-sm">Faux</span>
                          </label>
                        </div>
                      </td>

                      {/* Français - Calcul */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.frenchCalcul.correct}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "frenchCalcul", "correct", !!checked)
                              }
                            />
                            <span className="text-sm">Correct</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.frenchCalcul.partiel}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "frenchCalcul", "partiel", !!checked)
                              }
                            />
                            <span className="text-sm">Partiel</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.frenchCalcul.faux}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "frenchCalcul", "faux", !!checked)
                              }
                            />
                            <span className="text-sm">Faux</span>
                          </label>
                        </div>
                      </td>

                      {/* Français - Expression écrite */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.frenchWriting.oui}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "frenchWriting", "oui", !!checked)
                              }
                            />
                            <span className="text-sm">Oui</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.frenchWriting.incomplet}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "frenchWriting", "incomplet", !!checked)
                              }
                            />
                            <span className="text-sm">Incomplet</span>
                          </label>
                        </div>
                      </td>

                      {/* Arabe - Lecture */}
                      <td className="border border-border p-3">
                        <div className="flex flex-wrap gap-3 justify-center">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.arabicReading.correct}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "arabicReading", "correct", !!checked)
                              }
                            />
                            <span className="text-sm">صحيح</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.arabicReading.partiel}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "arabicReading", "partiel", !!checked)
                              }
                            />
                            <span className="text-sm">جزئي</span>
                          </label>
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <Checkbox
                              checked={student.arabicReading.wrong}
                              onCheckedChange={(checked) => 
                                updateStudentField(student.id, "arabicReading", "wrong", !!checked)
                              }
                            />
                            <span className="text-sm">خطأ</span>
                          </label>
                        </div>
                      </td>

                      {/* Catégorie finale - calculée automatiquement */}
                      <td className="border border-border p-3 text-center">
                        {student.finalCategory && (
                          <Badge
                            className={`
                              ${student.finalCategory === "rapide" ? "bg-success/20 text-success" : ""}
                              ${student.finalCategory === "normal" ? "bg-primary/20 text-primary" : ""}
                              ${student.finalCategory === "lent" ? "bg-warning/20 text-warning" : ""}
                            `}
                          >
                            {student.finalCategory.charAt(0).toUpperCase() + student.finalCategory.slice(1)}
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
                disabled={students.filter(s => s.name.trim() !== "").length === 0}
                className="bg-gradient-primary hover:opacity-90"
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

export default StudentsGrid;