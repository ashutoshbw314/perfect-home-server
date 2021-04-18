const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Order = require("../models/Order");
const Admin = require("../models/Admin");
const Review = require("../models/Review");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/charge", async (req, res) => {
  const {
    payment_id, 
    username,
    email,
    service_id,
    serviceAmount,
    serviceTitle,
    serviceDescription,
    serviceImageURL,
  } = req.body;
  const order = new Order({
    payment_id, 
    username,
    email,
    service_id,
    serviceAmount,
    serviceTitle,
    serviceDescription,
    serviceImageURL,
    status: 'pending'
  });

  try {
    const payment = await stripe.paymentIntents.create({
      amount: serviceAmount,
      currency: "USD",
      description: serviceDescription,
      payment_method: payment_id,
      confirm: true
    });

    const result = await order.save();

    res.status(200).json({
      paymentMessage: "Order placed successfully!",
      mongoMessage: result,
    })
  } catch(error) {
    console.log(error);
    res.status(400).json({
      message: error.message
    })
  }
})

router.post("/service", async (req, res) => {
  console.log(req.body)
  const product = new Service({
    title: req.body.serviceTitle,
    description: req.body.description,
    price: req.body.price,
    imageURL: req.body.imgURL,
    uid: req.body.uid,
  });
  
  try {
    const result = await product.save();
    res.json(result);
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});

router.get("/isAdmin", async (req, res) => {
  try {
    const result = await Admin.find({email: req.query.email}); 
    res.json(result.length == 0 ? false : true);
  } catch(err) {
    console.log(err.message)
    res.status(400).json({error: err.message});
  }
});

router.get("/3-services", async (req, res) => {
  try {
    const services = await Service.find().limit(3); 
    res.json(services);
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});

router.get("/3-random-reviews", async (req, res) => {
  try {
    const reviews = await Review.aggregate([
      {$sample: {size: 3}},
    ]); 
    res.json(reviews);
  } catch(err) {
    res.status(400).json({error: err.message});
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find(req.query.email ? {email: req.query.email} : {}).sort({date: -1}); 
    res.json(orders);
  } catch(error) {
    res.status(400).json({error: err.message});
  }
});

router.get("/services", async (req, res) => {
  try {
    const services = await Service.find(); 
    res.json(services);
  } catch(error) {
    res.status(400).json({error: err.message});
  }
});

router.delete("/services/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id); 
    const result = await service.remove();
    res.json(result);
  } catch(error) {
    console.log(error.message)
    res.status(400).json({error: error.message});
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id); 
    order.status = req.query.status;
    const result = await order.save();
    res.json(result);
  } catch(error) {
    res.status(400).send({message: error.message});
  } 
});

router.post("/review", async (req, res) => {
  console.log(req.body)
  const review = new Review({
    ...req.body
  });
  
  try {
    const result = await review.save();
    res.json(result);
  } catch(err) {
    console.log(err.message)
    res.status(400).json({error: err.message});
  }
});

router.post("/admin", async (req, res) => {
  const admin = new Admin({
    ...req.body
  });
  
  try {
    const result = await admin.save();
    res.json(result);
  } catch(error) {
    if (error.code == 11000) {
      res.status(400).json({error: 'An admin with same email address already exists'});
    } else {
      res.status(400).json({error: 'Something wrong happened'});
    }
  }
});

module.exports = router;
