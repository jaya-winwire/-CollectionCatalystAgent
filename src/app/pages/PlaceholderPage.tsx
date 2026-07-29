import React from 'react';
import { FileQuestion } from 'lucide-react';
import AppLayout from '../components/AppLayout';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <AppLayout>
      <div className="min-h-full bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">{description}</p>
          <div className="inline-block px-6 py-3 bg-gray-100 text-gray-600 rounded-lg text-sm">
            This page is under construction
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default PlaceholderPage;
