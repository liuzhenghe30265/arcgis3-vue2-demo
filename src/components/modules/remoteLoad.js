export default function remoteLoad(url, hasCallback) {
    return createScript(url)
    /**
     * 创建 script
     * @param url
     * @returns {Promise}
     */
    function createScript(url) {
        var scriptElement = document.createElement('script')
        document.body.appendChild(scriptElement)
        var promise = new Promise((resolve, reject) => {
            scriptElement.addEventListener('load', e => {
                removeScript(scriptElement)
                if (!hasCallback) {
                    resolve(e)
                }
            }, false)

            scriptElement.addEventListener('error', e => {
                removeScript(scriptElement)
                reject(e)
            }, false)

            if (hasCallback) {
                window.____callback____ = function () {
                    resolve()
                    window.____callback____ = null
                }
            }
        })

        if (hasCallback) {
            url += '&callback=____callback____'
        }

        scriptElement.src = url

        return promise
    }

    /**
     * 移除 script 标签
     * @param scriptElement script dom
     */
    function removeScript(scriptElement) {
        document.body.removeChild(scriptElement)
    }
}