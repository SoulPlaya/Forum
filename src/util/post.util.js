const { Post, createPostRow } = require("../model/posts.model")

/**
 * Creates a new thread and returns it
 * @param {string} title The thread title
 * @param {string} content The thread's text content
 * @param {number} creatorId The ID of the user that created the thread
 * @param {string} threadImg the Image the post creator adds
 * @returns {Promise<Post>} The newly created thread
 */
async function createThread(title, content, creatorId, threadImg) {
    return await createPostRow(content, title, null, creatorId, threadImg)
}

/**
 * Creates a reply and returns it
 * @param {number} threadId ID of thread being replied to
 * @param {string} content Content of reply
 * @param {number} creatorId ID of person who creates reply
 * @returns {Promise<Post>} The newly created thread
 */
async function createReply(threadId, content, creatorId, threadImg) {
    return await createPostRow(content, null, threadId, creatorId, null)
}

module.exports = {
    createThread,
    createReply,
}
