/**
 * This is a model file.
 * Models expose data from a database via functions.
 * In a well-structured MVC (Model View Controller) application, you shouldn't write raw SQL inside your controllers.
 * Instead, all your queries should be done inside models, and then your logic (controllers) should call those model functions.
 * 
 * In this model, we expose functions for creating, deleting, and updating users.
 * We also provide a User class that contains user info.
 * This is better than returning the raw rows from the database, because the class can use camelCase and have methods attached
 * to it.
 * 
 * Keep in mind that models are only supposed to do database querying and returning work, not anything else like hashing passwords.
 * If you want to make a utility, for say, creating a user with a username and password (which would require hashing),
 * create a function in here for creating the raw user row with a username and password hash, and then make a util function in one
 * of the util files that hashes the password and then calls the raw insert row function from this model.
 */

const { query } = require('../util/db.util')
const { firstOrNull } = require('../util/misc.util')

/**
 * Class representing a user's data.
 * 
 * This class should only hold data and some basic methods that don't have any side effects.
 * A function/method having side effects means that it can modify outside data.
 * A so-called "pure function" is a function which cannot modify outside data, and instead
 * only takes input and produces output. Since it doesn't have access to outside data, a
 * call to the function with the same input will always return the same output.
 * 
 * The concept of a pure function comes from mathematics, where a function takes in some
 * numbers and outputs some numbers without any chance of modifying the world outside of it.
 */
class User {
    /**
     * The user's internal sequential ID
     * @type {number}
     */
    id

    /**
     * The user's username
     * @type {string}
     */
    username

    /**
     * The user's password hash
     * @type {string}
     */
    passwordHash

    /**
     * The user's creation timestamp
     * @type {Date}
     */
    createdTs

    /**
     * The user's last update timestamp
     * @type {Date}
     */
    updatedTs

    /**
     * 
     * @type {string}
     */
    aboutMe

    /**
     * 
     * @type {string}
     */
    skillset 

    /**
     * 
     * @type {string}
     */
    displayName
}

/**
 * Converts a raw row from the `users` table into a User object
 * @param {any} row The row to convert
 * @returns {User} The resulting User object
 */
function rowToUser(row) {
    const res = new User()
    res.id = row.id
    res.username = row.username
    res.passwordHash = row.password_hash
    res.aboutMe = row.about_me
    res.skillset = row.skillset
    res.displayName = row.display_name

    // We use the new Date(...) constructor to convert the string
    // representation of the timestamp (e.g. "2023-06-03T18:21:51.855Z")
    // to a JavaScript Date object.
    res.createdTs = new Date(row.created_ts)
    res.updatedTs = new Date(row.updated_ts)

    return res
}

/**
 * Converts the first row in an array of raw rows to a User object, or returns null if the array is empty
 * @param {any[]} rows The rows
 * @returns {User | null} The resulting User object, or null if empty
 */
function firstRowToUserOrNull(rows) {
    const row = firstOrNull(rows)

    if (row === null) {
        return null
    } else {
        return rowToUser(row)
    }
}

/**
 * Converts an array of raw rows from the `users` table into User objects
 * @param {any[]} rows The rows to convert
 * @returns {User[]} The resulting User objects
 */
function rowArrayToUsers(rows) {
    // We create an array to store the User objects we've created
    const res = new Array(rows.length)

    // For each row, convert it to a User object and put it in the result array
    for (let i = 0; i < rows.length; i++) {
        res[i] = rowToUser(rows[i])
    }

    return res
}

/**
 * Creates a new user row and returns it
 * @param {string} username The new user's username
 * @param {string} passwordHash The new user's password hash
 * @returns {Promise<User>} The newly created user
 */
async function createUserRow(username, passwordHash) {
    const res = await query(
        `
        insert into users (username, password_hash)
        values ($1, $2)
        returning *
        `,
        [username, passwordHash]
    )

    // Since we added "returning *" on the end of the query,
    // it'll return the newly inserted row.
    // We can convert the row to a User object here without
    // making an extra call to get it.
    // We also know for certain that it'll return a single
    // row, so we don't need to check if the array is empty.

    return rowToUser(res[0])
}

/**
 * Gets all users (applying the specified offset and limit).
 * 
 * The offset allows you to do simple pagination by moving a metaphorical cursor across the table,
 * and limit is simply the maximum number of rows to return.
 * 
 * Example:
 * Let there be 5 rows: A, B, C, D, E
 * Select with an offset of 1 and a limit of 3.
 * You will get: B, C, D.
 * 
 * @param {number} offset The offset of users to return
 * @param {number} limit The maximum number of users to return
 * @returns {Promise<User[]>} The users
 */
async function getUsers(offset, limit) {
    const rows = await query('select * from users offset ($1) limit ($2)', [offset, limit])
    return rowArrayToUsers(rows)
}

/**
 * Gets the total number of users in the database
 * @returns {Promise<number>} The total number of users
 */
async function getUserCount() {
    // We use the SQL "as" keyword to give a name to the result of "count(*)".
    // In this case, we're naming it "total".
    const res = await query('select count(*) as total from users')
    return res[0].total
}

/**
 * Gets the user with the specified ID, or null if none was found
 * @param {number} id  The ID
 * @returns {Promise<User | null>} The user, or null if none was found
 */
async function getUserById(id) {
    const rows = await query('select * from users where id = $1', [id])
    return firstRowToUserOrNull(rows)
}

/**
 * Gets the user with the specified username, or null if none was found
 * @param {string} username The username
 * @returns {Promise<User | null>} The user, or null if none was found
 */
async function getUserByUsername(username) {
    const rows = await query('select * from users where username = $1', [username])
    return firstRowToUserOrNull(rows)
}

/**
 * Updates a user's password hash
 * @param {number} id The user's ID
 * @param {string} newHash The new password hash
 */
async function updateUserPasswordHash(id, newHash) {
    await query('update users set password_hash = $1 where id = $2', [newHash, id])
}

/**
 * updates profile of user
 * @param {number} id the user's ID
 * @param {string} aboutMe the users about me
 * @param {string} skillset the users skillset
 * @param {string} displayName users displayname
 */
async function updateUserProfile(id, aboutMe, skillset, displayName) {
    await query('update users set about_me = $1, skillset = $2, display_name = $3 where id = $4', [aboutMe, skillset, displayName, id])
}

/**
 * Deletes the user with the specified ID
 * @param {number} id The user's ID
 */
async function deleteUserById(id) {
    await query('delete from users where id = $1', [id])
}

module.exports = {
    User,
    createUserRow,
    getUsers,
    getUserById,
    getUserByUsername,
    updateUserPasswordHash,
    deleteUserById,
    updateUserProfile,
}
