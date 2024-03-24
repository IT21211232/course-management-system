const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
})

const Resource = mongoose.model("resource", resourceSchema) 

module.exports = Resource;