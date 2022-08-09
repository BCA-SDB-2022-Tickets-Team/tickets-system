const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Ticket = require("../models/ticket_schema")
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY
const KEY_EXPIRATION = process.env.KEY_EXPIRATION
const session = require('../middlewares/session');

//TODO: Add more error handling? & Revisit status-filter route to try to simplify code that handles query as string vs query as array-like object.

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
  })
  
  // Get all tickets
  router
  .route("/all")
  .get([session], async (req, res, next) => { 
    try {
      // Restrict reqUser non-manager all tickets view to only be within their department
      if (req.user.__type === "reqUser" && !req.user.isManager) {
        let allTickets = await Ticket.find({requestor: req.user._id});
        res.status(200).json({
          allTickets,
        });
      } else {
        let allTickets = await Ticket.find({});
        res.status(200).json({
          allTickets,
        });
      }
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
      // If more than one status selected, statuses is an array-like object.
      if (typeof statuses !== "string") {
        if (req.user.__type === "reqUser" && statuses.includes("in-progress")) {
          // For req users, include "questionaire-sent", "director-review", "on-hold-vendor" statuses when they select "in-progress".
          statuses.push("questionaire-sent", "director-review", "on-hold-vendor")
          // Restrict req user non-manager filtered tickets view to only be within their department
          if (!req.user.isManager) {
            let tickets = await Ticket.find({status: { $in: statuses}, requestor: req.user._id});
            res.status(200).json({
            tickets,
          });
          } else {
            let tickets = await Ticket.find({status: { $in: statuses}});
            res.status(200).json({
            tickets,
          });
          }
        } else {
          let tickets = await Ticket.find({status: { $in: statuses}});
          res.status(200).json({
          tickets,
        });
        }   
      // If only one status selected, statuses is a string instead of an array-like object, so need to convert to an array first so can add additional statuses for reqUsers
      } else {
        let statusArray = [];
        statusArray.push(statuses)
          if (req.user.__type === "reqUser" && statusArray.includes("in-progress")) {
            // For req users, include "questionaire-sent", "director-review", "on-hold-vendor" statuses when they select "in-progress".
            statusArray.push("questionaire-sent", "director-review", "on-hold-vendor")
            // Restrict req user non-manager filtered tickets view to only be within their department
            if (!req.user.isManager) {
              let tickets = await Ticket.find({status: { $in: statusArray}, requestor: req.user._id});
              res.status(200).json({
              tickets,
              });
            } else {
              let tickets = await Ticket.find({status: { $in: statusArray}});
              res.status(200).json({
              tickets,
              });
            }
          } else {
            let tickets = await Ticket.find({status: { $in: statusArray}});
            res.status(200).json({
            tickets,
          });
          }      
      }
    } catch(err) {
      // Pass error to error-handling middleware at the bottom
      next(err);
    }
  })

  // Get one ticket using ticket id as param
  router
  .route("/:id")
  .get([session], async (req, res, next) => { 
    try {
      const { id } = req.params;
      let ticket = await Ticket.find({_id: id});
      // If a reqUser, limit the fields returned
      if (req.user.__type === "reqUser") {
        ticket = ticket[0]
        console.log(ticket)
        let { 
          requestor,
          vendorName,
          overallRisk,
          businessRisk,
          status,
          dateCompleted,
          projectDescription,
          projectManager,
          buisnessContact,
          department,
          dataSensitivity,
          dataDescription,
          dataRegulation,
          phi,
          vendorService,
          customCodeRequired,
          integrations,
          systemLevelAccess,
          platform,
          dataAccess,
          needMFA,
          encryption,
          timeline,
          dueDate,
          warningDate
         } = ticket
        res.status(200).json({
          requestor,
          vendorName,
          overallRisk,
          businessRisk,
          status,
          dateCompleted,
          projectDescription,
          projectManager,
          buisnessContact,
          department,
          dataSensitivity,
          dataDescription,
          dataRegulation,
          phi,
          vendorService,
          customCodeRequired,
          integrations,
          systemLevelAccess,
          platform,
          dataAccess,
          needMFA,
          encryption,
          timeline,
          dueDate,
          warningDate
        });
      } else {
      res.status(200).json({
        ticket,
      });
      }
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
      if (req.user.__type === "reqUser") {
        res.status(403).json({
          status: "Forbidden. Requesters cannot modify tickets.",
        });
      } else {
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
      }
    } catch (err) {
      // Pass error to error-handling middleware at the bottom
      next(err);
    }
  });

  router
  .route('/delete/:id')
  .post([session], async (req, res, next) => {
    let { id } = req.params
    try {
      // Only admins can delete tickets
      if (!req.user.isAdmin) {
        res.status(403).json({
          status: "Forbidden. Only admins can delete tickets.",
        });
      } else {
          let ticketToDelete = await Ticket.findOne({ _id: id })
          // Error if no ticket with that ID found
          if (!ticketToDelete) {
            throw new Error("no ticket with that id exists");
          } else {
            // Delete the ticket by id
            await Ticket.deleteOne({ _id: id })
            res.redirect('/') //! This results in message: Cannot GET '/' but removing causes it to hang
          }
      } 
    } catch(err) {
      next(err);
    }
  })

// Universal error handler
// Any error thrown above goes through this
router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: err.message,
  });
});

module.exports = router