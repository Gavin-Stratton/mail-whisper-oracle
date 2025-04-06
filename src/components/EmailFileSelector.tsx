
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { EmailSource } from '@/types';
import { Trash2, Upload } from 'lucide-react';

const EmailFileSelector: React.FC = () => {
  const { emailSources, addEmailSource, removeEmailSource } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert FileList to Array to iterate
    Array.from(files).forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'other';
      let type: EmailSource['type'] = 'other';
      
      if (extension === 'pst') type = 'pst';
      else if (extension === 'olm') type = 'olm';
      else if (extension === 'mbox') type = 'mbox';

      // Create new email source
      const newSource: EmailSource = {
        id: crypto.randomUUID(),
        path: file.webkitRelativePath || file.name, // Just for display in the mock
        type,
        name: file.name,
        size: file.size
      };

      addEmailSource(newSource);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Email Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* File Input Button */}
          <div className="flex justify-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pst,.olm,.mbox,application/vnd.ms-outlook,application/mac-outlook,application/mbox"
              multiple
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Email Files (.pst, .olm, .mbox)
            </Button>
          </div>

          {/* Display selected files */}
          {emailSources.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Selected Email Files:</h3>
              <ul className="space-y-2">
                {emailSources.map((source) => (
                  <li key={source.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <div className="flex items-center">
                      <div className="ml-2">
                        <p className="text-sm font-medium">{source.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(source.size / (1024 * 1024)).toFixed(2)} MB • {source.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmailSource(source.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailFileSelector;
