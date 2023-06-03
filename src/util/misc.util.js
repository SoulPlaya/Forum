/**
 * This util module contains utils that don't fit into other specific categories.
 * Common generic utilities can be put here.
 */

/**
 * Returns the first element of the provided array, or null if the array is empty
 * @template T
 * @param {T[]} array The array
 * @returns {T | null} The first element of the array, or null if empty
 */
function firstOrNull(array) {
    if (array.length > 0) {
        // The array is not empty; return the first item
        return array[0]
    } else {
        // The array is empty; return null
        return null
    }
}

module.exports = {
    firstOrNull,
}
