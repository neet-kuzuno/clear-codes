import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import copyIconUrl from '/icons/copy-icon.png';

const OutputBox = ({ outputDisplay, result, error, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

  // コピー状態をリセット
  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  // テキストをクリップボードにコピーする
  const copyToClipboard = () => {
    // 結果がない場合は何もしない
    if (!result) {
      console.log('何もコピーするものがありません');
      return;
    }
    
    try {
      // クリップボードAPIを使用
      navigator.clipboard.writeText(result)
        .then(() => {
          console.log('コピー成功');
          setCopied(true);
        })
        .catch(err => {
          console.error('コピーに失敗しました:', err);
          // フォールバック方法
          fallbackCopy();
        });
    } catch (err) {
      console.error('コピーエラー:', err);
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = result;
      textArea.style.position = 'fixed';  // 画面外に配置
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        console.log('フォールバックコピー成功');
        setCopied(true);
      } else {
        console.error('フォールバックコピー失敗');
      }
    } catch (e) {
      console.error('フォールバックコピー例外:', e);
    }
  };

  // 出力コンテンツの整形
  const formatOutput = (text) => {
    // HTMLを安全に挿入するために必要
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  };

  // 出力コンテンツを定義
  let content;
  switch (outputDisplay) {
    case 'loading':
      content = (
        <div className="flex items-center justify-center h-[120px]">
          <motion.div 
            className="w-12 h-12 rounded-full border-t-2 border-b-2 border-purple-500"
            animate={{ rotate: 360 }}
            transition={{ 
              repeat: Infinity, 
              duration: 1, 
              ease: "linear"
            }}
          />
        </div>
      );
      break;
    case 'error':
      content = (
        <div className="flex items-center justify-center h-[120px] text-red-400">
          <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
          <span>エラーが発生しました: {error}</span>
        </div>
      );
      break;
    case 'result':
      content = (
        <div 
          ref={outputRef}
          className="output-content"
          style={{
            padding: '12px 16px',
            lineHeight: '1.7',
            fontSize: '0.9rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontFamily: 'var(--vscode-font)',
            color: '#f9fafb'
          }}
          dangerouslySetInnerHTML={{ __html: formatOutput(result) }}
        />
      );
      break;
    default:
      content = (
        <div className="flex items-center justify-center h-[120px] text-gray-500">
          <span style={{ color: 'rgba(156, 163, 175, 0.8)', userSelect: 'none' }}>
            ここに出力が表示されます
          </span>
        </div>
      );
  }

  return (
    <div className="output-group">
      <div className="output-header" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px'}}>
        <label className="input-label">Output</label>
        <div className="output-buttons" style={{display: 'flex', gap: '6px'}}>
          {/* シンプルなHTMLボタン - コピー */}
          <button 
            onClick={copyToClipboard}
            className="action-btn"
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: copied ? '#10B981' : 'rgba(55, 65, 81, 0.5)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            title="コピー"
          >
            {copied ? (
              <CheckCircleIcon style={{width: '18px', height: '18px', color: 'white'}} />
            ) : (
              <img 
                src={copyIconUrl} 
                alt="コピー" 
                style={{width: '18px', height: '18px', filter: 'brightness(0) invert(1)'}} 
              />
            )}
          </button>
          
          {/* シンプルなHTMLボタン - 再生成 */}
          {onRegenerate && (
            <button 
              onClick={onRegenerate}
              className="action-btn"
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: 'rgba(55, 65, 81, 0.5)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              title="さらにわかりやすく"
            >
              <span style={{fontSize: '16px', lineHeight: 1}}>✨</span>
            </button>
          )}
        </div>
      </div>
      <div className="output-container bg-gray-800 rounded-md border border-gray-700 overflow-hidden">
        {content}
      </div>
    </div>
  );
};

export default OutputBox; 