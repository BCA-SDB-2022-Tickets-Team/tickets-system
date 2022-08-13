const mongoose = require("mongoose");
const CustomFieldsSchema = require("./custom_fields_schema");

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
      required: false,
    },
    vendorName: {
      type: String,
      required: true,
    },
    overallRisk: {
      type: String,
      required: false,
      default: "",
      enum: ["", "low", "medium", "high"],
    },
    businessRisk: {
      type: String,
      required: false,
      default: "",
      enum: ["", "low", "medium", "high"],
    },
    status: {
      type: String,
      required: false,
      default: "new-request",
      enum: [
        "new-request",
        "questionaire-sent",
        "requestor-review",
        "director-review",
        "on-hold-vendor",
        "in-progress",
        "completed",
      ],
    },
    dateCompleted: {
      type: Date,
      required: false,
    },
    projectDescription: {
      type: String,
      required: true,
    },
    projectManager: {
      type: String,
      default: "",
      required: false,
    },
    buisnessContact: {
      type: String,
      default: "",
      required: false,
    },
    department: {
      type: String,
      default: "",
      required: true,
      enum: [
        "",
        "hr",
        "it",
        "legal",
        "manufacturing",
        "marketing",
        "ops",
        "procurement",
      ],
    },
    dataSensitivity: {
      type: String,
      default: "",
      required: false,
    },
    dataDescription: {
      type: String,
      default: "",
      required: false,
    },
    dataRegulation: {
      type: String,
      required: false,
      default: "none",
      enum: ["none", "gxp", "sox", "gdpr"],
    },
    phi: {
      type: Boolean,
      required: false,
      default: false,
    },
    vendorService: {
      type: String,
      default: "",
      required: false,
    },
    customCodeRequired: {
      type: Boolean,
      required: false,
      default: false,
    },
    submittedToSecurity: {
      type: Date,
      required: false,
    },
    integrations: {
      type: Boolean,
      default: false,
    },
    systemLevelAccess: {
      type: String,
      default: "",
      required: false,
    },
    platform: {
      type: String,
      default: "",
      required: false,
    },
    dataAccess: {
      type: String,
      default: "",
      required: false,
    },
    needMFA: {
      type: Boolean,
      default: false,
      required: false,
    },
    encryption: {
      type: Boolean,
      default: false,
      required: false,
    },
    assessor: {
      type: mongoose.ObjectId,
      required: false,
    },
    notes: {
      type: String,
      default: "",
      required: false,
    },
    timeline: {
      type: String,
      required: false,
      default: "standard",
      enum: ["standard", "expedite"],
    },
    attachments: {
      type: Number,
      required: false,
      default: 0,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    warningDate: {
      type: Date,
      required: false,
    },
    questionnaireSent: {
      type: Date,
      required: false,
    },
    questionnaireRec: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);
const UpdateSchema = function (field) {
  const SchemaFromField = new mongoose.Schema();
  SchemaFromField.path(field.name, field.fieldType);
  Ticket.add(SchemaFromField);
  Ticket.path(field.name).required(field.isRequired ? true : false);
};
async function runAtStartUp() {
  const allCustomFields = await CustomFieldsSchema.find();
  if (allCustomFields.length > 0) {
    for (field of allCustomFields) {
      UpdateSchema(field);
    }
  } else {
    return;
  }
}
runAtStartUp();
const makeModel = function () {
  return mongoose.model("ticket", Ticket);
};

module.exports = { UpdateSchema, makeModel };
