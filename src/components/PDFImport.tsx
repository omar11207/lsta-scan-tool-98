import React, { useState, useEffect } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface PDFImportProps {
  onStudentsImported?: (students: string[]) => void;
}

const PDFImport = ({ onStudentsImported }: PDFImportProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);

  useEffect(() => {
    // Charger PDF.js
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      if (window['pdfjs-dist/build/pdf']) {
        window['pdfjs-dist/build/pdf'].GlobalWorkerOptions.workerSrc = 
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        setPdfJsLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    try {
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      
      if (!pdfjsLib) {
        throw new Error('PDF.js non chargé');
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Erreur extraction PDF:', error);
      throw error;
    }
  };

  const extractStudentNames = (text: string): string[] => {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    const names: Set<string> = new Set();
    
    // Pattern amélioré: Prénom NOM COMPLET (capture plusieurs mots en majuscules)
    const namePattern = /([A-ZÀ-Ÿ][a-zà-ÿ]+(?:[\s-][A-ZÀ-Ÿ][a-zà-ÿ]+)*)\s+([A-ZÀ-Ÿ][A-ZÀ-Ÿa-zà-ÿ]+(?:[\s-][A-ZÀ-Ÿ][A-ZÀ-Ÿa-zà-ÿ]+)*)/g;
    let match;
    
    while ((match = namePattern.exec(cleanText)) !== null) {
      const prenom = match[1].trim();
      const nom = match[2].trim();
      const fullName = `${prenom} ${nom}`;
      
      // Vérifier que le nom a au moins 2 mots et une longueur raisonnable
      if (fullName.split(' ').length >= 2 && fullName.length > 4 && fullName.length < 50) {
        names.add(fullName);
      }
    }
    
    // Listes numérotées avec capture complète du nom
    const lines = cleanText.split('\n');
    lines.forEach(line => {
      // Pattern pour liste numérotée: "1. Prénom Nom Complet"
      const numberedMatch = line.match(/^\d+[\.\)]\s*([A-ZÀ-Ÿ][a-zà-ÿ]+(?:[\s-][A-ZÀ-Ÿ][a-zà-ÿ]+)*(?:\s+[A-ZÀ-Ÿ][A-ZÀ-Ÿa-zà-ÿ]+)+)/);
      if (numberedMatch && numberedMatch[1]) {
        const name = numberedMatch[1].trim();
        if (name.split(' ').length >= 2 && name.length > 4 && name.length < 50) {
          names.add(name);
        }
      }
    });
    
    // Pattern alternatif: chercher des lignes avec format "NOM, Prénom"
    const reversedPattern = /([A-ZÀ-Ÿ][A-ZÀ-Ÿa-zà-ÿ]+(?:[\s-][A-ZÀ-Ÿ][A-ZÀ-Ÿa-zà-ÿ]+)*),\s*([A-ZÀ-Ÿ][a-zà-ÿ]+(?:[\s-][A-ZÀ-Ÿ][a-zà-ÿ]+)*)/g;
    
    while ((match = reversedPattern.exec(cleanText)) !== null) {
      const nom = match[1].trim();
      const prenom = match[2].trim();
      const fullName = `${prenom} ${nom}`;
      
      if (fullName.split(' ').length >= 2 && fullName.length > 4 && fullName.length < 50) {
        names.add(fullName);
      }
    }
    
    return Array.from(names).sort();
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setToast({
        message: 'Veuillez sélectionner un fichier PDF',
        type: 'error'
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!pdfJsLoaded) {
      setToast({
        message: 'Chargement de la bibliothèque PDF en cours...',
        type: 'error'
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await extractTextFromPDF(file);
      const studentNames = extractStudentNames(text);
      
      if (studentNames.length === 0) {
        setToast({
          message: 'Aucun nom trouvé dans le PDF',
          type: 'error'
        });
      } else {
        onStudentsImported?.(studentNames);
        setToast({
          message: `${studentNames.length} nom(s) importé(s) avec succès`,
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      setToast({
        message: 'Erreur lors du traitement du PDF',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = () => {
    setIsDragActive(false);
  };

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  return (
    <div className="mb-6">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Import des noms d'élèves</h3>
          <p className="text-sm text-gray-500 mt-1">
            Importez un fichier PDF contenant la liste des noms d'élèves
          </p>
        </div>
        
        <div className="p-6">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={onFileSelect}
              className="hidden"
              id="pdf-upload"
              disabled={isProcessing || !pdfJsLoaded}
            />
            
            <label htmlFor="pdf-upload" className="cursor-pointer">
              {isProcessing ? (
                <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
              ) : (
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              )}
              
              {!pdfJsLoaded ? (
                <p className="text-gray-600 font-medium">Chargement...</p>
              ) : isProcessing ? (
                <p className="text-blue-600 font-medium">Traitement en cours...</p>
              ) : isDragActive ? (
                <p className="text-blue-600 font-medium">Déposez le fichier ici...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2 font-medium">
                    Glissez-déposez un PDF ici, ou cliquez pour sélectionner
                  </p>
                  <p className="text-sm text-gray-500">
                    Le PDF doit contenir une liste de noms d'élèves
                  </p>
                </div>
              )}
            </label>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Formats acceptés :</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Liste numérotée (1. Nom Prénom, 2. Nom Prénom...)</li>
                  <li>Liste simple (Nom Prénom sur chaque ligne)</li>
                  <li>Tableau avec colonnes nom/prénom</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFImport;