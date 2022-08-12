const mongoose = require('mongoose')
const CustomFieldsSchema =require('./custom_fields_schema')

let reqTicket = new mongoose.Schema(
  {
    requestor: {
      type: mongoose.ObjectId,
      required: true
    },
    vendorName: {
      type: String,
      required: true
    },
    projectDescription: {
      type: String,
      required: false,
    },
    projectManager: {
      type: String,
      default: '',
      required: false
    },
    buisnessContact: {
      type: String,
      default: '',
      required: false
    },
    department: {
      type: String,
      default: '',
      required: false,
      enum: [
        '',
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
      default: '',
      required: false,
    },
    dataDescription: {
      type: String,
      default: '',
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
      default: '',
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
      default: '',
      required: false,
    },
    platform: {
      type: String,
      default: '',
      required: false,
    },
    dataAccess: {
      type: String,
      default: '',
      required: false
    },
    needMFA: {
      type: Boolean,
      default: false,
      required: false
    },
    encryption: {
      type: Boolean,
      default: false,
      required: false
    },
    attachments: {
      type: Number,
      required: false,
      default: 0
    },
  }
)

const asrTicket = new mongoose.Schema({
    assessor: {
      type: mongoose.ObjectId,
      required: false,
    },
    overallRisk: {
      type: String,
      required: false,
      default: '',
      enum: ['', 'low', 'medium', 'high']
    },
    businessRisk: {
      type: String,
      required: false,
      default: '',
      enum: ['', 'low', 'medium', 'high']
    },
    status: {
      type: String,
      required: false,
      default: 'new-request',
      enum: [
              'new-request', 
              'questionaire-sent', 
              'requestor-review',
              'director-review',
              'on-hold-vendor',
              'in-progress',
              'completed'  
            ]
    },
    dateCompleted: {
      type: Date,
      required: false,
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
    },
    notes: {
      type: String,
      default: '',
      required: false
    },
    timeline: {
      type: String,
      required: false,
      default: 'standard',
      enum: ['standard', 'expedite']
    },
})

let Ticket = new mongoose.Schema()

const UpdateSchema = function(field){
  const SchemaFromField = new mongoose.Schema()
  SchemaFromField.path(field.name,field.fieldType)
  let schemaToAddTo = field.reqOrAsr === "req" ? reqTicket : asrTicket
  schemaToAddTo.add(SchemaFromField)
  schemaToAddTo.path(field.name).required(field.isRequired ? true:false)
}

async function runAtStartUp(){
  const allCustomFields = await CustomFieldsSchema.find()
  if (allCustomFields.length > 0){
    for(field of allCustomFields){
      UpdateSchema(field)
    }
  }
  Ticket.add(reqTicket)
  Ticket.add(asrTicket)
  return;
} runAtStartUp()

const makeModel = function(){
  return mongoose.model('ticket',Ticket)
}

const makeAsrModel = function() {
  console.log(mongoose.modelNames())
  let ticketModel = makeModel()
  return ticketModel.discriminator('asrTicket', asrTicket)
}

module.exports = {UpdateSchema, makeModel, makeAsrModel}