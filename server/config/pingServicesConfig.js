// Ping servis sağlayıcıları yapılandırması

module.exports = {
    // Arama motorları servisleri
    SEARCH_ENGINES: {
        google: {
            name: 'Google',
            endpoint: 'https://www.google.com/ping',
            method: 'GET',
            params: { url: '' },
            requirePro: false
        },
        bing: {
            name: 'Bing',
            endpoint: 'https://www.bing.com/ping',
            method: 'GET',
            params: { url: '' },
            requirePro: false
        },
        yandex: {
            name: 'Yandex',
            endpoint: 'https://webmaster.yandex.com/ping',
            method: 'GET',
            params: { url: '' },
            requirePro: false
        },
        indexnow: {
            name: 'IndexNow',
            endpoint: 'https://api.indexnow.org/indexnow',
            method: 'POST',
            body: { url: '', key: process.env.INDEXNOW_KEY || 'your-key' },
            requirePro: false
        }
    },

    // İçerik keşif servisleri
    CONTENT_DISCOVERY: {
        feedly: {
            name: 'Feedly',
            endpoint: 'https://cloud.feedly.com/v3/notifications',
            method: 'POST',
            body: { feedId: '' },
            requirePro: true
        },
        superfeedr: {
            name: 'Superfeedr',
            endpoint: 'https://push.superfeedr.com/',
            method: 'POST',
            body: { hub: { topic: '' } },
            requirePro: true
        },
        blogarama: {
            name: 'Blogarama',
            endpoint: 'https://www.blogarama.com/ping-blogarama/',
            method: 'GET',
            params: { blog_url: '' },
            requirePro: true
        },
        feedburner: {
            name: 'FeedBurner',
            endpoint: 'https://feedburner.google.com/fb/a/ping',
            method: 'GET',
            params: { url: '' },
            requirePro: true
        }
    },

    // XML-RPC Agregasyon servisleri
    AGGREGATION_SERVICES: {
        pingomatic: {
            name: 'Pingomatic',
            endpoint: 'http://rpc.pingomatic.com/',
            method: 'XML-RPC',
            xmlrpcMethod: 'weblogUpdates.extendedPing',
            requirePro: true
        },
        twingly: {
            name: 'Twingly',
            endpoint: 'http://rpc.twingly.com/',
            method: 'XML-RPC',
            xmlrpcMethod: 'weblogUpdates.ping',
            requirePro: true
        },
        weblogupdates: {
            name: 'WeblogUpdates',
            endpoint: 'http://rpc.weblogs.com/RPC2',
            method: 'XML-RPC',
            xmlrpcMethod: 'weblogUpdates.ping',
            requirePro: true
        }
    },

    // Bölgesel arama motorları
    REGIONAL_ENGINES: {
        baidu: {
            name: 'Baidu (China)',
            endpoint: 'https://zhanzhang.baidu.com/linksubmit/url',
            method: 'POST',
            body: { url: '' },
            requirePro: true,
            requireEnterprise: true
        },
        naver: {
            name: 'Naver (Korea)',
            endpoint: 'https://searchadvisor.naver.com/indexnow',
            method: 'POST',
            body: { url: '', key: process.env.NAVER_KEY || 'your-key' },
            requirePro: true,
            requireEnterprise: true
        },
        seznam: {
            name: 'Seznam (Czech Republic)',
            endpoint: 'https://search.seznam.cz/ping',
            method: 'GET',
            params: { url: '' },
            requirePro: true,
            requireEnterprise: true
        }
    },

    // WebSub servisleri
    WEBSUB_SERVICES: {
        googlePubSubHub: {
            name: 'Google PubSubHubbub',
            endpoint: 'https://pubsubhubbub.appspot.com/',
            method: 'POST',
            formData: { 'hub.mode': 'publish', 'hub.url': '' },
            requirePro: true,
            requireEnterprise: true
        },
        websubRocks: {
            name: 'WebSub.rocks',
            endpoint: 'https://websub.rocks/hub',
            method: 'POST',
            formData: { 'hub.mode': 'publish', 'hub.url': '' },
            requirePro: true,
            requireEnterprise: true
        }
    }
};