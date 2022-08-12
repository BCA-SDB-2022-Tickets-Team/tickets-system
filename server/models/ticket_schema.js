const mongoose = require('mongoose')
const CustomFieldsSchema =require('./custom_fields_schema')

let Ticket = new mongoose.Schema(
  {
    requestor: {
      type: mongoose.ObjectId,
      required: true,
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
    overallRisk: {
      type: String,
      required: false,
      enum: ['low', 'medium', 'high'],
    },
    businessRisk: {
      type: String,
      required: false,
      enum: ['low', 'medium', 'high']
    },
  },
  {
    timestamps: true,
    collection: "ticket",
    discriminatorKey: "__type"
  }
)


  
let asr = mongoose.Schema({
    assessor: {
      type: mongoose.ObjectId,
      required: false,
    },
    dateCompleted: {
      type: Date,
      required: false,
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
    dueDate: {
      type: Date,
      required: false
    },
    warningDate: {
      type: Date,
      required: false,
    },
    questionnaireRec: {
      type: Date, 
      required: false
    },
    questionnaireSent: {
      type: Date,
      required: false
    },
})

let TicketReq = Ticket.discriminator('ReqTicket', reqRequired)
let TicketAsr = Ticket.discriminator('AsrTicket', asr)


const UpdateSchema = function(field){
  const SchemaFromField = new mongoose.Schema()
  SchemaFromField.path(field.name,field.fieldType)
  Ticket.add(SchemaFromField)
  Ticket.path(field.name).required(field.isRequired ?true:false)
}
async function runAtStartUp(){
  const allCustomFields = await CustomFieldsSchema.find()
  if (allCustomFields.length > 0){
    for(field of allCustomFields){
      UpdateSchema(field)
    }
  }else{return} 
 
} runAtStartUp()

const makeModel = function(){
  return mongoose.model('tickets', TicketReq)
}

module.exports = {UpdateSchema, makeModel}