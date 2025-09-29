import DiagnosticForm from "@/components/DiagnosticForm";
import { Button } from "@/components/ui/button";
import { GraduationCap, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/30 to-success-soft/20">
      {/* Header */}
      <header className="py-8 text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-full">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              LSTA Academy
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plateforme moderne d'évaluation et de diagnostic pédagogique
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-16">
        <DiagnosticForm />
        
        {/* Global Results Link */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/results/global'}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Voir les résultats globaux (Niveau 5)
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            © 2024 LSTA Academy - Évaluation moderne des apprentissages
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
