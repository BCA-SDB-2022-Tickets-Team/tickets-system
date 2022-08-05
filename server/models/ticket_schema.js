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

module.exports = mongoose.model('ticket', Ticket)