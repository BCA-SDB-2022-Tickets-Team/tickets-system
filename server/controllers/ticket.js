const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Ticket = require("../models/tickets_data_schema.js")
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY
const KEY_EXPIRATION = process.env.KEY_EXPIRATION
const session = require('../middlewares/session')

router
  .route("/create-ticket")
  .post([session], async (req, res, next) => {
 const { requestor, vendorName, overallRisk, businessRisk, status,dateCompleted,projectDescription,projectManager,businessContact,department,data,vendorService,
    customCodeRequired,submittedToSecurity,integrations,systemLevelAccess,platform,dataAccess,needMFA,encryption,assesor,notes,timeline,attachments,dueDate,warningDate,
questionnaireRec,timestamps } = req.body;
    try {
      if (
          !department || 
          !vendorName|| 
          !projectDescription||
          !data|| 
          !dataAccess ||
          !timeline 
        ) {
        throw new Error("Insufficient data");
      } else {
        const newTicket = new Ticket({requestor, vendorName, overallRisk, businessRisk, status,dateCompleted,projectDescription,projectManager,businessContact,department,data,vendorService,
            customCodeRequired,submittedToSecurity,integrations,systemLevelAccess,platform,dataAccess,needMFA,encryption,assesor,notes,timeline,attachments,dueDate,warningDate,
        questionnaireRec,timestamps
        
        });
        try {
          await newTicket.save();
          res.status(201).json({
            status: "ticket created",
            newTicket,
          });
        } catch (error) {
          const missingData = Object.keys(error.errors)
          throw new Error(`you are missing the following data: ${[...missingData]}`)
        }
    }
    } catch (err) {
      next(err);
    }
  }
  )
  .route("/modify-ticket")
  .put([session], async (req, res, next) => {
 const { ticketID } = req.body;
try {
  let ticketModify = await Ticket.findOne({ ticketID: ticketID });
  if (!ticketModify){
    throw new Error("no ticket with ID exists");
  } else {
    for (field in req.body){
      ticketModify[field] = req.body[field];
    }
      try {
        await ticketModify.save();
        res.status(202).json({
          status: "ticket modified",
          ticketModify,
        });
      } catch (error) {
        const missingData = Object.keys(error.errors)
        throw new Error(`ticket could not be updated because: you are missing the following data: ${[...missingData]}`)
      }
    }
  } catch (err) {
    next(err);
  }
})




module.exports = router