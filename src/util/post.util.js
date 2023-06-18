const { Post, createPostRow } = require("../model/posts.model")

/**
 * Creates a new thread and returns it
 * @param {string} title The thread title
 * @param {string} content The thread's text content
 * @param {number} creatorId The ID of the user that created the thread
 * @returns {Promise<Post>} The newly created thread
 */
async function createThread(title, content, creatorId) {
    return await createPostRow(content, title, null, creatorId)
}

module.exports = {
    createThread,
}
