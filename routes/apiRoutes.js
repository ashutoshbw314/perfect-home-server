const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Admin = require("../models/Admin");
const Stripe = require("stripe");

const stripe = new Stripe("sk_test_51Ie2CCBegGKHxRdA4RNQ08MvIA721JCKof9CAXSpHvHyxdqUoxigA3LkI9ROs74DWBcrwb2mgLsh6QqIDci0409a002oKX0Mwk");

router.post("/charge", async (req, res) => {
  const {id, amount} = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Home cleaning",
      payment_method: id,
      confirm: true
    });

    console.log(payment);

    res.status(200).json({
      confirm: "abc123"
    })
  } catch(error) {
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
