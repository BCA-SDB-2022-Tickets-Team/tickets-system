const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Ticket = require("../models/ticket_schema")
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY
const KEY_EXPIRATION = process.env.KEY_EXPIRATION
const session = require('../middlewares/session')

router
  .route("/create-ticket")
  .post([session], async (req, res, next) => {
    const { 
      requestor, 
      vendorName, 
      projectDescription, 
      projectManager, 
      department,
      timeline 
    } = req.body;
    try {
      if (
          !department || 
          !vendorName || 
          !projectDescription ||
          !timeline 
        ) {
        throw new Error("Insufficient data");
      } else {
        const newTicket = new Ticket({
          requestor: req.user._id, 
          vendorName,
          projectDescription,
          projectManager: req.user.manager,
          department,
          timeline
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

router
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

//TODO: bring in error handling middleware? Or possibly spin that off into it's own middleware file and add it to server.js?

module.exports = router