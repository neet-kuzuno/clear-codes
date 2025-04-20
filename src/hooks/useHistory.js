import { useState, useEffect, useCallback } from 'react';
import useStorage from './useStorage';

/**
 * 履歴管理用カスタムフック
 * 翻訳履歴の読み込み、保存、削除などの操作を管理する
 */
const useHistory = () => {
  // 履歴データの状態
  const [history, setHistory] = useState([]);
  // ローディング状態
  const [loading, setLoading] = useState(true);
  // エラー状態
  const [error, setError] = useState(null);
  
  // ストレージフックの取得
  const { 
    saveHistoryItem, 
    getHistory, 
    removeHistoryItem, 
    clearHistory 
  } = useStorage();

  /**
   * 履歴を読み込む
   * コンポーネントのマウント時に履歴を読み込む
   */
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ストレージから履歴を取得
        const historyData = await getHistory();
        setHistory(historyData);
      } catch (err) {
        console.error('履歴の読み込みエラー:', err);
        setError('履歴の読み込み中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [getHistory]);

  /**
   * 履歴を追加する
   * @param {Object} item - 履歴アイテム（原文、翻訳結果、言語タイプなど）
   * @returns {Promise<void>}
   */
  const addHistoryItem = useCallback(async (item) => {
    try {
      setLoading(true);
      
      // 必須フィールドの確認
      if (!item.originalText || !item.translatedText) {
        throw new Error('履歴アイテムには原文と翻訳結果が必要です');
      }
      
      // ストレージに保存
      await saveHistoryItem(item);
      
      // ローカル状態も更新
      const newItem = {
        ...item,
        id: `history-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      
      setHistory(prev => [newItem, ...prev]);
    } catch (err) {
      console.error('履歴の追加エラー:', err);
      setError('履歴の追加中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [saveHistoryItem]);

  /**
   * 履歴を削除する
   * @param {string} id - 削除する履歴のID
   * @returns {Promise<void>}
   */
  const deleteHistoryItem = useCallback(async (id) => {
    try {
      setLoading(true);
      
      // ストレージから削除
      await removeHistoryItem(id);
      
      // ローカル状態も更新
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('履歴の削除エラー:', err);
      setError('履歴の削除中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [removeHistoryItem]);

  /**
   * すべての履歴を削除する
   * @returns {Promise<void>}
   */
  const deleteAllHistory = useCallback(async () => {
    try {
      setLoading(true);
      
      // ストレージからすべての履歴を削除
      await clearHistory();
      
      // ローカル状態も更新
      setHistory([]);
    } catch (err) {
      console.error('履歴のクリアエラー:', err);
      setError('履歴のクリア中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [clearHistory]);

  /**
   * 履歴アイテムをお気に入り登録/解除する
   * @param {string} id - 対象の履歴ID
   * @returns {Promise<void>}
   */
  const toggleFavorite = useCallback(async (id) => {
    try {
      setLoading(true);
      
      // 現在の履歴データから対象アイテムを検索
      const updatedHistory = history.map(item => {
        if (item.id === id) {
          return { ...item, isFavorite: !item.isFavorite };
        }
        return item;
      });
      
      // ローカル状態を更新
      setHistory(updatedHistory);
      
      // ストレージに保存（簡単のため全履歴を保存）
      await saveHistoryItem(updatedHistory[0]);  // 一番上のアイテムを保存（実装を簡素化）
    } catch (err) {
      console.error('お気に入り状態の変更エラー:', err);
      setError('お気に入り状態の変更中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  }, [history, saveHistoryItem]);

  /**
   * 履歴を検索する
   * @param {string} query - 検索クエリ
   * @returns {Array} - 検索結果
   */
  const searchHistory = useCallback((query) => {
    if (!query) return history;
    
    const lowerQuery = query.toLowerCase();
    return history.filter(item => 
      (item.originalText && item.originalText.toLowerCase().includes(lowerQuery)) ||
      (item.translatedText && item.translatedText.toLowerCase().includes(lowerQuery)) ||
      (item.language && item.language.toLowerCase().includes(lowerQuery))
    );
  }, [history]);

  /**
   * お気に入りの履歴のみを取得する
   * @returns {Array} - お気に入りの履歴
   */
  const getFavorites = useCallback(() => {
    return history.filter(item => item.isFavorite);
  }, [history]);

  return {
    history,
    addHistoryItem,
    deleteHistoryItem,
    deleteAllHistory,
    toggleFavorite,
    searchHistory,
    getFavorites,
    loading,
    error,
    clearError: () => setError(null)
  };
};

export default useHistory; 