const mongoose = require('mongoose')
const dataSchema = require('./ticket_data_schema')

/**
 * ? for custom fields, we will make use of Mongoose's discriminator function:
 * https://mongoosejs.com/docs/discriminators.html
 * 
 * in server.js, we will have a variable that holds the current ticket schema
 * when a super admin adds a custom field, we will use model.discriminator to
 * create a new schema, then overwrite the global variable in server.js so that all 
 * new requests use the new schema
 * 
 * when we scale this to include multiple companies, we will need either a database or 
 * a model within the assessor DB to track schemas.
 */
// todo : write function that produces schema object
  // takes field to be added, data type, and whether it's required
  // calls Ticket.discriminator custom field, object made of specified params
  // returns new discriminator model that extends Ticket
  // redeclare Ticket as new model

let Ticket = mongoose.Schema(
  {
    requestor: {
      type: ObjectId,
      required: true
    },
    vendorName: {
      type: String,
      required: true
    },
    overallRisk: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high']
    },
    buisnessRisk: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high']
    },
    status: {
      type: String,
      required: true,
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
      required: true,
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
    data: {
      type: dataSchema,
      required: true,
    },
    vendorService: {
      type: String,
      required: true,
    },
    customCodeRequired: {
      type: Boolean,
      required: true,
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
      required: true,
      default: 'N/A'
    },
    platform: {
      type: String,
      required: true,
    },
    dataAccess: {
      type: String,
      required: true
    },
    needMFA: {
      type: Boolean,
      required: true,
    },
    encryption: {
      type: Boolean,
      required: true
    },
    assessor: {
      type: ObjectId,
      required: false,
    },
    notes: {
      type: String,
      required: false
    },
    timeline: {
      type: String,
      required: true,
      default: 'standard',
      enum: ['standard', 'expedite']
    },
    attachments: {
      type: Number,
      required: true,
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

module.exports = mongoose.model('ticket', Ticket)