const router = require("express").Router();
const {
  addToCart,
  getCartItems,
  removeCartItem,
} = require("../controllers/cart");

router.post("/add_to_cart", addToCart);

router.get('/items', getCartItems);

router.put('/remove_item', removeCartItem)

module.exports = router;
