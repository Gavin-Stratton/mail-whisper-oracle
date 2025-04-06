
import React from 'react';
import { AppProvider } from '@/context/AppContext';
import EmailFileSelector from '@/components/EmailFileSelector';
import FolderSelector from '@/components/FolderSelector';
import ModelFileSelector from '@/components/ModelFileSelector';
import TrainingProgress from '@/components/TrainingProgress';
import ChatInterface from '@/components/ChatInterface';

const Index = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Local Email & Data Analysis</h1>
            <p className="text-gray-600 mt-1">Analyze your emails and data with a local LLM</p>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-6 md:col-span-1">
              <EmailFileSelector />
              <FolderSelector />
              <ModelFileSelector />
              <TrainingProgress />
            </div>
            
            <div className="md:col-span-2">
              <ChatInterface />
            </div>
          </div>
        </main>
        
        <footer className="bg-white shadow-inner mt-8">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              This application runs entirely on your local machine and does not send your data over the internet.
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
};

export default Index;
