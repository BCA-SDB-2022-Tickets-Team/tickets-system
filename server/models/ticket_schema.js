const mongoose = require('mongoose'),
      custom_fields_schema = require('./custom_fields_schema')

let Ticket = mongoose.Schema(
  {
    requestor: {
      type: mongoose.ObjectId,
      required: true
    },
    vendorName: {
      type: String,
      required: true
    },
    overallRisk: {
      type: String,
      required: false,
      enum: ['low', 'medium', 'high']
    },
    businessRisk: {
      type: String,
      required: false,
      enum: ['low', 'medium', 'high']
    },
    status: {
      type: String,
      required: false,
      default: 'new request',
      enum: [
              'new request', 
              'questionaire sent', 
              'requestor review',
              'director review',
              'on hold - vendor',
              'in progress',
              'completed'  
            ]
    },
    dateCompleted: {
      type: Date,
      required: false,
    },
    projectDescription: {
      type: String,
      required: false,
    },
    projectManager: {
      type: String,
      required: false
    },
    buisnessContact: {
      type: String,
      required: false
    },
    department: {
      type: String,
      required: false,
      enum: [
        'hr', 
        'it', 
        'legal', 
        'manufacturing', 
        'marketing', 
        'ops', 
        'procurement'
      ]
    },
    dataSensitivity: {
      type: String,
      required: false,
    },
    dataDescription: {
      type: String,
      required: false
    }, 
    dataRegulation: {
      type: String,
      required: false,
      default: 'none',
      enum: ['none', 'gxp', 'sox', 'gdpr']
    },
    phi: {
      type: Boolean,
      required: false,
      default: false
    },
    vendorService: {
      type: String,
      required: false,
    },
    customCodeRequired: {
      type: Boolean,
      required: false,
      default: false
    },
    submittedToSecurity: {
      type: Date,
      required: false
    },
    integrations: {
      type: Boolean,
      default: false,
    },
    systemLevelAccess: {
      type: String,
      required: false,
      default: 'N/A'
    },
    platform: {
      type: String,
      required: false,
    },
    dataAccess: {
      type: String,
      required: false
    },
    needMFA: {
      type: Boolean,
      required: false,
    },
    encryption: {
      type: Boolean,
      required: false
    },
    assessor: {
      type: mongoose.ObjectId,
      required: false,
    },
    notes: {
      type: String,
      required: false
    },
    timeline: {
      type: String,
      required: false,
      default: 'standard',
      enum: ['standard', 'expedite']
    },
    attachments: {
      type: Number,
      required: false,
      default: 0
    },
    dueDate: {
      type: Date,
      required: false
    },
    warningDate: {
      type: Date,
      required: false,
    },
    questionnaireSent: {
      type: Date,
      required: false
    },
    questionnaireRec: {
      type: Date, 
      required: false
    }
  },
  {
    timestamps: true
  }
)

/**
 * an async function that will only run when server.js is 
 * restarted. It queries the custom_fields collection and
 * returns every custom field created for this deployment.
 * Then it converts those documents into Schemas and
 * appends them to defeult the Ticket schema. Finally,
 * it sets the Tickets variable to the "new" schema.
 * 
 * @returns void
 */
async function runAtStartup(){
  const allCustomFields = await custom_fields_schema.find()

  if(allCustomFields.length > 0){
    for(field of allCustomFields){
      const schemaFromField = new mongoose.Schema()
      
      schemaFromField.path(field.name, field.fieldType)
      Ticket.add(schemaFromField)
      const ticketSchemaType = Ticket.path(field.name)

      Ticket.path(field.name).required(field.isRequired ? true : false)
      Ticket.path(field.name).options
      //TODO: make default values and enums work
      // if(field.defeaultVal){
      //   Ticket.path(field.name).default(field.defeaultVal)
      // }
    }
  } else {
    return;
  }
}
runAtStartup()

const updateSchema = function(field){
  const newSchema = Ticket.add(field)
  Ticket = newSchema
}

const makeModel = function(){
  return mongoose.model('ticket', Ticket)
}

module.exports = {
  makeModel,
  updateSchema
}