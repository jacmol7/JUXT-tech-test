/**
 * Validates if an object contains some expected keys with the correct data type
 * @param {object} expectedFields Keys should be the ones expected in the input and their value should be the expected data type
 * @param {object} input The object to verify
 * @returns {{valid: boolean, missing: Array.<string>, invalid: Array.<string>}} If the input is valid and any fields which are missing or contain the wrong data type
 */
function verifyFields(expectedFields, input) {
    let keys = Object.keys(input)
    let missingFields = []
    let invalidFields = []

    Object.keys(expectedFields).forEach(expectedFieldName => {
        const index = keys.indexOf(expectedFieldName)
        if (index == -1) {
            missingFields.push(expectedFieldName)
        } else if (typeof input[expectedFieldName] != expectedFields[expectedFieldName]) {
            invalidFields.push(expectedFieldName)
        } else {
            keys.splice(index, 1)
        }
    })

    return {
        'valid': !(missingFields.length > 0 || invalidFields.length > 0),
        'missing': missingFields,
        'invalid': invalidFields
    }
}

module.exports.verifyFields = verifyFields