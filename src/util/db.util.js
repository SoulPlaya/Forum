const config = require('../../config.json').database

const { Client } = require('pg')

const client = new Client({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.databaseName
})

/**
 * Initializes the application's database connection
 */
async function initDb() {
    console.log('Connecting to DB...')
    await client.connect()
    await client.query('select 1')
    console.log('Connected to DB')
}

/**
 * Performs a database query and returns any resulting rows
 * @param {string} sql The SQL to execute
 * @param {any[]} [parameters=[]] Any bind parameter values to provide for the query
 * @returns {Promise<any[]>} The query result rows
 */
async function query(sql, parameters = []) {
    const result = await client.query(sql, parameters)
    return result.rows
}

module.exports = {
    initDb,
    query,
}
