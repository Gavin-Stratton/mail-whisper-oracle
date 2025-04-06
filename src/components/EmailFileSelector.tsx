
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { EmailSource } from '@/types';
import { Folder, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EmailFileSelector: React.FC = () => {
  const { emailSources, addEmailSource, removeEmailSource } = useApp();
  const directoryInputRef = useRef<HTMLInputElement>(null);

  const handleDirectorySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // Just using the first file to get the directory path in this mock
      const file = files[0];
      const path = file.webkitRelativePath;
      
      if (!path) {
        toast.error("Couldn't get directory path. Please try again.");
        return;
      }
      
      // Extract folder name from path (first segment)
      const folderName = path.split('/')[0];
      
      // Check if directory is already selected
      const alreadySelected = emailSources.some(source => source.name === folderName);
      if (alreadySelected) {
        toast.error(`Directory "${folderName}" is already selected.`);
        return;
      }
      
      // Create new email source for the directory
      const newSource: EmailSource = {
        id: crypto.randomUUID(),
        path: folderName,
        type: 'directory',
        name: folderName,
        size: 0 // We don't have actual size for directories in this mock
      };

      addEmailSource(newSource);
      
      // Log for debugging
      console.log("Current email sources:", [...emailSources, newSource]);
    } catch (error) {
      console.error("Error selecting directory:", error);
      toast.error("There was an error selecting the directory. Please try again.");
    } finally {
      // Reset input
      if (directoryInputRef.current) directoryInputRef.current.value = '';
    }
  };

  const triggerDirectorySelect = () => {
    try {
      // Dynamically add the directory attributes
      const input = directoryInputRef.current;
      if (input) {
        input.setAttribute('webkitdirectory', '');
        input.setAttribute('directory', '');
        input.click();
      }
    } catch (error) {
      console.error("Error triggering directory select:", error);
      toast.error("There was an error opening the directory selector. Please try again.");
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Email Directory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Directory Input Button */}
          <div className="flex justify-center">
            <input
              type="file"
              ref={directoryInputRef}
              onChange={handleDirectorySelect}
              className="hidden"
              id="directory-input"
            />
            <Button 
              onClick={triggerDirectorySelect}
              className="w-full"
              variant="outline"
            >
              <Folder className="mr-2 h-4 w-4" />
              Select Email Directory
            </Button>
          </div>

          {/* Display selected directories */}
          {emailSources.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Selected Email Directories:</h3>
              <ul className="space-y-2">
                {emailSources.map((source) => (
                  <li key={source.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <div className="ml-2">
                        <p className="text-sm font-medium">{source.name}</p>
                        <p className="text-xs text-muted-foreground">{source.path}</p>
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
