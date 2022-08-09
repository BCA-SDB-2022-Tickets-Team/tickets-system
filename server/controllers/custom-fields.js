const { schema } = require('../models/custom_fields_schema')

const mongoose = require('mongoose'),
      express  = require('express'),
      router   = express.Router(),
      session  = require('../middlewares/session'),
      fieldsSchema = require('../models/custom_fields_schema'),
      { updateSchema } = require('../models/ticket_schema')

router.route('/add-custom-field')
  .post([session], async (req, res, next) => {
    try {
      if(!req.user.isAdmin){
        throw new Error('user must be admin to add custom fields')
      } else {
        //TODO: type-check object coming from front-end
        if(req.body.field){
          // console.log(`req body obj`, req.body)
          const newField = new fieldsSchema({
            name: req.body.field.name,
            fieldType: req.body.field.fieldType,
            isRequired: req.body.field.isRequired,
            defaultVal: req.body.field.defaultVal,
          })
          // console.log(newField)
          newField.save()
            .then(newField => {
              const schemaObj = new Object()
              schemaObj[newField.name] = {
                type: newField.fieldType,
                required:  newField.isRequired ? newField.isRequired : false,
              }
              if(newField.defaultVal){
                schemaObj[newField.name].default = newField.defaultVal
              }

              const schemaFromField = new mongoose.Schema()
              schemaFromField.add(schemaObj)
              updateSchema(schemaFromField)
              return newField
            })
            .then(newField => {
              res.status(200).json({
                status: "new field created!",
                newField
              })
            })
            .catch(err => {
              throw new Error(`something went wrong trying to add a new custom field to the DB: ${err}`)
            })
        }
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: 'adding custom field failed because',
        message: error
      })
    }
  })

module.exports = router