const request = require('supertest')
const { app, setStorageInterface } = require('./app')
var mockStorage

beforeAll(() => {
    mockStorage = {
        'place': jest.fn(() => { return 'newOrderId' }),
        'cancel': jest.fn(() => { return true }),
        'summary': jest.fn(() => { return { 'buy': [], 'sell': [] } })
    }
    setStorageInterface(mockStorage)
})

beforeEach(() => {
    jest.clearAllMocks()
})

describe('Placing orders', () => {
    test('Place an order', () => {
        const testOrder = {
            'userId': 1,
            'type': 'Bitcoin',
            'quantity': 10,
            'price': 5,
            'action': 'buy'
        }
        return request(app)
            .post('/order/place')
            .send(testOrder)
            .then(res => {
                expect(mockStorage.place).toHaveBeenLastCalledWith(
                    testOrder.userId,
                    testOrder.type,
                    testOrder.quantity,
                    testOrder.price,
                    testOrder.action
                )
                expect(res.statusCode).toEqual(200)
                expect(res.body).toEqual({
                    'success': true,
                    'data': {
                        'orderId': 'newOrderId'
                    }
                })
            })
    })

    test('Place an order with invalid data', () => {
        const invalidOrder = {
            'foo': 'bar'
        }
        return request(app)
            .post('/order/place')
            .send(invalidOrder)
            .then(res => {
                expect(mockStorage.place).toHaveBeenCalledTimes(0)
                expect(res.statusCode).toEqual(400)
                expect(res.body).toEqual({
                    'success': false,
                    'error': 'Invalid request body'
                })
            })
    })
})

describe('Cancelling orders', () => {
    test('Cancel existing order', () => {
        const cancelData = {
            'orderId': 'realId'
        }
        return request(app)
            .post('/order/cancel')
            .send(cancelData)
            .then(res => {
                expect(mockStorage.cancel).toHaveBeenLastCalledWith(cancelData.orderId)
                expect(res.statusCode).toEqual(200)
                expect(res.body).toEqual({
                    'success': true
                })
            })
    })

    test('Cancel non-existant order', () => {
        const cancelData = {
            'orderId': 'fakeId'
        }
        mockStorage.cancel.mockReturnValueOnce(false)
        return request(app)
            .post('/order/cancel')
            .send(cancelData)
            .then(res => {
                expect(mockStorage.cancel).toHaveBeenLastCalledWith(cancelData.orderId)
                expect(res.statusCode).toEqual(400)
                expect(res.body).toEqual({
                    'success': false,
                    'error': 'Order not found'
                })
            })
    })

    test('Attempt to cancel an order with invalid data', () => {
        const invalidRequest = {
            'foo': 'bar'
        }
        return request(app)
            .post('/order/cancel')
            .send(invalidRequest)
            .then(res => {
                expect(mockStorage.cancel).toHaveBeenCalledTimes(0)
                expect(res.statusCode).toEqual(400)
                expect(res.body).toEqual({
                    'success': false,
                    'error': 'Invalid request body'
                })
            })
    })
})

describe('Getting summaries', () => {
    test('Get empty summary', () => {
        return request(app)
            .get('/order/summary')
            .then(res => {
                expect(mockStorage.summary).toHaveBeenCalledTimes(1)
                expect(res.statusCode).toEqual(200)
                expect(res.body).toEqual({
                    'success': true,
                    'data': {
                        'buy': [],
                        'sell': []
                    }
                })
            })
    })

    test('Get non empty summary', () => {
        const mockSummary = {
            'buy': [
                {
                    'type': 'Litecoin',
                    'quantity': 10,
                    'price': 123,
                    'action': 'sell'
                }
            ],
            'sell': [
                {
                    'type': 'Bitcoin',
                    'quantity': 5,
                    'price': 6,
                    'action': 'buy'
                }
            ]
        }
        mockStorage.summary.mockReturnValueOnce(mockSummary)

        return request(app)
            .get('/order/summary')
            .then(res => {
                expect(mockStorage.summary).toHaveBeenCalledTimes(1)
                expect(res.statusCode).toEqual(200)
                expect(res.body).toEqual({
                    'success': true,
                    'data': {
                        'buy': mockSummary.buy,
                        'sell': mockSummary.sell
                    }
                })
            })
    })
})