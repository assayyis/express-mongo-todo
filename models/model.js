const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    task: {
        required: true,
        type: String
    },
    dueDate: {
        required: false,
        type: String
    },
    description: {
        required: false,
        type: String
    }
})

module.exports = mongoose.model('Data', dataSchema)