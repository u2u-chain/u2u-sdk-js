module.exports = {
    server: {
        hmr: false,
        force: true,
    },
    envDir: "./",
    build: {
        polyfillDynamicImport: false,
    },
    optimizeDeps: {
        entries: [
            "./test/unit/encoding/hex.js",
            "./test/unit/encoding/utf8.js",
            "./test/unit/encoding/der.js",
            "./test/unit/encoding/base64.js",
            "./test/unit/encoding/pkcs.js",
            "./test/unit/Mnemonic.js",
            "./test/unit/key.js",
        ],
    },
    resolve: {
        alias: {
            // redirect src/ to src/browser
            // note that this is NOT needed when consuming this package as the browser field in package.json
            // will take care of this
            "../../../src/primitive/aes.js": "../../../src/primitive/aes.browser.js",
            "../../../src/encoding/base64.js": "../../../src/encoding/base64.browser.js",
            "../../../src/encoding/hex.js": "../../../src/encoding/hex.browser.js",
            "../../../src/primitive/hmac.js": "../../../src/primitive/hmac.browser.js",
            "../../../src/primitive/pbkdf2.js": "../../../src/primitive/pbkdf2.browser.js",
            "../../../src/primitive/sha256.js": "../../../src/primitive/sha256.browser.js",
            "../../../src/encoding/utf8.js": "../../../src/encoding/utf8.browser.js",
            "../../src/primitive/aes.js": "../../src/primitive/aes.browser.js",
            "../../src/encoding/base64.js": "../../src/encoding/base64.browser.js",
            "../../src/encoding/hex.js": "../../src/encoding/hex.browser.js",
            "../../src/primitive/hmac.js": "../../src/primitive/hmac.browser.js",
            "../../src/primitive/pbkdf2.js": "../../src/primitive/pbkdf2.browser.js",
            "../../src/primitive/sha256.js": "../../src/primitive/sha256.browser.js",
            "../../src/encoding/utf8.js": "../../src/encoding/utf8.browser.js",
            "../src/primitive/aes.js": "../src/primitive/aes.browser.js",
            "../src/encoding/base64.js": "../src/encoding/base64.browser.js",
            "../src/encoding/hex.js": "../src/encoding/hex.browser.js",
            "../src/primitive/hmac.js": "../src/primitive/hmac.browser.js",
            "../src/primitive/pbkdf2.js": "../src/primitive/pbkdf2.browser.js",
            "../src/primitive/sha256.js": "../src/primitive/sha256.browser.js",
            "../src/encoding/utf8.js": "../src/encoding/utf8.browser.js",
            "./src/primitive/aes.js": "./src/primitive/aes.browser.js",
            "./src/encoding/base64.js": "./src/encoding/base64.browser.js",
            "./src/encoding/hex.js": "./src/encoding/hex.browser.js",
            "./src/primitive/hmac.js": "./src/primitive/hmac.browser.js",
            "./src/primitive/pbkdf2.js": "./src/primitive/pbkdf2.browser.js",
            "./src/primitive/sha256.js": "./src/primitive/sha256.browser.js",
            "./src/encoding/utf8.js": "./src/encoding/utf8.browser.js",
            "./primitive/aes.js": "./primitive/aes.browser.js",
            "./encoding/base64.js": "./encoding/base64.browser.js",
            "./encoding/hex.js": "./encoding/hex.browser.js",
            "./primitive/hmac.js": "./primitive/hmac.browser.js",
            "./primitive/pbkdf2.js": "./primitive/pbkdf2.browser.js",
            "./primitive/sha256.js": "./primitive/sha256.browser.js",
            "./encoding/utf8.js": "./encoding/utf8.browser.js",
            "../primitive/aes.js": "../primitive/aes.browser.js",
            "../encoding/base64.js": "../encoding/base64.browser.js",
            "../encoding/hex.js": "../encoding/hex.browser.js",
            "../primitive/hmac.js": "../primitive/hmac.browser.js",
            "../primitive/pbkdf2.js": "../primitive/pbkdf2.browser.js",
            "../primitive/sha256.js": "../primitive/sha256.browser.js",
            "../encoding/utf8.js": "../encoding/utf8.browser.js",
            "./aes.js": "./aes.browser.js",
            "./base64.js": "./base64.browser.js",
            "./hex.js": "./hex.browser.js",
            "./hmac.js": "./hmac.browser.js",
            "./pbkdf2.js": "./pbkdf2.browser.js",
            "./sha256.js": "./sha256.browser.js",
            "./utf8.js": "./utf8.browser.js",
        },
    },
};