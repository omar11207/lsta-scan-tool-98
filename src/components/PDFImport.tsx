import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PDFImportProps {
  onStudentsImported?: (students: string[]) => void;
}

const PDFImport = ({ onStudentsImported }: PDFImportProps) => {
  const { toast } = useToast();

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type === 'application/pdf') {
      // Simuler l'extraction des noms depuis le PDF
      // En réalité, vous pourriez utiliser une bibliothèque comme pdf-parse
      const mockStudentNames = [
        "Ahmed El Mansouri",
        "Fatima Benali", 
        "Youssef Alaoui",
        "Salma Cherkaoui",
        "Omar Benjelloun"
      ];
      
      onStudentsImported?.(mockStudentNames);
      
      toast({
        title: "Import réussi",
        description: `${mockStudentNames.length} noms d'élèves importés depuis le PDF`,
      });
    } else {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner un fichier PDF",
        variant: "destructive",
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  return (
    <Card className="mb-6 border-dashed">
      <CardHeader>
        <CardTitle className="text-lg">Import des noms d'élèves (optionnel)</CardTitle>
        <CardDescription>
          Importez un fichier PDF contenant la liste des noms d'élèves pour pré-remplir la grille
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-primary">Déposez le fichier PDF ici...</p>
          ) : (
            <div>
              <p className="text-muted-foreground mb-1">
                Glissez-déposez un fichier PDF ici, ou cliquez pour sélectionner
              </p>
              <p className="text-sm text-muted-foreground">
                Formats supportés: PDF uniquement
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFImport;