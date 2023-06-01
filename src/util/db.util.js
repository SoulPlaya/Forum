const config = require('../../config.json').database

const { Client } = require('pg')

const client = new Client({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.databaseName
})

async function initDb() {
    console.log('Connecting to DB...')
    await client.connect()
    await client.query('select 1')
    console.log('Connected to DB')
}

async function query(sql, parameters = []) {
    const result = await client.query(sql, parameters)
    return result.rows
}

module.exports = {
    initDb,
    query,
}