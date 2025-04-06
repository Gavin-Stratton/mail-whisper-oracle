
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { Folder, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const FolderSelector: React.FC = () => {
  const { folderSources, addFolderSource, removeFolderSource } = useApp();
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // Get the selected folder (we're just using the first file's path in this mock)
      const file = files[0];
      const path = file.webkitRelativePath;
      
      if (!path) {
        toast.error("Couldn't get folder path. Please try again.");
        return;
      }
      
      // Extract folder name from path (first segment)
      const folderName = path.split('/')[0];
      
      // Create new folder source
      const newSource = {
        id: crypto.randomUUID(),
        path: folderName, // Just for display in the mock
        name: folderName
      };

      addFolderSource(newSource);
    } catch (error) {
      console.error("Error selecting folder:", error);
      toast.error("There was an error selecting the folder. Please try again.");
    } finally {
      // Reset input
      if (folderInputRef.current) folderInputRef.current.value = '';
    }
  };

  const triggerFolderSelect = () => {
    try {
      // Dynamically add the directory attributes
      const input = folderInputRef.current;
      if (input) {
        input.setAttribute('webkitdirectory', '');
        input.setAttribute('directory', '');
        input.click();
      }
    } catch (error) {
      console.error("Error triggering folder select:", error);
      toast.error("There was an error opening the folder selector. Please try again.");
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          <span>Data Folders</span>
          <Badge variant="outline">{folderSources.length}/3 Selected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Folder Input Button */}
          <div className="flex justify-center">
            <input
              type="file"
              ref={folderInputRef}
              onChange={handleFolderSelect}
              className="hidden"
              id="folder-input"
            />
            <Button 
              onClick={triggerFolderSelect}
              className="w-full"
              variant="outline"
              disabled={folderSources.length >= 3}
            >
              <Folder className="mr-2 h-4 w-4" />
              {folderSources.length >= 3 
                ? "Maximum folders selected (3)"
                : "Select Data Folder"}
            </Button>
          </div>

          {/* Display selected folders */}
          {folderSources.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Selected Folders:</h3>
              <ul className="space-y-2">
                {folderSources.map((source) => (
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
                      onClick={() => removeFolderSource(source.id)}
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

export default FolderSelector;
