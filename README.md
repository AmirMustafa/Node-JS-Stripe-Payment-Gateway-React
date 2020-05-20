# Node-JS-Stripe-Payment-Gateway-React

From React JS a checkout Payment button triggers which interact with Node JS to for payment transactions. Here we have also used shipping and billing address itself.
For Node (Server) we have used stripe package and from React (Client) we have used react-stripe-checkout package.

## Project Overview

https://www.loom.com/share/5c108c4a7d8647f69b4e9ba21423292d

## Installation
1. Clone the repository 
2. npm install in both stripefrontend and stripebackend seperately
3. You need to create .env file in both stripebackend and stripefrontend
4. Go to stripebackend in terminal/commandline ``` npm run dev ```

stripefrontend/.env  (React JS)
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=<your_stripe_publishable_key>

```

stripebackend/.env  (React JS)
```
NODE_APP_STRIPE_SECRETKEY=<your_stripe_secret_key>
```

i.e.
3. Server starts in https://localhost:3000 port

## Screenshots
<img src="https://user-images.githubusercontent.com/15896579/82428396-15d9cd00-9aa8-11ea-83e7-356fe7eee5a5.png" alt="Screenshot of Application" >
<img src="https://user-images.githubusercontent.com/15896579/82428401-196d5400-9aa8-11ea-9c0d-179c357de7d5.png" alt="Screenshot of Application" >
<img src="https://user-images.githubusercontent.com/15896579/82428407-1bcfae00-9aa8-11ea-9d26-966d8037eea2.png" alt="Screenshot of Application" >
<img src="https://user-images.githubusercontent.com/15896579/82428420-21c58f00-9aa8-11ea-9690-c612e7c73610.png" alt="Screenshot of Application" >
<img src="https://user-images.githubusercontent.com/15896579/82428442-27bb7000-9aa8-11ea-879b-0dbd619dfc9d.png" alt="Screenshot of Application" >
<img src="https://user-images.githubusercontent.com/15896579/82428450-2ab66080-9aa8-11ea-9bf4-bc9d20c1da2d.png" alt="Screenshot of Application" >


## Snippets
1. App.js (Client - React)

```
import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

// TODO: node unit testing - mocha and chai

import StripeCheckout from "react-stripe-checkout";
require("dotenv").config();

function App() {
  const [product, setProduct] = useState({
    name: "React from facebook",
    price: 20,
    productBy: "facebook",
  });

  const makePayment = (token) => {
    // this token is auto received when you write token as key
    const body = {
      token,
      product,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    let request = fetch("/payment", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log("RESPONSE ", response);
        const { status } = response;
        console.log("STATUS ", status);
      })
      .catch((err) => console.log(err));

    return request;
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
          token={makePayment}
          name="Buy React"
          price={product.price * 100}
          shippingAddress
          billingAddress
        >
          <button className="btn-large blue">
            Buy React in just $ {product.price}
          </button>
        </StripeCheckout>
        {/* <StripeCheckout stripeKey="" token="" name="Buy React" /> */}
      </header>
    </div>
  );
}

export default App;

```
2. index.js (Server - Node)

```
const cors = require("cors");
const express = require("express");
require("dotenv").config();

const stripe = require("stripe")(process.env.NODE_APP_STRIPE_SECRETKEY);
const { v4: uuid } = require("uuid");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send(`Test Stripe Secret Key - ${process.env.NODE_APP_STRIPE_SECRETKEY}`);
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT ", product);
  console.log("PRICE ", product.price);
  const idempotencyKey = uuid(); // this key is used so that you do not double charge in case of error

  let request = stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email, //in case you want mail
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));

  return request;
});

// listen
port = process.env.PORT || 8282;
app.listen(port, () => {
  console.log(`server running in port ${port}`);
});

```
