//Create: POST /orders - open to all users
//- Takes an array of item _id values (repeat values can appear).
//- Order should be created with a total field with the total cost of all the items from the time the order is placed (as the item prices could change).
//- The order should also have the userId of the user placing the order.
//- Get all orders: GET /orders - return all the orders made by the user making the request if not an admin user. If they are an admin user it should return all orders in the DB.
//- Get an order: GET /order/:id - return an order with the items array containing the full item objects rather than just their _id. If the user is a normal user return a 404 if they did not place the order. An admin user should be able to get any order.


const Order = require('../models/order');
const User = require('../models/user');


//Create an order
module.exports.createOrder = async (orderData) => {
  try {
    const order = await Order.create(orderData);
    return order;
  }
  catch (err) {
    console.log(err);
  }
  return;
}

//Get all orders
module.exports.getAllOrders = async () => {
  try {
    const orders = await Order.find();
    return orders;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

//Get an order
module.exports.getOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId).lean();
    return order;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports.getOrdersByUserId = async (userId) => {
  try {
    const order = await Order.find({ userId: userId });
    return order;
  } catch (err) {
    console.error(err);
    throw err;
  }
}