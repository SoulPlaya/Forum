const http = require('node:http')
const { WebSocketServer, WebSocket } = require('ws')

/**
 * Currently connected clients
 * @type {WebSocket[]}
 */
const clients = []

/**
 * Initializes the websocket service
 * @param {http.Server} httpServer The HTTP to use for websocket
 */
async function init(httpServer) {
    const wss = new WebSocketServer({ noServer: true })

    httpServer.on('upgrade', (request, socket, head) => {
        // Only accept websocket connections on the "/ws" path
        if (request.url !== '/ws') {
            socket.destroy()
            return
        }

        wss.handleUpgrade(request, socket, head, (client) => {
            console.log('Client connected to websocket server')

            // The connection has been accepted; store the client in the clients array
            clients.push(client)

            // Remove the client object from the connected clients array when it disconnects
            client.on('close', () => {
                const clientsLen = clients.length
                for (let i = 0; i < clientsLen; i++) {
                    // We found the client in the array; delete it and break out of the loop
                    if (clients[i] === client) {
                        clients.splice(i, 1)
                        break
                    }
                }
            })
        })
    })
}

/**
 * Broadcasts a message to all connected websocket clients
 * @param {string} messageType The type of message to be sent to all users connected
 * @param {any} data The data sent with the message
 */
async function broadcast(messageType, data) {
    for (const client of clients) {
        client.send(JSON.stringify({ type: messageType, data }))
    }
}

module.exports = {
    init,
    broadcast,
}
