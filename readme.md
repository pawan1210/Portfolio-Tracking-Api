# Worker-Manager-Dashboard

Hosted Link - https://portfolio-tracking-api.vercel.app/

Postman Collection - https://www.getpostman.com/collections/58ef81faeb0a0a7c6cab

Postman Environment Link - https://drive.google.com/file/d/1XhQmpEeEd_yPymaK0urkihzNGWSiJZ2y/view?usp=share_link

Note - "/db/clear" route is there to remove data from all the collections.

- This app is hosted on Vercel and by the time you use it, it might be down. So for the first API request it might take some time or we can see "Deployment Error". Once you hit the API again it will be restarted and work again.

### Features/Steps to use

1. Import postman collection.
2. Import postman environment.
3. Create a user.
4. Login user.
5. Via postman test-scripts, the jwt-token, user_id will set for all the Apis.
6. Create a portfolio for the user.
7. Portfolio id will be set via test-scripts.
8. Create trade/ update trade / remove trade for the portfolio.
9. Get portfolio returns.
10. Get all securities with trades.

### Models and logic behind modelling

- User Model

  - indexed with "email".
  - and each user can have multiple portfolios.

- Portfolio Model

  - indexed with compound index {user_id, portfolio_id}.
  - each portfolio has securities Map/Object with key as "security_id".
  - each portfolio has list of Trades and where each item is a reference of Trade model.
  - Security is embedded but Trade is referred.

- Trade Model

  - each trade has portfolio_id.
  - trade has security_type and ticker_symbol.
  - security_type can be STOCK, GOLD etc.
  - ticker_symbol can be WIPRO, TCS etc.
  - trade_type can BUY and SELL.
  - trade can have status [SUCCESS, FAILED, VOIDED]

- Security Model

  - It is embedded in Portfolio model.

- Why security is embedded?

  - Add trade and get-securities with trades (quantity and average_price) <br />
    will be the most frequent operations. So we can get embedded securities <br />
    and trades list in single query and do in-memory formatting to return the response.

  - Adding a trade will become complex as we are not creating for a security <br />
    instead we are doing creating for a portfolio. First we have to check if security with <br />
    ticker_symbol is already there or not. If not create one and get the security_id. Then create trade. <br />
    Similarty updating trade will be very difficult.

### API - LIST

### - User

1. **"/user/register"** (POST)

- request
  ```
  {
      "email":"",
  }
  ```
- response
  ```
  {
      "user": {
          "email": "test-email",
          "_id": "637ce63351d78c1d50a2570c",
          "__v": 0
      },
      "message": "User created successfully"
  }
  ```
  - For simplicity, only email is used.

2. **"/user/login"** (POST)

- **request**
  ```
  {
      "email": "{{test-email}}"
  }
  ```
- **response**
  ```
  {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QtZW1haWwiLCJpYXQiOjE2NjkxMzAwMTl9.K1_2BHFhT4TFk6woIWC1-B0pjk640VRYDxG-9lssX2w",
      "user": {
          "_id": "637ce63351d78c1d50a2570c",
          "email": "test-email",
          "__v": 0
      }
  }
  ```
  - Once this API will be triggerd, using test-scripts token and user_id will be added to postman environment.
  - Each subsequent request will contain the header jwt.

### - Portfolio

1. **"/portfolio"** (POST)

- **request**

  ```
  {
      "title": "test-portfolio",
      "user_id": "{{user_id}}"
  }
  ```

- **response**
  ```
  {
      "portfolio": {
          "title": "test-portfolio",
          "user_id": "637cf07112fab7251a39c102",
          "trades": [],
          "_id": "637cf0e212fab7251a39c113",
          "createdAt": "2022-11-22T15:55:14.203Z",
          "updatedAt": "2022-11-22T15:55:14.203Z",
          "__v": 0
      },
      "message": "Portfolio created successfully"
  }
  ```
  - portfolio_id will set after via test-scripts.

2. **"/portfolio/<portfolio_id>"** (GET)

- **response**
  ```
  {
      "title": "test-portfolio",
      "securities": {
          "637cf16a12fab7251a39c117": {
              "portfolio_id": "637cf0e212fab7251a39c113",
              "trade_type": "BUY",
              "security_type": "STOCK",
              "ticker_symbol": "WIPRO",
              "quantity": 2,
              "unit": "SHARE",
              "average_price": 300
          }
      }
  }
  ```
  - Portfolio title with all its securities will be returned.

3. **"/portfolio/<portfolioId>/get-securities"** (GET)

- **response**
  ```
  {
      "securities": [
          {
              "portfolio_id": "637cf0e212fab7251a39c113",
              "trade_type": "BUY",
              "security_type": "STOCK",
              "ticker_symbol": "WIPRO",
              "quantity": 2,
              "unit": "SHARE",
              "average_price": 300,
              "trades": [
                  {
                      "ticker_symbol": "WIPRO",
                      "security_type": "STOCK",
                      "price": 300,
                      "trade_type": "BUY",
                      "quantity": 2,
                      "unit": "SHARE",
                      "status": "SUCCESS"
                  }
              ]
          }
      ]
  }
  ```
  - Securities with all its trades will be returned.

4. **"/portfolio/{{portfolio_id}}/get-returns"** (GET)

- **response**
  ```
  {
      "portfolio_return": -400
  }
  ```

### - Trade

1. **"/trade"** (POST)

- **request**

  ```
  {
      "portfolio_id":"{{portfolio_id}}",
      "trade_type": "BUY",
      "security_type": "STOCK",
      "ticker_symbol": "WIPRO",
      "price" : 300,
      "quantity" : 2,
      "unit": "SHARE"
  }
  ```

  - All the above fields are mandatory.
  - Yup validation is there for "require",
    "should be positive", "should be in enum"

- **response**
  ```
  {
    "message": "Trade successful",
    "trade": {
        "portfolio_id": "637cee7812fab7251a39c0f3",
        "price": 300,
        "quantity": 2,
        "unit": "SHARE",
        "status": "SUCCESS",
        "trade_type": "BUY",
        "security_type": "STOCK",
        "ticker_symbol": "WIPRO",
        "_id": "637cee7d12fab7251a39c0f7",
        "createdAt": "2022-11-22T15:45:01.246Z",
        "updatedAt": "2022-11-22T15:45:01.246Z",
        "__v": 0
    }
  }
  ```
  - After this response, trade_id will be set via automatic scripts.

2. **"/trade/<trade_id>"** (PATCH)

- **request**

  ```
  {
      "portfolio_id":"{{portfolio_id}}",
      "quantity": "1"
  }
  ```

  - portfolio_id is mandatory.
  - All the other fields can be updated.

- **response**
  ```
  {
      "trade": {
          "_id": "637cee7d12fab7251a39c0f7",
          "portfolio_id": "637cee7812fab7251a39c0f3",
          "price": 300,
          "quantity": 1,
          "unit": "SHARE",
          "status": "SUCCESS",
          "trade_type": "BUY",
          "security_type": "STOCK",
          "ticker_symbol": "WIPRO",
          "createdAt": "2022-11-22T15:45:01.246Z",
          "updatedAt": "2022-11-22T15:50:11.539Z",
          "__v": 0
      }
  }
  ```
  - Updated trade will be returned, else error message will be returned.

3. **"/trade/<trade_id>"** (DELETE)

- Need to pass trade_id in the query param
- **response**
  ```
  {
      "message": "Trade with id 637cf07d12fab7251a39c10a removed successfully"
  }
  ```

### Reqeust validation

- Yup library is used for every request validation. Please check middleware.js for every yup schema.

### Middlewares

- Two types of middleware are there.
  - Middleware for verifying the jwt token passed in headers.
  - Request valdation middleware which validates the request based <br />
    on Yup schema and return errors from there onwards if required.

## How to Run Locally

- Clone Repository
- Install the modules using `npm install `.
- Create a .env file inside the folder, the .env file should contain the following
  ```
  PORT = <PORT>
  MONOGO_URL = <URL>
  JWT_SECRET_KEY = <key>
  ```
- Run `node app.js `
