const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Ticket = require("../models/ticket_schema")
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY
const KEY_EXPIRATION = process.env.KEY_EXPIRATION
const session = require('../middlewares/session');


//  Create a new ticket
router
  .route("/create")
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
      // Pass error to error-handling middleware at the bottom
      next(err);
    }
  }
  )
  
  // Get all tickets
  router
  .route("/all")
  .get([session], async (req, res, next) => { 
    try {
      let allTickets = await Ticket.find({});
      res.status(200).json({
        allTickets,
      });
    } catch(err) {
      // Pass error to error-handling middleware at the bottom
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
      // Pass error to error-handling middleware at the bottom
      next(err);
    }
  })

  // Get one ticket using ticketid as param
  router
  .route("/:id")
  .get([session], async (req, res, next) => { 
    try {
      const { id } = req.params;
      let ticket = await Ticket.find({_id: id});
      res.status(200).json({
        ticket,
      });
    } catch(err) {
      // Pass error to error-handling middleware at the bottom
      next(err);
    }
  })


  router
  .route("/modify/:id")
  .put([session], async (req, res, next) => {
    // Find ticket by document ID passed as parameter
    const { id } = req.params;
    try {
      let ticketToModify = await Ticket.findOne({ _id: id });
      
      // Error if no ticket with that ID found
      if (!ticketToModify) {
        throw new Error("no ticket with that id exists");
      } 
      else {
        // loop through request body and only update fields that exist in the request
        for (field in req.body) {
            ticketToModify[field] = req.body[field];
          }
        }
        // Save updates to ticket document
        await ticketToModify.save();
        res.status(202).json({
          status: "ticket updated",
          ticketToModify,
        });
      
    } catch (err) {
      // Pass error to error-handling middleware at the bottom
      next(err);
    }
  });

  //TODO: Delete ticket
  //TODO: Permission control for editing tickets/fields within tickets & deleting tickets

// Universal error handler
// Any error thrown above goes through this
router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: err.message,
  });
});

module.exports = router