import React from 'react';
import ReactDOM from 'react-dom/client';
import Options from './pages/Options'; // 設定画面のメインコンポーネント
import './styles/index.css'; // スタイルシートをインポート

ReactDOM.createRoot(document.getElementById('options-root')).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
); 