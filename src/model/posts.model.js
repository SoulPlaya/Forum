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
 * A forum thread
 */
class ThreadInfo {
    /**
     * The thread's post ID
     * @type {number}
     */
    id

    /**
     * The thread's content
     * @type {string}
     */
    content

    /**
     * Thread's title
     * @type {string}
     */
    title

    /**
     * ID of the creator of the thread
     * @type {number}
     */
    creatorId

    /**
     * The thread creator's username
     * @type {string}
     */
    creatorUsername

    /**
     * The thread creator's display name
     * @type {string}
     */
    creatorDisplayName

    /**
     * The thread's creation timestamp
     * @type {Date}
     */
    createdTs

    /**
     * The thread's last update timestamp
     * @type {Date}
     */
    updatedTs

    /**
     * Returns the creator's name, either the creator's display name, or username if no display name is set
     * @type {string}
     */
    get creatorName() {
        return this.creatorDisplayName || this.creatorUsername
    }
}

/**
 * A reply to a forum thread
 */
class ReplyInfo {
    /**
     * The reply's post ID (not thread ID)
     * @type {number}
     */
    id

    /**
     * The reply's content
     * @type {string}
     */
    content

    /**
     * ID of the creator of the reply
     * @type {number}
     */
    creatorId

    /**
     * The reply creator's username
     * @type {string}
     */
    creatorUsername

    /**
     * The reply creator's display name
     * @type {string}
     */
    creatorDisplayName

    /**
     * The reply's creation timestamp
     * @type {Date}
     */
    createdTs

    /**
     * The reply's last update timestamp
     * @type {Date}
     */
    updatedTs

    /**
     * Returns the creator's name, either the creator's display name, or username if no display name is set
     * @type {string}
     */
    get creatorName() {
        return this.creatorDisplayName || this.creatorUsername
    }
}

/**
 * Converts a raw row from the `posts` table into a {@link Post} object
 * @param {any} row The row to convert
 * @returns {Post} The resulting {@link Post} object
 */
function rowToPost(row) {
    const res = new Post()
    res.id = row.id
    res.content = row.content
    res.creatorId = row.creator_id
    res.threadId = row.thread_id
    res.threadTitle = row.thread_title

    res.createdTs = new Date(row.created_ts)
    res.updatedTs = new Date(row.updated_ts)

    return res
}

/**
 * Converts a thread info row into a {@link ThreadInfo} object
 * @param {any} row The row to convert
 * @returns {ThreadInfo} The resulting {@link ThreadInfo} object
 */
function rowToThreadInfo(row) {
    const res = new ThreadInfo()
    res.id = row.id
    res.content = row.content
    res.title = row.title
    res.creatorId = row.creator_id
    res.creatorUsername = row.creator_username
    res.creatorDisplayName = row.creator_display_name

    res.createdTs = new Date(row.created_ts)
    res.updatedTs = new Date(row.updated_ts)

    return res
}

/**
 * Converts a reply info row into a {@link ReplyInfo} object
 * @param {any} row The row to convert
 * @returns {ReplyInfo} The resulting {@link ReplyInfo} object
 */
function rowToReplyInfo(row) {
    const res = new ReplyInfo()
    res.id = row.id
    res.content = row.content
    res.creatorId = row.creator_id
    res.creatorUsername = row.creator_username
    res.creatorDisplayName = row.creator_display_name

    res.createdTs = new Date(row.created_ts)
    res.updatedTs = new Date(row.updated_ts)

    return res
}

/**
 * Converts the first row in an array of raw rows to a {@link Post} object, or returns null if the array is empty
 * @param {any[]} rows The rows
 * @returns {Post | null} The resulting {@link Post} object, or null if empty
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
 * Converts the first row in an array of thread info rows to a {@link ThreadInfo} object, or returns null if the array is empty
 * @param {any[]} rows The rows
 * @returns {ThreadInfo | null} The resulting {@link ThreadInfo} object, or null if empty
 */
function firstRowToThreadInfoOrNull(rows) {
    const row = firstOrNull(rows)

    if (row === null) {
        return null
    } else {
        return rowToThreadInfo(row)
    }
}

/**
 * Converts the first row in an array of reply info rows to a {@link ReplyInfo} object, or returns null if the array is empty
 * @param {any[]} rows The rows
 * @returns {ReplyInfo | null} The resulting {@link ReplyInfo} object, or null if empty
 */
function firstRowToReplyInfoOrNull(rows) {
    const row = firstOrNull(rows)

    if (row === null) {
        return null
    } else {
        return rowToReplyInfo(row)
    }
}

/**
 * Converts an array of raw rows from the `posts` table into {@link Post} objects
 * @param {any[]} rows The rows to convert
 * @returns {Post[]} The resulting {@link Post} objects
 */
function rowArrayToPosts(rows) {
    const res = new Array(rows.length)

    for (let i = 0; i < rows.length; i++) {
        res[i] = rowToPost(rows[i])
    }

    return res
}

/**
 * Converts an array of thread info rows into {@link ThreadInfo} objects
 * @param {any[]} rows The rows to convert
 * @returns {ThreadInfo[]} The resulting {@link ThreadInfo} objects
 */
function rowArrayToThreadInfos(rows) {
    const res = new Array(rows.length)

    for (let i = 0; i < rows.length; i++) {
        res[i] = rowToThreadInfo(rows[i])
    }

    return res
}

/**
 * Converts an array of reply info rows into {@link ReplyInfo} objects
 * @param {any[]} rows The rows to convert
 * @returns {ReplyInfo[]} The resulting {@link ReplyInfo} objects
 */
function rowArrayToReplyInfos(rows) {
    const res = new Array(rows.length)

    for (let i = 0; i < rows.length; i++) {
        res[i] = rowToReplyInfo(rows[i])
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
 * @returns {Promise<ThreadInfo[]>} The threads
 */
async function getThreads(offset, limit) {
    const rows = await query(`
    select
        posts.id,
        posts.content,
        posts.thread_title as title,
        posts.creator_id,
        users.username as creator_username,
        users.display_name as creator_display_name,
        posts.created_ts,
        posts.updated_ts
    from posts
    join users on users.id = posts.creator_id
    where posts.thread_id is null
    order by posts.created_ts desc
    offset ($1) limit ($2)
    `, [offset, limit])
    return rowArrayToThreadInfos(rows)
}

/**
 * Fetches replies to a thread with the specified ID
 * @param {number} threadId
 * @param {number} offset
 * @param {number} limit
 * @returns {Promise<ReplyInfo[]>}
 */
async function getReplies(threadId, offset, limit) {
    const rows = await query(`
    select
        posts.id,
        posts.content,
        posts.creator_id,
        users.username as creator_username,
        users.display_name as creator_display_name,
        posts.created_ts,
        posts.updated_ts
    from posts
    join users on users.id = posts.creator_id
    where posts.thread_id = $1
    order by posts.created_ts 
    offset ($2) limit ($3)
    `, [threadId, offset, limit])
    return rowArrayToReplyInfos(rows)
}

/**
 * @param {number} id
 * @returns {Promise<ThreadInfo | null>}
 */
async function getThreadById(id) {
    const rows = await query(`
    select
        posts.id,
        posts.content,
        posts.thread_title as title,
        posts.creator_id,
        users.username as creator_username,
        users.display_name as creator_display_name,
        posts.created_ts,
        posts.updated_ts
    from posts
    join users on users.id = posts.creator_id
    where posts.id = $1 and posts.thread_id is null`, [id])
    return firstRowToThreadInfoOrNull(rows)
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
    ThreadInfo,
    ReplyInfo,
}
