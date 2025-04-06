
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/context/AppContext';
import { AlertCircle, CheckCircle, Loader2, Play } from 'lucide-react';

const TrainingProgress: React.FC = () => {
  const { trainingStatus, startTraining, emailSources, folderSources, modelFile } = useApp();
  
  const isTrainingDisabled = 
    trainingStatus.status === 'training' || 
    trainingStatus.status === 'preparing' ||
    !modelFile || 
    (emailSources.length === 0 && folderSources.length === 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Training Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={trainingStatus.progress} className="h-2" />
          
          <div className="flex items-center mt-2">
            {trainingStatus.status === 'idle' && (
              <div className="text-sm text-muted-foreground">Ready to start training</div>
            )}
            
            {trainingStatus.status === 'preparing' && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                <div className="text-sm">{trainingStatus.message}</div>
              </>
            )}
            
            {trainingStatus.status === 'training' && (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin text-primary" />
                <div className="text-sm">{trainingStatus.message}</div>
              </>
            )}
            
            {trainingStatus.status === 'completed' && (
              <>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <div className="text-sm text-green-600">{trainingStatus.message}</div>
              </>
            )}
            
            {trainingStatus.status === 'failed' && (
              <>
                <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
                <div className="text-sm text-destructive">{trainingStatus.message}</div>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={startTraining} 
          className="w-full"
          disabled={isTrainingDisabled}
        >
          {trainingStatus.status === 'preparing' || trainingStatus.status === 'training' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Training in Progress
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Training
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrainingProgress;
