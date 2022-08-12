const mongoose = require('mongoose')


let customFields = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    fieldType: {
        type: String,
        required: true,
        enum: ["string","number","boolean","array","date"]
    },
    isRequired: {
        type: Boolean,
        required: false,
        
    },
    defaultValue: {
        type: String,
        required: false
    },
    reqOrAsr:{
        type:String,
        required: true,
        default: "req",
        enum: ['req', 'asr']
    }
})

module.exports = mongoose.model("Custom Fields",customFields)
