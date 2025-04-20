import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './pages/Popup'; // ポップアップ画面のメインコンポーネント
import './styles/index.css'; // スタイルシートをインポート

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
); 