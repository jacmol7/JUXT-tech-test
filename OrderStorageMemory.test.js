const StorageInterface = require('./OrderStorageMemory')
var storage = null

beforeEach(() => {
    storage = new StorageInterface()
})

afterEach(() => {
    storage = null
})

test('Place an order', () => {
    const orderId = storage.place(1, 'Bitcoin', 100, 10, 'buy')
    expect(orderId).not.toBeNull()
    expect(orderId).toBeDefined()

    const order = storage.getOrderById(orderId)
    expect(order).toEqual({
        'userId': 1,
        'type': 'Bitcoin',
        'quantity': 100,
        'price': 10,
        'action': 'buy'
    })
})

test('Cancel an order', () => {
    const orderId = storage.place(1, 'Bitcoin', 100, 10, 'buy')
    expect(orderId).not.toBeNull()
    expect(orderId).toBeDefined()

    const order = storage.getOrderById(orderId)
    expect(order).toEqual({
        'userId': 1,
        'type': 'Bitcoin',
        'quantity': 100,
        'price': 10,
        'action': 'buy'
    })

    const cancelReponse = storage.cancel(orderId)
    expect(cancelReponse).toEqual(true)

    const cancelledOrder = storage.getOrderById(orderId)
    expect(cancelledOrder).toEqual(false)
})

test('Cancel a non-existant order', () => {
    const cancelResponse = storage.cancel('fakeId')
    expect(cancelResponse).toEqual(false)
})

test('Generate summary', () => {
    storage.place(1, 'Bitcoin', 5, 10, 'buy')
    storage.place(1, 'Bitcoin', 10, 10, 'buy')
    storage.place(2, 'Etherium', 1, 99, 'buy')
    storage.place(2, 'Etherium', 2, 99, 'buy')
    storage.place(3, 'Bitcoin', 100, 1, 'buy')
    storage.place(1, 'Etherium', 100, 2, 'buy')
    storage.place(1, 'Etherium', 100, 2, 'sell')
    storage.place(1, 'Etherium', 100, 2, 'sell')
    storage.place(1, 'Bitcoin', 100, 10, 'sell')

    const summary = storage.summary()
    expect(summary).toEqual({
        'buy': [
            {
                'type': 'Etherium',
                'quantity': 3,
                'price': 99
            },
            {
                'type': 'Bitcoin',
                'quantity': 15,
                'price': 10
            },
            {
                'type': 'Etherium',
                'quantity': 100,
                'price': 2
            },
            {
                'type': 'Bitcoin',
                'quantity': 100,
                'price': 1
            }
        ],
        'sell': [
            {
                'type': 'Etherium',
                'quantity': 200,
                'price': 2
            },
            {
                'type': 'Bitcoin',
                'quantity': 100,
                'price': 10
            }
        ]
    })
})