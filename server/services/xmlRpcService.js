const xmlrpc = require('xmlrpc');

/**
 * XML-RPC servisine ping gönderir
 * @param {string} endpoint - XML-RPC endpoint URL'si
 * @param {string} method - Çağrılacak XML-RPC metodu
 * @param {Array} params - Metod parametreleri
 * @returns {Promise<Object>} - Servis cevabı
 */
const sendXmlRpcPing = async (endpoint, method, params) => {
    return new Promise((resolve, reject) => {
        // HTTP veya HTTPS seçimi
        const isHttps = endpoint.startsWith('https');
        
        const client = isHttps
            ? xmlrpc.createSecureClient(endpoint)
            : xmlrpc.createClient(endpoint);
        
        client.methodCall(method, params, (error, value) => {
            if (error) {
                reject(error);
            } else {
                resolve(value);
            }
        });
    });
};

/**
 * Pingomatic servisine ping gönderir
 * @param {string} title - Site başlığı
 * @param {string} url - Ping gönderilecek URL
 * @param {string} rssUrl - RSS feed URL'si (varsa)
 * @returns {Promise<Object>} - Pingomatic cevabı
 */
const pingViaPingomatic = async (title, url, rssUrl = '') => {
    const endpoint = 'http://rpc.pingomatic.com/';
    const method = 'weblogUpdates.extendedPing';
    
    // Tüm servislere ping gönderme ayarı
    const params = [
        title, url, rssUrl,
        1, // Tüm servislere ping gönder
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1 // Tüm servis bayrakları
    ];
    
    return sendXmlRpcPing(endpoint, method, params);
};

/**
 * Twingly servisine ping gönderir
 * @param {string} title - Site başlığı
 * @param {string} url - Ping gönderilecek URL
 * @returns {Promise<Object>} - Twingly cevabı
 */
const pingViaTwingly = async (title, url) => {
    const endpoint = 'http://rpc.twingly.com/';
    const method = 'weblogUpdates.ping';
    const params = [title, url];
    
    return sendXmlRpcPing(endpoint, method, params);
};

/**
 * WeblogUpdates servisine ping gönderir
 * @param {string} title - Site başlığı
 * @param {string} url - Ping gönderilecek URL
 * @returns {Promise<Object>} - WeblogUpdates cevabı
 */
const pingViaWeblogUpdates = async (title, url) => {
    const endpoint = 'http://rpc.weblogs.com/RPC2';
    const method = 'weblogUpdates.ping';
    const params = [title, url];
    
    return sendXmlRpcPing(endpoint, method, params);
};

module.exports = {
    sendXmlRpcPing,
    pingViaPingomatic,
    pingViaTwingly,
    pingViaWeblogUpdates
};