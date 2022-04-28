const { verifyFields } = require('./utils')

describe('verifyFields', () => {
    const expectedFields = {
        'stringField': 'string',
        'numberField': 'number',
    }

    test('Check valid input', () => {
        const validInput = {
            'stringField': 'foo',
            'numberField': 123
        }
        const res = verifyFields(expectedFields, validInput)
        expect(res).toEqual({
            'valid': true,
            'missing': [],
            'invalid': []
        })
    })

    test('Check invalid input (missing field)', () => {
        const invalidInput = {
            'stringField': 'foo'
        }
        const res = verifyFields(expectedFields, invalidInput)
        expect(res).toEqual({
            'valid': false,
            'missing': ['numberField'],
            'invalid': []
        })
    })

    test('Check invalid input (invalid data type)', () => {
        const invalidInput = {
            'stringField': 'foo',
            'numberField': '123'
        }
        const res = verifyFields(expectedFields, invalidInput)
        expect(res).toEqual({
            'valid': false,
            'missing': [],
            'invalid': ['numberField']
        })
    })

    test('Check invalid input (invalid data type and missing field)', () => {
        const invalidInput = {
            'numberField': '123'
        }
        const res = verifyFields(expectedFields, invalidInput)
        expect(res).toEqual({
            'valid': false,
            'missing': ['stringField'],
            'invalid': ['numberField']
        })
    })
})