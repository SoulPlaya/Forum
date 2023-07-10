const { query } = require('../util/db.util')
const { firstOrNull } = require('../util/misc.util')

class Concentrate {
    /**
     * Amount of times button was hit
     * @type {number}
     */
    timesPressed
}

/**
 * Converts a raw row from the `concentrate` table into a {@link Concentrate} object
 * @param {any} row The row to convert
 * @returns {Concentrate} The resulting {@link Concentrate} object
 */
function rowToConcentrate(row) {
    const res = new Concentrate()
    res.timesPressed = row.concentration_counter

    return res
}

/**
 * Creates the initial concentrate row, or does nothing if it already exists
 * @returns {Promise<void>}
 */
async function createConcentrateRowOrIgnore() {
    await query(`
        insert into concentrate (id, concentration_counter)
        values (1, 0)
        on conflict do nothing
    `)
}

/**
 * Gets the total concentration count
 * @returns {Promise<number>} The concentration count
 */
async function getConcentrateCount() {
    const res = await query('select * from concentrate')
    
    return res[0].concentration_counter
}

/**
 * Increments the concentration count by 1 and then returns the new count
 * @returns {Promise<number>} The new concentration count
 */
async function incrementConcentrateCount() {
    const res = await query(`
        update concentrate
        set concentration_counter = concentration_counter + 1
        returning concentration_counter
    `)

    return res[0].concentration_counter
}

module.exports = {
    createConcentrateRowOrIgnore,
    getConcentrateCount,
    incrementConcentrateCount,
}
