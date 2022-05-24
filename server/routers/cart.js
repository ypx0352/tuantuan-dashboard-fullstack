const router = require("express").Router();
const {
  addToCart,
  getCartItems,
  removeCartItem,
  setReturnAllProfitsItem,
} = require("../controllers/cart");

router.post("/add_to_cart", addToCart);

router.get("/items", getCartItems);

router.put("/remove_item", removeCartItem);

router.put("/set_return_all_profits_item", setReturnAllProfitsItem);

module.exports = router;
