const newReplies = /** @type {HTMLDialogElement} */ (document.getElementById("newReplies"))
const refreshButton = (document.getElementById("refreshButton"))
const threadInfoElem = document.getElementById('thread-info')

// Pull the page thread ID out of the data-thread-id property on #thread-info
// We use parseInt because all properties of dataset are strings
const pageThreadId = parseInt(threadInfoElem.dataset.threadId)

// Weird way of importing things for TypeScript's checker in normal JS code
/** @typedef {import('../../src/model/posts.model').Post} Post */

/**
 * @param {Post} post
 */
function newReplyCallback(post) {
    if (pageThreadId === post.threadId) {
        newReplies.showModal()
    }
}

addWebsocketListener('reply', newReplyCallback)

refreshButton.addEventListener('click', () => window.location.reload())