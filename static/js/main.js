/**
 * Websocket message handlers.
 * 
 * Key = message type
 * Value = array of handler callbacks for that type
 * 
 * @type {Map<string, ClientWebsocketCallback[]>}
 */
const wsMsgHandlers = new Map()

/**
 * Adds a new websocket message listener
 * @param {string} messageType The message type to listen for
 * @param {ClientWebsocketCallback} callback The callback to be called when a message of the specified type is received
 */
function addWebsocketListener(messageType, callback) {
    if (wsMsgHandlers.has(messageType)) {
        wsMsgHandlers.get(messageType).push(callback)
    } else {
        wsMsgHandlers.set(messageType, [callback])
    }
}

/**
 * Initializes a connection to the websocket server
 */
function initWs() {
    // Resolve the websocket URL based on our current protocol and host, adding /ws to the end of it
    const wsUrl = `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`

    // Create websocket client and connect
    const ws = new WebSocket(wsUrl)
    
    // Log when we've connected to the server
    ws.addEventListener('open', () => console.log('Connected to websocket server'))

    // Register a handler for when we receive a websocket message
    ws.addEventListener('message', event => {
        // Parse the JSON string into an actual JS object and pull out the type and data from our message
        const { type, data } = JSON.parse(event.data)

        // Check if there are any registered handlers for this message type
        if (wsMsgHandlers.has(type)) {
            // There are some; call all of them with the data we recieved
            for (const callback of wsMsgHandlers.get(type)) {
                callback(data)
            }
        }
    })
}

initWs()
