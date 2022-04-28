const { randomUUID } = require('crypto')

class OrderStorageMemory {
    constructor() {
        this.orders = new Map()
    }

    /**
     * Place a new order
     * @param {number} userId 
     * @param {string} type 
     * @param {number} quantity 
     * @param {number} price 
     * @param {'buy'|'sell'} action 
     * @returns {string} The ID of the new order
     */
    place(userId, type, quantity, price, action) {
        let newOrderId = randomUUID()
        while (this.orders.has(newOrderId)) {
            newOrderId = randomUUID()
        }

        this.orders.set(newOrderId, {
            'userId': userId,
            'type': type,
            'quantity': quantity,
            'price': price,
            'action': action
        })

        return newOrderId
    }

    /**
     * Cancel an order
     * @param {string} orderId The order to cancel
     * @returns {boolean} If an order was successfully canceled
     */
    cancel(orderId) {
        if (this.orders.has(orderId)) {
            this.orders.delete(orderId)
            return true
        } else {
            return false
        }
    }

    /**
     * Get the summary of both the buy and sell orders
     * @returns {{buy: Array.<object>, sell: Array.<object>}}
     */
    summary() {
        let summary = {
            'buy': [],
            'sell': []
        }
        this.orders.forEach(curOrder => {
            const groupIndex = summary[curOrder.action].findIndex(order => {
                return (
                    curOrder.type == order.type &&
                    curOrder.price == order.price
                )
            })
            if (groupIndex != -1) {
                summary[curOrder.action][groupIndex].quantity += curOrder.quantity
            } else {
                summary[curOrder.action].push({
                    'type': curOrder.type,
                    'quantity': curOrder.quantity,
                    'price': curOrder.price,
                })
            }
        })

        summary.buy.sort((a, b) => { return b.price - a.price })
        summary.sell.sort((a, b) => { return a.price - b.price })

        return summary
    }

    /**
     * Retrieve an order by its ID
     * @param {string} orderId 
     * @returns {object|false}
     */
    getOrderById(orderId) {
        if (this.orders.has(orderId)) {
            return this.orders.get(orderId)
        } else {
            return false
        }
    }
}

module.exports = OrderStorageMemory