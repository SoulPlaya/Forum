const { query } = require('../util/db.util')
const { firstOrNull } = require('../util/misc.util')

/**
 * A forum post, either a thread or a reply
 */
class Post {
    /**
     * The post's internal sequential ID
     * @type {number}
     */
    id

    /**
     * The post's creation timestamp
     * @type {Date}
     */
    createdTs

    /**
     * The post's last update timestamp
     * @type {Date}
     */
    updatedTs

    /**
     * The post's text or information
     * @type {string}
     */
    content

    /**
     * The id of post creator 
     * @type {number}
     */
    creatorId

    /**
     * The thread this post belongs to if it's a reply, otherwise `null` if it's a thread
     * @type {string | null}
     */
    threadId
    
    /**
     * Title of thread if it's a new thread not a reply
     * @type {string | null}
     */
    threadTitle

    /**
     * Whether the post is a thread
     * @type {boolean}
     */
    get isThread() {
        return this.threadId === null
    }
}

/**
 * Converts a raw row from the `posts` table into a Post object
 * @param {any} row The row to convert
 * @returns {Post} The resulting Post object
 */
function rowToPost(row) {
    const res = new Post()
    res.id = row.id
    res.creatorId = row.creatorId
    res.threadId = row.threadId
    res.threadTitle = row.threadId
    
    // We use the new Date(...) constructor to convert the string
    // representation of the timestamp (e.g. "2023-06-03T18:21:51.855Z")
    // to a JavaScript Date object.
    res.createdTs = new Date(row.created_ts)
    res.updatedTs = new Date(row.updated_ts)

    return res
}

/**
 * Converts the first row in an array of raw rows to a Post object, or returns null if the array is empty
 * @param {any[]} rows The rows
 * @returns {Post | null} The resulting Post object, or null if empty
 */
function firstRowToPostOrNull(rows) {
    const row = firstOrNull(rows)

    if (row === null) {
        return null
    } else {
        return rowToPost(row)
    }
}

/**
 * Converts an array of raw rows from the `posts` table into Post objects
 * @param {any[]} rows The rows to convert
 * @returns {Post[]} The resulting Post objects
 */
function rowArrayToPosts(rows) {
    const res = new Array(rows.length)

    for (let i = 0; i < rows.length; i++) {
        res[i] = rowToPost(rows[i])
    }

    return res
}

/**
 * Creates a new post row and returns it
 * @param {string} content The posts content
 * @param {string | null} threadTitle The thread's title
 * @param {number | null} threadId The thread's ID
 * @param {number} creatorId The creator's ID 
 * @returns {Promise<Post>} The newly created post
 */
async function createPostRow(content, threadTitle, threadId, creatorId) {
    const res = await query(
        `
        insert into posts (content, thread_title, thread_id, creator_id)
        values ($1, $2, $3, $4)
        returning *
        `,
        [content, threadTitle, threadId, creatorId]
    )

    return rowToPost(res[0])
}

/**
 * Gets all users (applying the specified offset and limit).
 * @param {number} offset The offset of users to return
 * @param {number} limit The maximum number of users to return
 * @returns {Promise<Post[]>} The threads
 */
async function getThreads(offset, limit) {
    const rows = await query(`
    select * from posts
    where thread_id is not null
    offset ($1) limit ($2)
    `, [offset, limit])
    return rowArrayToPosts(rows)
}

/**
 * @param {number} threadId
 * @param {number} offset
 * @param {number} limit
 * @returns {Promise<Post[]>}
 */
async function getReplies(threadId, offset, limit) {
    const rows = await query(`
    select * from posts
    where thread_id = $1
    offset ($2) limit ($3)
    `, [threadId, offset, limit])
    return rowArrayToPosts(rows)
}

/**
 * @param {number} id
 * @returns {Promise<Post | null>}
 */

async function getThreadById(id) {
    const rows = await query(`
    select * from posts
    where id = $1`, [id])
    return firstRowToPostOrNull(rows)
}

/**
 * Deletes the user with the specified ID
 * @param {number} id The user's ID
 */
async function deletePostsById(id) {
    await query('delete from posts where id = $1 or thread_id = $1', [id])
}

module.exports = {
    Post,
    createPostRow,
    getThreads,
    getReplies,
    getThreadById,
    deletePostsById,
}
