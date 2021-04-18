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

/******** The following codes handle service related requests *********/
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
/*router.get("/products/all", async (req, res) => {
  try {
  const products = await Product.find(); 
  res.json(products);
  } catch(error) {
    res.status(400).json({error: err.message});
  }
});

router.get("/products/:id", async (req, res) => {
  try {
  const product = await Product.findById(req.params.id); 
  res.json(product);
  } catch(error) {
    res.status(400).json({error: err.message});
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); 
    const result = await product.remove();
    res.json(result);
  } catch(err) {
    res.send("Error " + err);
  } 
});*/


/******** The following codes handle order related requests *********/
/*router.post("/orders", async (req, res) => {
  console.log(req.body)
  const order = new Order({
    name: req.body.name,
    price: req.body.price,
    artistName: req.body.artistName,
    imageURL: req.body.imageURL,
    uid: req.body.uid,
    date: new Date(req.body.date),
    email: req.body.email
  });
  
  try {
    const result = await order.save();
    res.json(result);
  } catch(err) {
    console.log(err.message)
    res.status(400).json({error: err.message});
  }
});

router.get("/orders/:uid", async (req, res) => {
  try {
    const orders = await Order.find({uid: req.params.uid}); 
    console.log('uid is ', req.params.uid)
    res.json(orders);
  } catch(error) {
    res.status(400).json({error: err.message});
  }
});*/

/*router.patch("/:id", async (req, res) => {
  try {
    const alien = await Alien.findById(req.params.id); 
    alien.sub = req.body.sub;
    const a1 = await alien.save();
    res.json(a1);
  } catch(err) {
    res.send("Error " + err);
  } 
});
*/

module.exports = router;
