const mongoose = require('mongoose')
const CustomFieldsSchema =require('./custom_fields_schema')

const FieldsToIgnore = [
  _id,
  __v,
  Department,
  'Requestor',
  createdAt,
  updatedAt,
]

let reqTicket = new mongoose.Schema(
  {
    'Requestor': {
      type: mongoose.ObjectId,
      required: true
    },
    'Vendor Name': {
      type: String,
      required: true
    },
    'Project Description': {
      type: String,
      required: true,
    },
    'Project Manager': {
      type: String,
      required: false
    },
    'Business Contact': {
      type: String,
      default: '',
      required: false
    },
    Department: {
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
    'Data Sensitivy': {
      type: String,
      default: '',
    },
    'Data Description': {
      type: String,
      default: '',
    }, 
    'Data Regulation': {
      type: String,
      required: false,
      default: 'none',
      enum: ['none', 'gxp', 'sox', 'gdpr']
    },
    PHI: {
      type: Boolean,
      required: false,
      default: false
    },
    'Vendor Service': {
      type: String,
      default: '',
      required: false,
    },
    'Custom Code Required': {
      type: Boolean,
      required: false,
      default: false
    },
    'Submitted To Security': {
      type: Date,
      required: false
    },
    Integrations: {
      type: Boolean,
      default: false,
    },
    'System Level Access': {
      type: String,
      default: '',
      required: false,
    },
    Platform: {
      type: String,
      default: '',
      required: false,
    },
    'Data Access': {
      type: String,
      default: '',
      required: false
    },
    'Need MFA': {
      type: Boolean,
      default: false,
      required: false
    },
    Encryption: {
      type: Boolean,
      default: false,
      required: false
    },
    Attachments: {
      type: Number,
      required: false,
      default: 0
    },
  }
)

const asrTicket = new mongoose.Schema({
    Assessor: {
      type: mongoose.ObjectId,
      required: false,
    },
    'Overall Risk': {
      type: String,
      required: false,
      enum: ['low', 'medium', 'high']
    },
    'Business Risk': {
      type: String,
      required: false,
      enum: ['low', 'medium', 'high']
    },
    Status: {
      type: String,
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
    'Date Completed': {
      type: Date,
      required: false,
    },
    'Due Date': {
      type: Date,
      required: false
    },
    'Warning Date': {
      type: Date,
      required: false,
    },
    'Questionnaire Sent': {
      type: Date,
      required: false
    },
    'Questionnaire Received': {
      type: Date, 
      required: false
    },
    Notes: {
      type: String,
      default: '',
    },
    Timeline: {
      type: String,
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
  mergeIntoTicket()
}

async function runAtStartUp(){
  const allCustomFields = await CustomFieldsSchema.find()
  if (allCustomFields.length > 0){
    for(field of allCustomFields){
      UpdateSchema(field)
    }
  }
  mergeIntoTicket()
  return;
} runAtStartUp()

function mergeIntoTicket(){
    Ticket.add(reqTicket)
    Ticket.add(asrTicket)
}

const makeModel = function(){
  return mongoose.model('ticket',Ticket)
}
/**
 * takes the current schema, filters out paths that should not be seen by
 * requestors, and reutnrs an array of strings that can be used to
 * filter Ticket options by keys 
 * @returns [pathNames]
 */
async function getRequiredReqSchema(){
  let requiredPaths = []
  await reqTicket.eachPath((name, type) => {
    //todo: more filtering once we finalize required values
    if (!type.options.required || FieldsToIgnore.includes('name')){
      return null
    } else {
    let pathObject = {
        name,
        type: type.instance,
        required: type.options.required,
      }
    if(type.options.enum){
      console.log(type)
      pathObject['enum'] = type.options.enum
    }
    requiredPaths.push(pathObject)
  }})
  return requiredPaths
  
}

module.exports = {UpdateSchema, makeModel, getRequiredReqSchema}