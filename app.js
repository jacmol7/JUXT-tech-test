const { verifyFields } = require('./utils')
const express = require('express')
const app = express()
const cors = require('cors')
var storage = null

/* Providing the interface to use to store data here makes swapping it out
 * in server.js easy and allows tests to provide a mocked version but it
 * doesn't check if the interface does what it expects. This should probably
 * be changed to something more robust if the app requires more dependencies in the future.
 */
function setStorageInterface(storageInterace) {
    storage = storageInterace
}

app.use(express.json())
app.use(cors())
app.use((err, req, res, next) => {
    // Catch if the request body is not valid JSON
    if (err instanceof SyntaxError && err.type == 'entity.parse.failed') {
        res.status(400)
        res.send({ 'success': false, 'error': 'Malformed request body' })
    } else {
        next()
    }
})

app.post('/order/place', (req, res) => {
    const inputCheck = verifyFields({
        'userId': 'number',
        'type': 'string',
        'quantity': 'number',
        'price': 'number',
        'action': 'string'
    }, req.body)
    if (inputCheck.valid) {
        if (req.body.action == 'buy' || req.body.action == 'sell') {
            const newOrderId = storage.place(
                req.body.userId,
                req.body.type,
                req.body.quantity,
                req.body.price,
                req.body.action
            )
            res.send({ 'success': true, 'data': { 'orderId': newOrderId } })
        } else {
            res.status(400)
            res.send({ 'success': false, 'error': 'Invalid action type' })
        }
    } else {
        res.status(400)
        res.send({ 'success': false, 'error': 'Invalid request body' })
    }
})

app.post('/order/cancel', (req, res) => {
    const inputCheck = verifyFields({
        'orderId': 'string'
    }, req.body)
    if (inputCheck.valid) {
        const deleted = storage.cancel(req.body.orderId)
        if (deleted) {
            res.send({ 'success': true })
        } else {
            res.status(400)
            res.send({ 'success': false, 'error': 'Order not found' })
        }
    } else {
        res.status(400)
        res.send({ 'success': false, 'error': 'Invalid request body' })
    }
})

app.get('/order/summary', (req, res) => {
    const summary = storage.summary()
    res.send({
        'success': true,
        'data': {
            'buy': summary.buy,
            'sell': summary.sell
        }
    })
})

module.exports.app = app
module.exports.setStorageInterface = setStorageInterface