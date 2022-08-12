const router = require("express").Router();
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const KEY_EXPIRATION = process.env.KEY_EXPIRATION;
const session = require("../middlewares/session");
const { makeModel } = require("../models/ticket_schema");

//  Create a new ticket
router.route("/create").post([session], async (req, res, next) => {
  try {
    console.log(req.body)
    // Only req users and isAdmin asr users can make new tickets
    if (req.user.__type === "asrUser" && !req.user.isAdmin) {
      res.status(403).json({
        status: "Forbidden. Only requestors and admins can create tickets.",
      });
    } else {
      // Create Ticket from most recent paths (including all custom fields)
      const Ticket = makeModel();
      const bodyFields = Object.keys(req.body);
      const newTicket = new Ticket({
        requestor: req.user._id,
      });
      for (field of bodyFields) {
        if (bodyFields.includes(field)) {
          newTicket[field] = req.body[field];
        }
      }
      // Save the newly created ticket
      await newTicket.save();
      res.status(201).json({
        status: "ticket created",
        newTicket,
      });
    }
  } catch (err) {
    // Pass error to error-handling middleware at the bottom
    next(err);
  }
});

// Get all tickets
router.route("/all").get([session], async (req, res, next) => {
  try {
    // Restrict req user non-manager all tickets view to only show tickets created by that req user
    if (req.user.__type === "reqUser" && !req.user.isManager) {
      let allTickets = await Ticket.find({ requestor: req.user._id });
      res.status(200).json({
        allTickets,
      });
    } else {
      let allTickets = await Ticket.find({});
      res.status(200).json({
        allTickets,
      });
    }
  } catch (err) {
    // Pass error to error-handling middleware at the bottom
    next(err);
  }
});

// Get all tickets by the status filters set (passed through as queries in url)
router.route("/status-filter").get([session], async (req, res, next) => {
  const { status } = req.body;
  statusArray = status.split(",");
  try {
    const Ticket = makeModel();
    if (req.user.__type === "reqUser" && statusArray.includes("in-progress")) {
      // For all req users, include "questionaire-sent", "director-review", "on-hold-vendor" statuses when they select "in-progress".
      statusArray.push(
        "questionaire-sent",
        "director-review",
        "on-hold-vendor"
      );
      // Restrict req user non-manager filtered tickets view to only show tickets belonging to that req user
      if (!req.user.isManager) {
        let tickets = await Ticket.find({
          status: { $in: statusArray },
          requestor: req.user._id,
        });
        res.status(200).json({
          tickets,
        });
      } else {
        let tickets = await Ticket.find({ status: { $in: statusArray } });
        res.status(200).json({
          tickets,
        });
      }
    } else {
      // Asr
      let tickets = await Ticket.find({ status: { $in: statusArray } });
      res.status(200).json({
        tickets,
      });
    }
  } catch (err) {
    // Pass error to error-handling middleware at the bottom
    next(err);
  }
});
router.route("/req/model").get((req, res) => {
  const fieldsToSend = [
    "vendorName",
    "projectDescription",
    "department",
    "vendorService",
    "test",
  ];
  const TicketSchema = makeModel();
  const Ticket = TicketSchema.schema.paths;
  let toReturn = [];
  for (tick in Ticket) {
    if (fieldsToSend.includes(tick)) {
      toReturn.push({
        name: tick,
        type: Ticket[tick].instance,
        required: Ticket[tick].isRequired,
      });
    }
  }
  res.send(toReturn);
  //   let response = Ticket.eachPath()
  // res.send(response)
});

// Get one ticket using ticket id as param
router.route("/:id").get([session], async (req, res, next) => {
  try {
    const { id } = req.params;
    const Ticket = makeModel();
    let ticket = await Ticket.find({ _id: id });
    // If a reqUser, limit the fields returned
    if (req.user.__type === "reqUser") {
      ticket = ticket[0];
      console.log(ticket);
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
        assessor,
        attachments,
        questionnaireSent,
        questionnaireRec,
      } = ticket;
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
        assessor,
        attachments,
        questionnaireSent,
        questionnaireRec,
      });
    } else {
      res.status(200).json({
        ticket,
      });
    }
  } catch (err) {
    // Pass error to error-handling middleware at the bottom
    next(err);
  }
});

router.route("/modify/:id").put([session], async (req, res, next) => {
  // Find ticket by document ID passed as parameter
  const { id } = req.params;
  try {
    if (req.user.__type === "reqUser") {
      res.status(403).json({
        status: "Forbidden. Requesters cannot modify tickets.",
      });
    } else {
      const Ticket = makeModel();
      let ticketToModify = await Ticket.findOne({ _id: id });

      // Error if no ticket with that ID found
      if (!ticketToModify) {
        throw new Error("no ticket with that id exists");
      } else {
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

router.route("/delete/:id").post([session], async (req, res, next) => {
  let { id } = req.params;
  try {
    // Only admins can delete tickets
    if (!req.user.isAdmin) {
      res.status(403).json({
        status: "Forbidden. Only admins can delete tickets.",
      });
    } else {
      const Ticket = makeModel();
      let ticketToDelete = await Ticket.findOne({ _id: id });
      // Error if no ticket with that ID found
      if (!ticketToDelete) {
        throw new Error("no ticket with that id exists");
      } else {
        // Delete the ticket by id
        await Ticket.deleteOne({ _id: id });
        res.status(200).json({
          status: `ticket number ${id} was successfully deleted`,
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

// Universal error handler
// Any error thrown above goes through this
router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    status: err.message,
  });
});

module.exports = router;
