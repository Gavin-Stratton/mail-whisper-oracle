
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EmailSource, FolderSource, ModelFile, TrainingStatus, ChatMessage } from '@/types';

interface AppContextType {
  emailSources: EmailSource[];
  folderSources: FolderSource[];
  modelFile: ModelFile | null;
  trainingStatus: TrainingStatus;
  chatMessages: ChatMessage[];
  addEmailSource: (source: EmailSource) => void;
  removeEmailSource: (id: string) => void;
  addFolderSource: (source: FolderSource) => void;
  removeFolderSource: (id: string) => void;
  setModelFile: (file: ModelFile | null) => void;
  updateTrainingStatus: (status: Partial<TrainingStatus>) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatMessages: () => void;
  startTraining: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [emailSources, setEmailSources] = useState<EmailSource[]>([]);
  const [folderSources, setFolderSources] = useState<FolderSource[]>([]);
  const [modelFile, setModelFile] = useState<ModelFile | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>({
    status: 'idle',
    progress: 0,
    message: 'Ready to start training',
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const addEmailSource = (source: EmailSource) => {
    setEmailSources((prev) => [...prev, source]);
  };

  const removeEmailSource = (id: string) => {
    setEmailSources((prev) => prev.filter((source) => source.id !== id));
  };

  const addFolderSource = (source: FolderSource) => {
    if (folderSources.length < 3) {
      setFolderSources((prev) => [...prev, source]);
    }
  };

  const removeFolderSource = (id: string) => {
    setFolderSources((prev) => prev.filter((source) => source.id !== id));
  };

  const updateTrainingStatus = (status: Partial<TrainingStatus>) => {
    setTrainingStatus((prev) => ({ ...prev, ...status }));
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const clearChatMessages = () => {
    setChatMessages([]);
  };

  // Mock training process for the frontend
  const startTraining = () => {
    if (!modelFile || (emailSources.length === 0 && folderSources.length === 0)) {
      updateTrainingStatus({
        status: 'failed',
        message: 'Please select model file and at least one data source',
      });
      return;
    }

    // Start the training process
    updateTrainingStatus({
      status: 'preparing',
      progress: 0,
      message: 'Preparing data for training...',
    });

    // Simulate training progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress <= 30) {
        updateTrainingStatus({
          status: 'preparing',
          progress,
          message: 'Preprocessing data sources...',
        });
      } else if (progress <= 90) {
        updateTrainingStatus({
          status: 'training',
          progress,
          message: `Training in progress: ${progress}%`,
        });
      } else {
        clearInterval(interval);
        updateTrainingStatus({
          status: 'completed',
          progress: 100,
          message: 'Training completed successfully',
        });
        
        // Add system message to chat
        addChatMessage({
          role: 'system',
          content: 'Training completed. You can now chat with the AI about your email and folder data.',
        });
      }
    }, 500);
  };

  const value = {
    emailSources,
    folderSources,
    modelFile,
    trainingStatus,
    chatMessages,
    addEmailSource,
    removeEmailSource,
    addFolderSource,
    removeFolderSource,
    setModelFile,
    updateTrainingStatus,
    addChatMessage,
    clearChatMessages,
    startTraining,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
