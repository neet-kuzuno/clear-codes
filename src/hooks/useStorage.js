import React, { useState, useEffect, useCallback } from 'react';
import { saveData, getData, removeData, saveApiKey, getApiKey } from '../utils/storage';

/**
 * Storage管理用カスタムフック
 * Chrome Storageとの連携を行い、設定や履歴などのデータを管理する
 */
const useStorage = () => {
  // 設定データの状態
  const [settings, setSettings] = useState({
    apiKey: '',
    theme: 'dark',
    fontSize: 14,
    languageMode: 'simple',
    maxHistoryItems: 50,
  });

  // ローディング状態
  const [loading, setLoading] = useState(true);
  // エラー状態
  const [error, setError] = useState(null);

  /**
   * 設定を初期化する
   * コンポーネントのマウント時に設定を読み込む
   */
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // API キーを取得
        const apiKey = await getApiKey() || '';
        
        // 他の設定を取得
        const theme = await getData('theme') || 'dark';
        const fontSize = await getData('fontSize') || 14;
        const languageMode = await getData('languageMode') || 'simple';
        const maxHistoryItems = await getData('maxHistoryItems') || 50;

        // 設定を更新
        setSettings({
          apiKey,
          theme,
          fontSize,
          languageMode,
          maxHistoryItems,
        });
      } catch (err) {
        console.error('設定の読み込みエラー:', err);
        setError('設定の読み込み中にエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  /**
   * APIキーを保存する
   * @param {string} newApiKey - 新しいAPIキー
   * @returns {Promise<void>}
   */
  const updateApiKey = useCallback(async (newApiKey) => {
    try {
      setLoading(true);
      await saveApiKey(newApiKey);
      setSettings(prev => ({ ...prev, apiKey: newApiKey }));
    } catch (err) {
      console.error('APIキーの保存エラー:', err);
      setError('APIキーの保存中にエラーが発生しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * テーマを更新する
   * @param {string} newTheme - 新しいテーマ ('light', 'dark', 'system')
   * @returns {Promise<void>}
   */
  const updateTheme = useCallback(async (newTheme) => {
    try {
      setLoading(true);
      await saveData('theme', newTheme);
      setSettings(prev => ({ ...prev, theme: newTheme }));
    } catch (err) {
      console.error('テーマの保存エラー:', err);
      setError('テーマの保存中にエラーが発生しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * フォントサイズを更新する
   * @param {string} newFontSize - 新しいフォントサイズ ('small', 'medium', 'large')
   * @returns {Promise<void>}
   */
  const updateFontSize = useCallback(async (newFontSize) => {
    try {
      setLoading(true);
      await saveData('fontSize', newFontSize);
      setSettings(prev => ({ ...prev, fontSize: newFontSize }));
    } catch (err) {
      console.error('フォントサイズの保存エラー:', err);
      setError('フォントサイズの保存中にエラーが発生しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 言語モードを更新する
   * @param {string} newLanguageMode - 新しい言語モード ('simple', 'detailed')
   * @returns {Promise<void>}
   */
  const updateLanguageMode = useCallback(async (newLanguageMode) => {
    try {
      setLoading(true);
      await saveData('languageMode', newLanguageMode);
      setSettings(prev => ({ ...prev, languageMode: newLanguageMode }));
    } catch (err) {
      console.error('言語モードの保存エラー:', err);
      setError('言語モードの保存中にエラーが発生しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 最大履歴数を更新する
   * @param {number} newMaxHistoryItems - 新しい最大履歴数
   * @returns {Promise<void>}
   */
  const updateMaxHistoryItems = useCallback(async (newMaxHistoryItems) => {
    try {
      setLoading(true);
      await saveData('maxHistoryItems', newMaxHistoryItems);
      setSettings(prev => ({ ...prev, maxHistoryItems: newMaxHistoryItems }));
    } catch (err) {
      console.error('最大履歴数の保存エラー:', err);
      setError('最大履歴数の保存中にエラーが発生しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * すべての設定を一度に更新する
   * @param {Object} newSettings - 新しい設定オブジェクト
   * @returns {Promise<void>}
   */
  const updateAllSettings = useCallback(async (newSettings) => {
    try {
      setLoading(true);
      
      // APIキーの更新（存在する場合のみ）
      if (newSettings.apiKey !== undefined) {
        await saveApiKey(newSettings.apiKey);
      }
      
      // その他の設定更新
      const settingsToUpdate = {
        theme: newSettings.theme,
        fontSize: newSettings.fontSize,
        languageMode: newSettings.languageMode,
        maxHistoryItems: newSettings.maxHistoryItems,
      };
      
      // 未定義の項目をフィルタリング
      const filteredSettings = Object.entries(settingsToUpdate)
        .filter(([_, value]) => value !== undefined)
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
      // 各設定を保存
      await Promise.all(
        Object.entries(filteredSettings).map(([key, value]) => saveData(key, value))
      );
      
      // 状態を更新
      setSettings(prev => ({ ...prev, ...filteredSettings, ...(newSettings.apiKey !== undefined ? { apiKey: newSettings.apiKey } : {}) }));
    } catch (err) {
      console.error('設定の更新エラー:', err);
      setError('設定の更新中にエラーが発生しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 履歴を保存する
   * @param {Object} historyItem - 履歴アイテム
   * @returns {Promise<void>}
   */
  const saveHistoryItem = useCallback(async (historyItem) => {
    try {
      // 既存の履歴を取得
      const history = await getData('history') || [];
      
      // 新しい履歴アイテムを追加（先頭に）
      const newHistory = [
        {
          ...historyItem,
          id: `history-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
        ...history
      ];
      
      // 最大履歴数を超えた場合、古いアイテムを削除
      if (newHistory.length > settings.maxHistoryItems) {
        newHistory.splice(settings.maxHistoryItems);
      }
      
      // 更新した履歴を保存
      await saveData('history', newHistory);
    } catch (err) {
      console.error('履歴の保存エラー:', err);
      setError('履歴の保存中にエラーが発生しました');
      throw err;
    }
  }, [settings.maxHistoryItems]);

  /**
   * 履歴を取得する
   * @returns {Promise<Array>} 履歴アイテムの配列
   */
  const getHistory = useCallback(async () => {
    try {
      return await getData('history') || [];
    } catch (err) {
      console.error('履歴の取得エラー:', err);
      setError('履歴の取得中にエラーが発生しました');
      throw err;
    }
  }, []);

  /**
   * 履歴を削除する
   * @param {string} historyId - 削除する履歴のID
   * @returns {Promise<void>}
   */
  const removeHistoryItem = useCallback(async (historyId) => {
    try {
      // 既存の履歴を取得
      const history = await getData('history') || [];
      
      // 指定されたIDの履歴を除外
      const newHistory = history.filter(item => item.id !== historyId);
      
      // 更新した履歴を保存
      await saveData('history', newHistory);
    } catch (err) {
      console.error('履歴の削除エラー:', err);
      setError('履歴の削除中にエラーが発生しました');
      throw err;
    }
  }, []);

  /**
   * すべての履歴を削除する
   * @returns {Promise<void>}
   */
  const clearHistory = useCallback(async () => {
    try {
      await removeData('history');
    } catch (err) {
      console.error('履歴のクリアエラー:', err);
      setError('履歴のクリア中にエラーが発生しました');
      throw err;
    }
  }, []);

  // ストレージからデータを取得
  const getStorageData = useCallback(async () => {
    try {
      const data = await new Promise((resolve) => {
        chrome.storage.sync.get(null, (result) => {
          resolve(result);
        });
      });
      
      // データをステートに設定
      setSettings(data);
      return data;
    } catch (error) {
      console.error('ストレージからの読み込みに失敗しました', error);
      return settings;
    }
  }, [settings]);

  // 初期化時にストレージからデータを読み込む
  useEffect(() => {
    getStorageData();
  }, [getStorageData]);

  // ストレージにデータを保存
  const saveStorageData = useCallback(async (data) => {
    try {
      await new Promise((resolve, reject) => {
        chrome.storage.sync.set(data, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
      
      // データの更新
      await getStorageData();
      return true;
    } catch (error) {
      console.error('ストレージへの保存に失敗しました', error);
      return false;
    }
  }, [getStorageData]);

  // 特定のキーに値を保存
  const setItem = useCallback(async (key, value) => {
    try {
      await new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
      return true;
    } catch (error) {
      console.error(`アイテム ${key} の保存に失敗しました:`, error);
      return false;
    }
  }, []);

  // 特定のキーから値を取得
  const getItem = useCallback(async (key, defaultValue = null) => {
    try {
      const result = await new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key]);
        });
      });
      return result !== undefined ? result : defaultValue;
    } catch (error) {
      console.error(`アイテム ${key} の取得に失敗しました:`, error);
      return defaultValue;
    }
  }, []);

  return {
    // 設定関連
    settings,
    updateApiKey,
    updateTheme,
    updateFontSize,
    updateLanguageMode,
    updateMaxHistoryItems,
    updateAllSettings,
    
    // 履歴関連
    saveHistoryItem,
    getHistory,
    removeHistoryItem,
    clearHistory,
    
    // ストレージ関連
    getStorageData,
    saveStorageData,
    setItem,
    getItem,
    
    // 状態
    loading,
    error,
    clearError: () => setError(null)
  };
};

export default useStorage; 