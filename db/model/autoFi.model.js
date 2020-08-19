const mongoose = require('mongoose');

const autoFiSchema = new mongoose.Schema({
    "UUID": { type: String },
    "VIN": { type: String },
    "Make": { type: String },
    "Model": { type: String },
    "Mileage": { type: String },
    "Year": { type: Number },
    "Price": { type: Number },
    "Zip Code": { type: Number },
    "Create Date": { type: String },
    "Update Date": { type: String }
}, {
    collection: 'records',
    timestamps: true
})

module.exports = mongoose.model('autoFi', autoFiSchema);