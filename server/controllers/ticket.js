const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Ticket = require("../models/ticket_schema")
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY
const KEY_EXPIRATION = process.env.KEY_EXPIRATION
const session = require('../middlewares/session');


//  Create a new ticket
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
  
  // Get all tickets
  router
  .route("/all-tickets")
  .get([session], async (req, res, next) => { 
    try {
      let allTickets = await Ticket.find({});
      res.status(200).json({
        allTickets,
      });
    } catch(err) {
      next(err);
    }
  })

  // Get all tickets by the status filters set (passed through as queries in url)
    router
    .route("/status-filter")
    .get([session], async (req, res, next) => { 
      try {
        let statuses = req.query.status
        let newRequestTickets = await Ticket.find({status: { $in: statuses}});
        res.status(200).json({
          newRequestTickets,
        });
      } catch(err) {
        next(err);
      }
    })

  // Get one ticket using ticketid as query in url
  router
  .route("/")
  .get([session], async (req, res) => { 
    try {
      const ticketid = req.query.ticketid;
      let ticket = await Ticket.find({_id: ticketid});
      res.status(200).json({
        ticket,
      });
    } catch(err) {
      next(err);
    }
  })


/* router
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
}) */

module.exports = router