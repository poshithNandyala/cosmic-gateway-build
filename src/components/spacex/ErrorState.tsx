
import { Rocket, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <div className="container mx-auto px-6">
      <div className="text-center py-20">
        <div className="text-red-400 mb-4">
          <Rocket className="w-16 h-16 mx-auto mb-4" />
          <p className="text-xl">{error}</p>
        </div>
        <Button onClick={onRetry} className="bg-orange-500 hover:bg-orange-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
