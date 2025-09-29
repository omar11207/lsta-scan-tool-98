import DiagnosticForm from "@/components/DiagnosticForm";
import { Button } from "@/components/ui/button";
import { GraduationCap, FileText, Award, TrendingUp, Users, Shield } from "lucide-react";
import lstaLogo from "@/assets/lsta-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/10 to-success-soft/10">
      {/* Header */}
      <header className="relative py-12 text-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-gradient-success rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-24 h-24 bg-gradient-warm rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Logo and Company Name */}
          <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in">
            <div className="relative">
              <img 
                src={lstaLogo} 
                alt="L.S.T.A. Technologies" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain hover-scale"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-full blur-lg"></div>
            </div>
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                L.S.T.A. Technologies
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-medium">
                Academy
              </p>
            </div>
          </div>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in">
            Plateforme intelligente d'évaluation et de diagnostic pédagogique
          </p>
          
          {/* Features highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 animate-fade-in">
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Diagnostic précis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-sm font-medium">Suivi personnalisé</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border/50">
              <Shield className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium">Sécurisé</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        <div className="animate-fade-in">
          <DiagnosticForm />
        </div>
        
        {/* Global Results Link */}
        <div className="text-center mt-12 animate-fade-in">
          <div className="inline-flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-sm">
              Accès aux analyses globales
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/results/global'}
              className="gap-3 px-6 py-3 text-base hover-scale border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              size="lg"
            >
              <FileText className="w-5 h-5" />
              Voir les résultats globaux (Niveau 5)
              <Users className="w-4 h-4 opacity-70" />
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-card/30 backdrop-blur-sm border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src={lstaLogo} 
              alt="L.S.T.A. Technologies" 
              className="w-6 h-6 object-contain opacity-60"
            />
            <p className="text-sm font-medium text-foreground/80">
              L.S.T.A. Technologies
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 L.S.T.A. Technologies - Évaluation moderne des apprentissages
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
