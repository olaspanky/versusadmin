import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CustomAlertProps {
  message: string;
  type: 'success' | 'error' | null;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type }) => {
  if (!message) return null;

  return (
    <Alert className={`mb-4 ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      <AlertTitle>{type === 'success' ? 'Success' : 'Error'}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default CustomAlert;
