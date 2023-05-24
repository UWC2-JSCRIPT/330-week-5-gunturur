// Crate routes to the belwo dao's
//Requires authentication
//Create: POST /items - restricted to users with the "admin" role
//Update: PUT /items/:id - restricted to users with the "admin" role
//Get all items: GET /items - open to all users
//Get specific item: GET /items/:id - open to all users

const { Router } = require('express');
const router = Router();

const ItemDAO = require('../daos/item');
const { isAuthorized, isAdmin } = require('../middleware/auth');

// Create a new item (restricted to users with the "admin" role)
router.post('/', isAuthorized, isAdmin, async (req, res, next) => {
    try {
        let items = req.body;
        if (!Array.isArray(items)) {
            items = [items];
        }

        let createdItems = [];  // Array to hold the items created
        for (let item of items) {
            let itemObj = {
                title: item.title,
                price: item.price
            }
            let createdItem = await ItemDAO.createItem(itemObj);

            let createdItemObj = createdItem.toObject(); // Convets to object
            delete createdItemObj.__v; // Removes __v from the response
            delete createdItemObj.__id;

            createdItems.push(createdItemObj);  // Push each created item into the array
        }

        // If only a single item was created, return the item object.
        // Otherwise, return an array of created items.
        if (createdItems.length === 1) {
            return res.status(200).json(createdItems[0]);
        } else {
            return res.status(200).json(createdItems);
        }
    }
    catch (err) {
        next(err);
    }
});




// Get all items (open to all users)
router.get('/', isAuthorized, async (req, res, next) => {
    try {
        let items = await ItemDAO.getAllItems();
        res.status(200).json(items);
    } catch (err) {
        next(err);
    }
});

// Get a specific item (open to all users)
router.get('/:id', isAuthorized, async (req, res, next) => {
    try {
        let item = await ItemDAO.getItemById(req.params.id);
        res.status(200).json(item);
    } catch (err) {
        next(err);
    }
});


// Update an item (restricted to users with the "admin" role)
router.put('/:id', isAuthorized, isAdmin, async (req, res, next) => {
    try {
        let item = await ItemDAO.getItemById(req.params.id);
        if (!item) {
            return res.status(404).send("Item not found");
        }
        item.title = req.body.title;
        item.price = req.body.price;
        const updatedItem = await ItemDAO.updateItem(req.params.id, item);
        return res.status(200).json(updatedItem);
    } catch (err) {
        next(err);
    }
});






module.exports = router;
