# JUXT-tech-test

This is my submission for my tech test from JUXT.

It creates a REST API with three routes:

## /order/place
To place a new order you should provide all the required details here like this:

{
  "userId": 1234,
  "type": "Bitcoin",
  "quantity": 10,
  "price": 100,
  "action": "buy"
}

If the order was created successfully then you will recieve confirmation and the ID of the new order like this:

{
  "success": true,
  "data": {
    "orderId": "6c997c42-1105-4893-a12e-959efacc7477"
  }
}

## /order/cancel
To cancel an order you should provide the ID of the order to cancel here like this:

{
  "orderId": "6c997c42-1105-4893-a12e-959efacc7477"
}

If the order was cancelled successfully then you will recieve confirmation like this:

{
  "success": true
}

## /order/summary
To get the summary of the current orders you can make a GET request to here to recieve the summary like this:

{
  "success": true,
  "data": {
    "buy": [
      {
        "type": "Etherium",
        "quantity": 100,
        "price": 50
      }
    ],
    "sell": [
      {
        "type": "Bitcoin",
        "quantity": 250,
        "price": 100
      }
    ]
  }
}
