import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Package } from 'lucide-react';

interface LuggageVerificationModalProps {
  isOpen: boolean;
  luggageDimension: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LuggageVerificationModal({
  isOpen,
  luggageDimension,
  onConfirm,
  onCancel,
}: LuggageVerificationModalProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-3 bg-amber-100 rounded-full">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <AlertDialogTitle className="text-xl">Vérification des bagages</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="space-y-3">
          <div>
            <p className="font-medium text-gray-900 mb-2">
              Bagage de dimension: <span className="text-amber-600">{getLuggageSizeLabel(luggageDimension)}</span>
            </p>
            <p className="text-sm text-gray-600">
              Votre bagage dépasse la taille standard. Le conducteur doit confirmer qu'il peut l'accepter.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-900">
              💡 <span className="font-medium">Conseil:</span> Contactez le conducteur pour confirmer qu'il peut accueillir votre bagage avant de soumettre votre demande.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Dimensions estimées:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {luggageDimension === 'large' && (
                <>
                  <li>• Valise grande (entre 68-82 cm)</li>
                  <li>• Poids approx. 25-32 kg</li>
                </>
              )}
              {luggageDimension === 'oversized' && (
                <>
                  <li>• Très grande valise ou colis (plus de 82 cm)</li>
                  <li>• Poids approx. plus de 32 kg</li>
                </>
              )}
            </ul>
          </div>
        </AlertDialogDescription>

        <div className="flex gap-3 mt-6">
          <AlertDialogCancel onClick={onCancel} className="flex-1">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="flex-1 bg-amber-600 hover:bg-amber-700">
            Envoyer la demande
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function getLuggageSizeLabel(size: string): string {
  const labels: Record<string, string> = {
    small: 'Petit (sac à dos)',
    medium: 'Moyen (valise cabine)',
    large: 'Grand (valise)',
    oversized: 'Très grand (colis)',
  };
  return labels[size] || size;
}
