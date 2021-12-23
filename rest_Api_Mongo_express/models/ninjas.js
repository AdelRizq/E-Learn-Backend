const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NinjaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name feild is required']
    },
    rank: {
        type: String
    },
    available: {
        type: Boolean,
        default: false
    }
});

const Ninja = mongoose.model('ninja', NinjaSchema); //colletionName , Schema  


module.exports = Ninja;