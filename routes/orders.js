// Create the routes for the below DAO's
//Create: POST /orders - open to all users
//- Takes an array of item _id values (repeat values can appear).
//- Order should be created with a total field with the total cost of all the items from the time the order is placed (as the item prices could change).
//- The order should also have the userId of the user placing the order.
//- Get all orders: GET /orders - return all the orders made by the user making the request if not an admin user. If they are an admin user it should return all orders in the DB.
//- Get an order: GET /order/:id - return an order with the items array containing the full item objects rather than just their _id. If the user is a normal user return a 404 if they did not place the order. An admin user should be able to get any order.

const { Router } = require('express');
const router = Router();

const jwt = require('jsonwebtoken');

const orderDAO = require('../daos/order');
const itemDAO = require('../daos/item');
const userDAO = require('../daos/user');
const { isAuthorized, isAdmin } = require('../middleware/auth');



//Create: POST /orders - open to all users
//- Takes an array of item _id values (repeat values can appear).
//- Order should be created with a total field with the total cost of all the items from the time the order is placed (as the item prices could change).
//- The order should also have the userId of the user placing the order.
//- Get all orders: GET /orders - return all the orders made by the user making the request if not an admin user. If they are an admin user it should return all orders in the DB.

router.post('/', isAuthorized, async (req, res, next) => {
    try {
        const userId = req.user._id;


        let items = req.body;
        if (!Array.isArray(items)) {
            items = [items];
        }
        // Check that all items exist
        for (let itemId of items) {
            const item = await itemDAO.getItemById(itemId);

            if (!item) {
                return res.status(400).json({
                    message: 'Item not found'
                });
            }

        }

        // Fetch each item and calculate total cost
        let total = 0;
        for (let itemId of items) {
            const item = await itemDAO.getItemById(itemId);
            total += item.price;

        }

        // Create the order
        const newOrderData = {
            userId,
            items,
            total
        };
        const newOrder = await orderDAO.createOrder(newOrderData);


        res.status(200).json(newOrder);
    } catch (err) {
        next(err);
    }
});


// Get an order: GET /order/:id - return an order with the items array containing the full item objects rather than just their _id. If the user is a normal user return a 404 if they did not place the order. An admin user should be able to get any order

router.get('/:id', isAuthorized, async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await orderDAO.getOrder(id);

        // If the order does not exist, return an error
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        const items = [];
        for (let i = 0; i < order.items.length; i++) {
            const item = await itemDAO.getItemById(order.items[i]);
            items.push(item);
        }
        order.items = items;


        const currentUser = req.user._id;
        const currentUserRole = req.user.roles.includes('admin');

        // If the user is an admin or if the user is the one who made the order, return the order
        if (currentUserRole || currentUser == order.userId) {
            return res.status(200).json(order);
        } else {
            // If neither condition is met, return an error
            return res.status(404).json({
                message: 'You do not have permission to view this order'
            });
        }

    } catch (err) {
        next(err);
    }
});


// Get orders

router.get('/', isAuthorized, async (req, res, next) => {
    try {
        currentUser = req.user._id;
        const currentUserRole = req.user.roles.includes('admin');
        console.log(currentUserRole);

        if (!currentUserRole) {
            const orders = await orderDAO.getOrdersByUserId(currentUser);
            if (!orders) {
                return res.status(404).json({
                    message: 'No orders found'
                });
            } else {
                return res.status(200).json(orders);
            }
        } else {
            const orders = await orderDAO.getAllOrders();
            return res.status(200).json(orders);
        }
    } catch (err) {
        next(err);
    }
}
);



module.exports = router;

