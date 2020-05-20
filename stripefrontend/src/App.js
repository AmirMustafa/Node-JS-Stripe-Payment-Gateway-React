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
