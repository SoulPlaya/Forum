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

/**
 * Creates a reply and returns it
 * @param {number} threadId ID of thread being replied to
 * @param {string} content Content of reply
 * @param {number} creatorId ID of person who creates reply
 * @returns {Promise<Post>} The newly created thread
 */
async function createReply(threadId, content, creatorId) {
    return await createPostRow(content, null, threadId, creatorId)
}

module.exports = {
    createThread,
    createReply,
}
