//Requires authentication
//Create: POST /items - restricted to users with the "admin" role
//Update: PUT /items/:id - restricted to users with the "admin" role
//Get all items: GET /items - open to all users
//Get specific item: GET /items/:id - open to all users

const Item = require('../models/item');
const mongoose = require('mongoose');



//Create items with title and price, multiple can be created at once
module.exports.createItem = async (itemData) => {
    try {
        const item = await Item.create(itemData);
        const createdItem = await Item.findById(item._id);
        return createdItem;
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.getItemById = async (itemId) => {
    try {
        const item = await Item.findById(itemId).lean();
        return item;
    }
    catch (err) {
        console.log(err);
    }
}

module.exports.getAllItems = async () => {
    try {
        const items = await Item.find().lean();
        return items;
    }
    catch (err) {
        console.log(err);
    }
}



module.exports.updateItem = async (itemId, itemData) => {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        console.log('Invalid itemId');
        return;
    }
    try {
        const item = await Item.findByIdAndUpdate(itemId, itemData, { new: true });
        return item;
    }
    catch (err) {
        console.log(err);
    }
}

