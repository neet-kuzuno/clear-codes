import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowPathIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const OutputBox = ({
  outputText = '',
  isLoading = false,
  error = null,
  onCopy = () => {},
  onRegenerate = () => {},
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Reset copied state after 2 seconds
  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  // Handle copy text
  const copyToClipboard = async () => {
    if (!outputText || isLoading) return;
    
    try {
      // Try to use the Clipboard API
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      if (onCopy) onCopy(outputText);
    } catch (err) {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = outputText;
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        setCopied(true);
        if (onCopy) onCopy(outputText);
      } catch (e) {
        console.error('Fallback copy failed:', e);
      }
      
      document.body.removeChild(textArea);
    }
  };

  return (
    <motion.div 
      className={`relative bg-gray-800 rounded-md overflow-hidden border border-gray-700 shadow-lg ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <motion.h3 
            className="input-label"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1, color: isFocused ? '#A78BFA' : '#8B5CF6' }}
            transition={{ duration: 0.2 }}
          >
            Output
          </motion.h3>
          <div className="flex space-x-2">
            {outputText && !isLoading && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyToClipboard}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                  aria-label="コピー"
                  title="コピー"
                  disabled={isLoading || !outputText}
                >
                  {copied ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  )}
                </motion.button>
                {onRegenerate && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onRegenerate}
                    className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    aria-label="再生成"
                    title="再生成"
                    disabled={isLoading}
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </motion.button>
                )}
              </>
            )}
          </div>
        </div>

        <div 
          ref={outputRef}
          className="output-content rounded-md bg-gray-900 p-3 text-gray-100 min-h-[120px] max-h-[400px] overflow-y-auto"
          style={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            overflowWrap: 'break-word',
            width: '100%',
            overflowX: 'hidden'
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center text-red-400 h-full">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          ) : outputText ? (
            <div style={{ fontSize: "1rem", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: outputText }} />
          ) : (
            <div style={{ 
              color: 'rgba(156, 163, 175, 0.8)',
              fontFamily: 'inherit', 
              fontSize: '0.875rem',
              userSelect: 'none'
            }} className="flex items-center justify-center h-full">
              ここに出力が表示されます
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default OutputBox; 