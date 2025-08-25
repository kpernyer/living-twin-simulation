import React from 'react';

export default function TestCSS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 safari-fix p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          CSS Test Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Component Test */}
          <div className="card safari-render">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Card Component</h2>
            <p className="text-gray-600 mb-4">
              This card should have a white background, rounded corners, and shadow.
            </p>
            <button className="btn-primary">Primary Button</button>
          </div>
          
          {/* Button Tests */}
          <div className="card safari-render">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Button Components</h2>
            <div className="space-y-3">
              <button className="btn-primary w-full">Primary Button</button>
              <button className="btn-secondary w-full">Secondary Button</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors w-full">
                Success Button
              </button>
            </div>
          </div>
          
          {/* Input Tests */}
          <div className="card safari-render">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Input Components</h2>
            <div className="space-y-3">
              <input 
                type="text" 
                placeholder="Text input" 
                className="input-field"
              />
              <select className="input-field">
                <option>Select option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
              <textarea 
                placeholder="Textarea" 
                rows={3}
                className="input-field resize-none"
              />
            </div>
          </div>
          
          {/* Gradient Tests */}
          <div className="card safari-render">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gradient Tests</h2>
            <div className="space-y-3">
              <div className="h-20 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-semibold">
                Primary Gradient
              </div>
              <div className="h-20 bg-gradient-secondary rounded-lg flex items-center justify-center text-white font-semibold">
                Secondary Gradient
              </div>
              <div className="h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                Tailwind Gradient
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="mt-8 card safari-render">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Indicators</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">Active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-yellow-800">Warning</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-800">Error</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
