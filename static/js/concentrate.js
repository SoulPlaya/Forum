

const meditate = /** @type {HTMLButtonElement} */ (document.getElementById('meditate'))
const countElem = document.getElementById('count')

addWebsocketListener('concentrate', (newCount) => {
    countElem.innerText = newCount.toString()
})

const haveConcentrated = /** @type {HTMLDialogElement} */ (document.getElementById("haveConcentrated"))

meditate.addEventListener('click', async (event) => {
    // Disable button and show in-progress text while the request is happening
    meditate.disabled = true
    meditate.innerText = 'Concentrating...'

    const newCount = await incrementCount()

    // We have the new count, so update it on the screen
    countElem.innerText = newCount.toString()

    // Once the request is done, reset it
    meditate.disabled = false
    meditate.innerText = 'Concentrate'

    haveConcentrated.showModal()
})

/**
 * @returns {Promise<number>}
 */
async function incrementCount() {
    // Make request
    const response = await fetch('/api/concentrate', { method: 'POST' })

    // Fetch its body
    const body = await response.json()
    
    // Check if it wasn't successful (200 is success)
    if (response.status !== 200) {
        throw new Error(`Server returned status ${response.status} with body: ${JSON.stringify(body)}`)
    }

    // Since no error was thrown by this point, we return the count that the API sent us
    return body.count
}
