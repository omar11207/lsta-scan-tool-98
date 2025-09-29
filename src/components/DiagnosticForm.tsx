import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BookOpen, Brain, Heart, Home, Users } from "lucide-react";
import PDFImport from "@/components/PDFImport";

const DiagnosticForm = () => {
  const [level, setLevel] = useState<string>("");
  const [diagnosticType, setDiagnosticType] = useState<string>("");
  const [globalStudents, setGlobalStudents] = useState<string[]>([]);
  const navigate = useNavigate();

  // Charger la liste d'étudiants depuis localStorage au début
  useEffect(() => {
    const savedStudents = localStorage.getItem('globalStudents');
    if (savedStudents) {
      setGlobalStudents(JSON.parse(savedStudents));
    }
  }, []);

  // Sauvegarder la liste d'étudiants dans localStorage
  const handleStudentsImported = (students: string[]) => {
    setGlobalStudents(students);
    localStorage.setItem('globalStudents', JSON.stringify(students));
    localStorage.setItem('selectedLevel', level); // Sauvegarder aussi le niveau sélectionné
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!level || !diagnosticType) return;

    // Sauvegarder le niveau sélectionné
    localStorage.setItem('selectedLevel', level);

    const routes = {
      "rythme": "/diagnostic/rythme",
      "style": "/diagnostic/style-apprentissage", 
      "motivation": "/diagnostic/motivation-participation",
      "soutien": "/diagnostic/soutien-familial",
      "intelligences": "/diagnostic/intelligences-multiples"
    };
    
    const route = routes[diagnosticType as keyof typeof routes];
    if (route) {
      navigate(route);
    }
  };

  const diagnosticOptions = [
    {
      value: "rythme",
      label: "Rythme d'apprentissage",
      description: "Évaluez la vitesse d'apprentissage de l'élève",
      icon: Brain,
      available: true
    },
    {
      value: "style",
      label: "Style d'apprentissage",
      description: "Identifiez le style préféré d'apprentissage",
      icon: BookOpen,
      available: true
    },
    {
      value: "motivation",
      label: "Motivation et participation",
      description: "Mesurez l'engagement de l'élève",
      icon: Heart,
      available: true
    },
    {
      value: "soutien",
      label: "Soutien familial",
      description: "Évaluez le support familial disponible",
      icon: Home,
      available: true
    },
    {
      value: "intelligences",
      label: "Intelligences multiples",
      description: "Découvrez les intelligences dominantes",
      icon: Users,
      available: true
    }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-soft">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Diagnostic LSTA Academy
        </CardTitle>
        <CardDescription className="text-lg">
          Évaluez le rythme et le style d'apprentissage de vos élèves
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Import PDF des étudiants */}
          <PDFImport onStudentsImported={handleStudentsImported} />
          
          {globalStudents.length > 0 && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm font-medium text-success mb-2">
                ✓ {globalStudents.length} élève(s) importé(s)
              </p>
              <div className="text-xs text-success/80 max-h-24 overflow-y-auto">
                {globalStudents.slice(0, 5).map((student, index) => (
                  <div key={index}>{student}</div>
                ))}
                {globalStudents.length > 5 && (
                  <div className="font-medium">... et {globalStudents.length - 5} autre(s)</div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <Label htmlFor="level" className="text-base font-medium">
              Niveau scolaire de l'élève
            </Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez le niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="niveau1">Niveau 1</SelectItem>
                <SelectItem value="niveau2">Niveau 2</SelectItem>
                <SelectItem value="niveau3">Niveau 3</SelectItem>
                <SelectItem value="niveau4">Niveau 4</SelectItem>
                <SelectItem value="niveau5">Niveau 5 (CM2/5ᵉ AEP)</SelectItem>
                <SelectItem value="niveau6">Niveau 6</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">
              Type de diagnostic
            </Label>
            <div className="grid gap-3">
              {diagnosticOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      diagnosticType === option.value
                        ? "border-primary bg-primary-soft"
                        : "border-border hover:border-primary/50"
                    } ${!option.available ? "opacity-60" : ""}`}
                    onClick={() => option.available && setDiagnosticType(option.value)}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 mt-1 ${diagnosticType === option.value ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${diagnosticType === option.value ? "text-primary" : "text-foreground"}`}>
                            {option.label}
                          </h3>
                          {option.value === "rythme" && (
                            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                              Exemple complet
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!level || !diagnosticType}
            className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
            size="lg"
          >
            Commencer le diagnostic
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DiagnosticForm;