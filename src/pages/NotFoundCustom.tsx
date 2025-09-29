import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Home, ArrowLeft } from "lucide-react";

const NotFoundCustom = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-warning-soft/20 to-primary-soft/20 flex items-center justify-center py-8 px-4">
      <Card className="w-full max-w-lg text-center shadow-medium">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center">
            <Construction className="w-8 h-8 text-warning" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Diagnostic en cours de développement
          </CardTitle>
          <CardDescription className="text-lg">
            Cette fonctionnalité sera bientôt disponible sur LSTA Academy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Nous travaillons actuellement sur ce type de diagnostic. 
            En attendant, vous pouvez utiliser le diagnostic du rythme d'apprentissage 
            qui est déjà disponible avec un exemple complet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-primary hover:opacity-90 gap-2"
            >
              <Home className="w-4 h-4" />
              Accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundCustom;