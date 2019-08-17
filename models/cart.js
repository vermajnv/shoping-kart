let Cart = class Cart {
   constructor(oldCart) {
      this.items = oldCart.items || {};
      this.itemQuantity = oldCart.itemQuantity || 0;
      this.totalPrice = oldCart.totalPrice || 0;
   }

   add(item, id) {
      let storedItem = this.items[id];
      if(!storedItem)
      {
         storedItem = this.items[id] = {item : item, qty : 0, price : 0};
      }
      storedItem.qty++;
      storedItem.price = storedItem.item.price * storedItem.qty;
      this.itemQuantity++;
      this.totalPrice += storedItem.item.price;
   }
}

module.exports = Cart;
