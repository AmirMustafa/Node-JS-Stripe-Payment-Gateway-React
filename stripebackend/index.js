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
