/**
 * Chrome Storage Utility
 * セキュアなデータ保存のためのユーティリティ関数
 */

/**
 * データを保存する
 * @param {string} key - 保存するデータのキー
 * @param {any} value - 保存する値（オブジェクト、配列、プリミティブ値など）
 * @returns {Promise<void>} - 保存完了時に解決するPromise
 */
export const saveData = async (key, value) => {
  try {
    // Chromeの拡張機能APIが利用可能か確認
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      console.error('Chrome storage API not available');
      throw new Error('この機能はChrome拡張機能として実行する必要があります');
    }
    
    // オブジェクトとしてデータを保存
    await chrome.storage.local.set({ [key]: value });
    console.log(`Data saved successfully for key: ${key}`);
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
    throw error;
  }
};

/**
 * データを取得する
 * @param {string} key - 取得するデータのキー
 * @returns {Promise<any>} - 取得したデータを含むPromise
 */
export const getData = async (key) => {
  try {
    // Chromeの拡張機能APIが利用可能か確認
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      console.error('Chrome storage API not available');
      return null;
    }
    
    const result = await chrome.storage.local.get(key);
    return result[key];
  } catch (error) {
    console.error(`Error retrieving data for key "${key}":`, error);
    throw error;
  }
};

/**
 * 複数のデータをまとめて取得する
 * @param {string[]} keys - 取得するデータのキーの配列
 * @returns {Promise<object>} - キーと値のペアを含むオブジェクト
 */
export const getMultipleData = async (keys) => {
  try {
    if (!chrome.storage) {
      console.error('Chrome storage API not available');
      return {};
    }
    
    return await chrome.storage.local.get(keys);
  } catch (error) {
    console.error('Error retrieving multiple data keys:', error);
    throw error;
  }
};

/**
 * データを削除する
 * @param {string} key - 削除するデータのキー
 * @returns {Promise<void>} - 削除完了時に解決するPromise
 */
export const removeData = async (key) => {
  try {
    if (!chrome.storage) {
      console.error('Chrome storage API not available');
      return;
    }
    
    await chrome.storage.local.remove(key);
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
    throw error;
  }
};

/**
 * すべてのデータをクリアする
 * @returns {Promise<void>} - クリア完了時に解決するPromise
 */
export const clearAllData = async () => {
  try {
    if (!chrome.storage) {
      console.error('Chrome storage API not available');
      return;
    }
    
    await chrome.storage.local.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};

/**
 * APIキーを保存する
 * APIキーなどの重要データを特別に扱う
 * @param {string} apiKey - 保存するAPIキー
 * @returns {Promise<void>} - 保存完了時に解決するPromise
 */
export const saveApiKey = async (apiKey) => {
  return saveData('apiKey', apiKey);
};

/**
 * APIキーを取得する
 * @returns {Promise<string|null>} - 保存されたAPIキーまたはnull
 */
export const getApiKey = async () => {
  return getData('apiKey');
}; 