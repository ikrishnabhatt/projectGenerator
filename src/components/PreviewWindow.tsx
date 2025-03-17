
import { useState } from 'react';

const PreviewWindow = () => {
  // This is a placeholder for the actual preview functionality
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b border-gray-200 bg-white">
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'preview' 
              ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'code' 
              ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
              : 'text-gray-600'
          }`}
          onClick={() => setActiveTab('code')}
        >
          Code
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        {activeTab === 'preview' ? (
          <div className="flex flex-col items-center justify-center h-full">
            <img 
              src="https://illustrations.popsy.co/violet/web-design.svg" 
              alt="Web Preview" 
              className="w-64 h-64" 
            />
            <p className="mt-4 text-center text-gray-600">
              This is where your application preview would appear.
              <br />In the real Lovable AI, this would show a live preview of your app.
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 text-gray-300 p-4 rounded-lg font-mono text-sm overflow-auto h-full">
            <pre>{`// Example App.tsx
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My App</h1>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;`}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewWindow;
