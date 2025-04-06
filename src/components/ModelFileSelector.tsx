
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { FileCode, Trash2 } from 'lucide-react';

const ModelFileSelector: React.FC = () => {
  const { modelFile, setModelFile } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Create new model file
    const newModelFile = {
      id: crypto.randomUUID(),
      path: file.name, // Just for display in the mock
      name: file.name,
      size: file.size
    };

    setModelFile(newModelFile);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">LLM Model File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* File Input Button */}
          <div className="flex justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant="outline"
              disabled={!!modelFile}
            >
              <FileCode className="mr-2 h-4 w-4" />
              {modelFile ? "Model Selected" : "Select LLM Model File"}
            </Button>
          </div>

          {/* Display selected model file */}
          {modelFile && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Selected Model:</h3>
              <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center">
                  <FileCode className="h-4 w-4 text-primary" />
                  <div className="ml-2">
                    <p className="text-sm font-medium">{modelFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(modelFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setModelFile(null)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelFileSelector;
