# TiketQ Microservice
Microservice development is a project focused on developing a smart booking dashboard that provides real-time insights into ticket sales, booking trends, and customer behavior.
## Process Checkout
 1. Create Transactionn <br> 
    Call the endpoint to create a new transaction. <br><br>
    **POST**: /api/transactions <br>
    Body Json:
    ```
    {
        "flightId": "550e8400-e29b-41d4-a716-446655440000",
        "passengerIds": ["550e8400-e29b-41d4-a716-446655440001"],
        "amount": 1500000,
        "currency": "IDR",
        "customerName": "John Doe2",
        "customerEmail": "john.doe@example.com",
        "customerPhone": "+6281234567890"
    }
    ```
    Response example:
    ```
    {
        "transactionId": "29fe6a9c-24a3-491a-ab35-30fb195d4cc2",
        "status": "CREATED",
        "amount": 1500000,
        "currency": "IDR",
        "createdAt": "2026-02-04T13:40:14.736Z"
    }
    ```
    <br>
2. Generate Midtrans Payment URL  <br>
    The transaction endpoint returns data stored in the database. Use the transactionId in param to generate a Midtrans payment URL. <br><br>
    **POST**: /api/payments/:transactionId/payment-url <br>
    Response example:
    ```
    {
        https://app.sandbox.midtrans.com/snap/v4/redirection/837856cf-f905-477e-8d3....
    }
    ```

