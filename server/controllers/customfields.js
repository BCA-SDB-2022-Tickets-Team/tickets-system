const mongoose = require("mongoose")
const router = require("express").Router();
const session = require("../middlewares/session");
const CustomFields = require("../models/custom_fields_schema.js")
const {UpdateSchema } = require("../models/ticket_schema")

router
.route("/add-custom-field")
.post([session], async (req, res, next)=>{
    try {if(!req.user.isAdmin)
        {
        throw new Error("user must be admin to add custom fields")
        }else{
            if (req.body){
                const newField = new CustomFields({
                    name: req.body.name,
                    fieldType: req.body.fieldType,
                    isRequired: req.body.isRequired,
                    defaultValue: req.body.defaultValue,
                    reqOrAsr: req.body.reqOrAsr

                })
                newField.save()
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