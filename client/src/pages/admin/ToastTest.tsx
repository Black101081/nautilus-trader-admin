import { useState } from 'react';
import { ToastContainer, useToast } from '../../components/Toast';
import { logger } from '../../utils/logger';

export default function ToastTest() {
  const { toasts, removeToast, success, error, warning, info } = useToast();
  const [clickCount, setClickCount] = useState(0);

  logger.component('ToastTest', 'Component mounted');
  logger.info('ToastTest', `Toasts array length: ${toasts.length}`);

  const handleTestSuccess = () => {
    const count = clickCount + 1;
    setClickCount(count);
    logger.info('ToastTest', `Success button clicked (${count})`);
    success(`Success toast #${count}`, 'This is a test success message');
    logger.info('ToastTest', `After success() call, toasts length: ${toasts.length}`);
  };

  const handleTestError = () => {
    const count = clickCount + 1;
    setClickCount(count);
    logger.info('ToastTest', `Error button clicked (${count})`);
    error(`Error toast #${count}`, 'This is a test error message');
  };

  const handleTestWarning = () => {
    const count = clickCount + 1;
    setClickCount(count);
    logger.info('ToastTest', `Warning button clicked (${count})`);
    warning(`Warning toast #${count}`, 'This is a test warning message');
  };

  const handleTestInfo = () => {
    const count = clickCount + 1;
    setClickCount(count);
    logger.info('ToastTest', `Info button clicked (${count})`);
    info(`Info toast #${count}`, 'This is a test info message');
  };

  logger.render('ToastTest', `Rendering with ${toasts.length} toasts`);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Toast Test Page</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Test Toast Notifications</h2>
          
          <div className="space-y-4">
            <button
              onClick={handleTestSuccess}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Test Success Toast
            </button>
            
            <button
              onClick={handleTestError}
              className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Test Error Toast
            </button>
            
            <button
              onClick={handleTestWarning}
              className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
            >
              Test Warning Toast
            </button>
            
            <button
              onClick={handleTestInfo}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Test Info Toast
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Debug Info</h2>
          <div className="space-y-2 text-gray-300">
            <p>Click Count: <span className="text-white font-mono">{clickCount}</span></p>
            <p>Toasts in Array: <span className="text-white font-mono">{toasts.length}</span></p>
            <p>useToast Hook: <span className="text-green-400 font-mono">✓ Loaded</span></p>
            <p>ToastContainer: <span className="text-green-400 font-mono">✓ Rendered</span></p>
          </div>
          
          {toasts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">Active Toasts:</h3>
              <ul className="space-y-1">
                {toasts.map((toast) => (
                  <li key={toast.id} className="text-sm text-gray-400">
                    [{toast.type}] {toast.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-gray-400 text-sm">
          Check browser console for detailed logs
        </div>
      </div>
    </div>
  );
}

