import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle, LogIn, UserPlus } from 'lucide-react';

interface GuestPromptProps {
  title?: string;
  description?: string;
  showAlertBox?: boolean;
  className?: string;
}

/**
 * Component to display when guest users try to access protected features.
 * Shows a prompt to sign in or create an account.
 */
export function GuestPrompt({
  title = 'Créez un compte pour continuer',
  description = 'Connectez-vous ou inscrivez-vous pour accéder à cette fonctionnalité.',
  showAlertBox = true,
  className = '',
}: GuestPromptProps) {
  const navigate = useNavigate();

  return (
    <Alert className={`border-amber-200 bg-amber-50 ${className}`}>
      <AlertCircle className="size-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <p className="font-semibold mb-2">{title}</p>
        <p className="text-sm mb-3">{description}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-amber-600 text-amber-600 hover:bg-amber-100"
            onClick={() => navigate('/login')}
          >
            <LogIn className="size-3 mr-1" />
            Connexion
          </Button>
          <Button
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
            onClick={() => navigate('/register')}
          >
            <UserPlus className="size-3 mr-1" />
            S'inscrire
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
