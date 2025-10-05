import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoefficientsConfig {
  // Soutien Familial
  soutienFamilial: {
    bonne: number;
    moyenne: number;
    faible: number;
    present: number;
    occasionnel: number;
    absent: number;
    forte: number;
    moyenneMotivation: number;
    faibleMotivation: number;
    seuilFort: number;
    seuilMoyen: number;
  };
  // Style d'Apprentissage
  styleApprentissage: {
    parfait: number;
    moyen: number;
    faible: number;
  };
  // Motivation et Participation
  motivationParticipation: {
    active: number;
    moyenne: number;
    faibleParticipation: number;
    forte: number;
    moyenneMotivation: number;
    faibleMotivation: number;
    seuilHaute: number;
    seuilMoyenne: number;
  };
  // Intelligences Multiples
  intelligencesMultiples: {
    fort: number;
    moyen: number;
    faible: number;
  };
  // Diagnostic général (scores académiques)
  diagnosticGeneral: {
    correct: number;
    partiel: number;
    faux: number;
    seuilRapide: number;
    seuilLent: number;
    seuilExcellent: number;
    seuilBon: number;
    seuilMoyen: number;
  };
}

const defaultCoefficients: CoefficientsConfig = {
  soutienFamilial: {
    bonne: 3,
    moyenne: 2,
    faible: 1,
    present: 3,
    occasionnel: 2,
    absent: 1,
    forte: 3,
    moyenneMotivation: 2,
    faibleMotivation: 1,
    seuilFort: 2.5,
    seuilMoyen: 1.5,
  },
  styleApprentissage: {
    parfait: 3,
    moyen: 2,
    faible: 1,
  },
  motivationParticipation: {
    active: 3,
    moyenne: 2,
    faibleParticipation: 1,
    forte: 3,
    moyenneMotivation: 2,
    faibleMotivation: 1,
    seuilHaute: 2.5,
    seuilMoyenne: 1.5,
  },
  intelligencesMultiples: {
    fort: 3,
    moyen: 2,
    faible: 1,
  },
  diagnosticGeneral: {
    correct: 100,
    partiel: 50,
    faux: 0,
    seuilRapide: 70,
    seuilLent: 40,
    seuilExcellent: 80,
    seuilBon: 60,
    seuilMoyen: 40,
  },
};

const AdminConfigPage = () => {
  const { toast } = useToast();
  const [coefficients, setCoefficients] = useState<CoefficientsConfig>(defaultCoefficients);

  useEffect(() => {
    const saved = localStorage.getItem("adminCoefficients");
    if (saved) {
      try {
        setCoefficients(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur chargement coefficients:", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("adminCoefficients", JSON.stringify(coefficients));
    toast({
      title: "Configuration sauvegardée",
      description: "Les coefficients ont été mis à jour avec succès.",
    });
  };

  const handleReset = () => {
    setCoefficients(defaultCoefficients);
    localStorage.removeItem("adminCoefficients");
    toast({
      title: "Réinitialisation effectuée",
      description: "Les coefficients par défaut ont été restaurés.",
    });
  };

  const updateValue = (category: keyof CoefficientsConfig, key: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setCoefficients(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: numValue,
        },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/10 to-success-soft/10">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Settings className="w-8 h-8 text-primary" />
                Configuration Admin
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérer les coefficients de calcul pour tous les diagnostics
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Sauvegarder
            </Button>
          </div>
        </div>

        {/* Soutien Familial */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Soutien Familial</CardTitle>
            <CardDescription>Coefficients pour l'évaluation du soutien familial</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Organisation</h4>
              <div className="space-y-2">
                <div>
                  <Label>Bonne</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.soutienFamilial.bonne}
                    onChange={(e) => updateValue('soutienFamilial', 'bonne', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Moyenne</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.soutienFamilial.moyenne}
                    onChange={(e) => updateValue('soutienFamilial', 'moyenne', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Faible</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.soutienFamilial.faible}
                    onChange={(e) => updateValue('soutienFamilial', 'faible', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Encadrement</h4>
              <div className="space-y-2">
                <div>
                  <Label>Présent</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.soutienFamilial.present}
                    onChange={(e) => updateValue('soutienFamilial', 'present', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Occasionnel</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.soutienFamilial.occasionnel}
                    onChange={(e) => updateValue('soutienFamilial', 'occasionnel', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Absent</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.soutienFamilial.absent}
                    onChange={(e) => updateValue('soutienFamilial', 'absent', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Seuils de classification</h4>
              <div className="space-y-2">
                <div>
                  <Label>Seuil Fort (≥)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.soutienFamilial.seuilFort}
                    onChange={(e) => updateValue('soutienFamilial', 'seuilFort', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Seuil Moyen (≥)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.soutienFamilial.seuilMoyen}
                    onChange={(e) => updateValue('soutienFamilial', 'seuilMoyen', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Style d'Apprentissage */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Style d'Apprentissage</CardTitle>
            <CardDescription>Coefficients pour les styles visuel, auditif et kinesthésique</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Parfait</Label>
              <Input
                type="number"
                step="0.1"
                value={coefficients.styleApprentissage.parfait}
                onChange={(e) => updateValue('styleApprentissage', 'parfait', e.target.value)}
              />
            </div>
            <div>
              <Label>Moyen</Label>
              <Input
                type="number"
                step="0.1"
                value={coefficients.styleApprentissage.moyen}
                onChange={(e) => updateValue('styleApprentissage', 'moyen', e.target.value)}
              />
            </div>
            <div>
              <Label>Faible</Label>
              <Input
                type="number"
                step="0.1"
                value={coefficients.styleApprentissage.faible}
                onChange={(e) => updateValue('styleApprentissage', 'faible', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Motivation et Participation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Motivation et Participation</CardTitle>
            <CardDescription>Coefficients pour l'évaluation de la motivation et participation</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Participation</h4>
              <div className="space-y-2">
                <div>
                  <Label>Active</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.motivationParticipation.active}
                    onChange={(e) => updateValue('motivationParticipation', 'active', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Moyenne</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.motivationParticipation.moyenne}
                    onChange={(e) => updateValue('motivationParticipation', 'moyenne', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Faible</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.motivationParticipation.faibleParticipation}
                    onChange={(e) => updateValue('motivationParticipation', 'faibleParticipation', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Motivation</h4>
              <div className="space-y-2">
                <div>
                  <Label>Forte</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.motivationParticipation.forte}
                    onChange={(e) => updateValue('motivationParticipation', 'forte', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Moyenne</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.motivationParticipation.moyenneMotivation}
                    onChange={(e) => updateValue('motivationParticipation', 'moyenneMotivation', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Faible</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.motivationParticipation.faibleMotivation}
                    onChange={(e) => updateValue('motivationParticipation', 'faibleMotivation', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Seuils</h4>
              <div className="space-y-2">
                <div>
                  <Label>Seuil Haute (≥)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.motivationParticipation.seuilHaute}
                    onChange={(e) => updateValue('motivationParticipation', 'seuilHaute', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Seuil Moyenne (≥)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={coefficients.motivationParticipation.seuilMoyenne}
                    onChange={(e) => updateValue('motivationParticipation', 'seuilMoyenne', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intelligences Multiples */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Intelligences Multiples</CardTitle>
            <CardDescription>Coefficients pour l'évaluation des intelligences multiples</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Fort</Label>
              <Input
                type="number"
                step="0.1"
                value={coefficients.intelligencesMultiples.fort}
                onChange={(e) => updateValue('intelligencesMultiples', 'fort', e.target.value)}
              />
            </div>
            <div>
              <Label>Moyen</Label>
              <Input
                type="number"
                step="0.1"
                value={coefficients.intelligencesMultiples.moyen}
                onChange={(e) => updateValue('intelligencesMultiples', 'moyen', e.target.value)}
              />
            </div>
            <div>
              <Label>Faible</Label>
              <Input
                type="number"
                step="0.1"
                value={coefficients.intelligencesMultiples.faible}
                onChange={(e) => updateValue('intelligencesMultiples', 'faible', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Diagnostic Général */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Diagnostic Général (Scores Académiques)</CardTitle>
            <CardDescription>Coefficients pour les évaluations académiques</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Scores de réponse</h4>
              <div className="space-y-2">
                <div>
                  <Label>Réponse Correcte</Label>
                  <Input
                    type="number"
                    step="1"
                    value={coefficients.diagnosticGeneral.correct}
                    onChange={(e) => updateValue('diagnosticGeneral', 'correct', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Réponse Partielle</Label>
                  <Input
                    type="number"
                    step="1"
                    value={coefficients.diagnosticGeneral.partiel}
                    onChange={(e) => updateValue('diagnosticGeneral', 'partiel', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Réponse Fausse</Label>
                  <Input
                    type="number"
                    step="1"
                    value={coefficients.diagnosticGeneral.faux}
                    onChange={(e) => updateValue('diagnosticGeneral', 'faux', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Vitesse d'apprentissage</h4>
              <div className="space-y-2">
                <div>
                  <Label>Seuil Rapide (≥)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={coefficients.diagnosticGeneral.seuilRapide}
                    onChange={(e) => updateValue('diagnosticGeneral', 'seuilRapide', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Seuil Lent (&lt;)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={coefficients.diagnosticGeneral.seuilLent}
                    onChange={(e) => updateValue('diagnosticGeneral', 'seuilLent', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Catégories de niveau</h4>
              <div className="space-y-2">
                <div>
                  <Label>Excellent (≥)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={coefficients.diagnosticGeneral.seuilExcellent}
                    onChange={(e) => updateValue('diagnosticGeneral', 'seuilExcellent', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Bon (≥)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={coefficients.diagnosticGeneral.seuilBon}
                    onChange={(e) => updateValue('diagnosticGeneral', 'seuilBon', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Moyen (≥)</Label>
                  <Input
                    type="number"
                    step="1"
                    value={coefficients.diagnosticGeneral.seuilMoyen}
                    onChange={(e) => updateValue('diagnosticGeneral', 'seuilMoyen', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminConfigPage;
