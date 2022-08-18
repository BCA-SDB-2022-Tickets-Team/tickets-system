const mongoose = require("mongoose")
const router = require("express").Router();
const session = require("../middlewares/session");
const CustomFields = require("../models/custom_fields_schema.js")
const { UpdateSchema } = require("../models/ticket_schema")

router
.route("/add-custom-field")
.post([session], async (req, res, next)=>{
    try {
        if(!req.user.isAdmin)
        {
        throw new Error("user must be admin to add custom fields")
        } else {
            if (req.body) {
                console.log(req.body)

                // Convert field type into correct formatting for database
                let fieldType = req.body.fieldType
                if (fieldType === "Text") {
                    fieldType = 'string'
                } else if (fieldType === "Drop-down") {
                    fieldType = 'array'
                } else if (fieldType === "Checkbox") {
                    fieldType = 'boolean'
                } else if (fieldType === "Date") {
                    fieldType = 'date'
                } else if (fieldType === "Number") {
                    fieldType = 'number'
                } else {
                    fieldType = 'string'
                }
                console.log(fieldType)
                
                // Convert reqOrAsr into correct formatting for database
                let reqOrAsr = req.body.reqOrAsr
                if (!reqOrAsr) {
                    reqOrAsr = "req"
                } else {
                    reqOrAsr = "asr"
                }
                console.log(reqOrAsr)

                const newField = new CustomFields({
                    name: req.body.name,
                    fieldType: fieldType,
                    isRequired: req.body.isRequired,
                    defaultValue: req.body.defaultValue,
                    reqOrAsr: reqOrAsr
                })
                console.log(newField)
                await newField.save()
                    .then(newField=>{
                        UpdateSchema(newField)
                        return newField
                    }).then((newField)=>{
                        res.status(200).json({
                            status: "successfully added custom field",
                            newField
                        })

                    })
                    .catch(error=>{
                        throw new Error(`something went wrong trying to add a new custom field to the database: ${error}`)
                    })
            }
        }
    } catch (error) {
       console.log(error) 
       res.status(500).json({
           status: "adding custom field failed",
           message: error
       })
    }
})


module.exports = router