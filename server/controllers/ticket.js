const router = require("express").Router();
const session = require("../middlewares/session");
const { makeModel, makeAsrModel, getRequiredReqSchema } = require("../models/ticket_schema");

//  Create a new ticket
router
.route("/create")
.post([session], async (req, res, next) => {
  try {
    // Only req users and isAdmin asr users can make new tickets
    if (req.user.__type === "asrUser" && !req.user.isAdmin) {
      res.status(403).json({
        status: "Forbidden. Only requestors and admins can create tickets.",
      });
    } else {
      // Create Ticket from most recent paths (including all custom fields)
      const Ticket = makeModel();
      const bodyFields = Object.keys(req.body.newTicketBody);
      const newTicket = new Ticket({
        Requestor: req.user._id,
        Department: req.user.isAdmin ? "n/a" : req.user.Department
        //TODO: Change this so that if an ASR isAdmin is creating a ticket, they need to choose the department from a drop-down
      });
      for (field of bodyFields) {
        if (bodyFields.includes(field)) {
          newTicket[field] = req.body.newTicketBody[field];
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
router
.route("/all")
.get([session], async (req, res, next) => {
  try {
    const Ticket = makeModel()
    // Restrict req user non-manager all tickets view to only show tickets created by that req user
    if (req.user.__type === "reqUser" && !req.user.isManager) {
      let allTickets = await Ticket.find({ Requestor: req.user._id });
      res.send(
        allTickets.map(ticket => {
          return {
            _id: ticket._id,
            'Created At': ticket.createdAt,
            'Vendor Name': ticket['Vendor Name'],
            'Assessor': !ticket.Assessor ?'Unassigned' : users.find({_id:ticket[Assessor]},{firstName:1, lastName:1}),
            'Updated At': ticket.updatedAt,

          }
        }),
      );
    } else {
      let allTickets = await Ticket.find({});
      res.send(
        allTickets.map(ticket => {
          return {
            _id: ticket._id,
            'Created At': ticket.createdAt,
            'Vendor Name': ticket['Vendor Name'],
            'Assessor': !ticket.Assessor ?'Unassigned' : users.find({_id:ticket[Assessor]},{firstName:1, lastName:1}),
            'Updated At': ticket.updatedAt,

          }
        })
      );
    }
  } catch (err) {
    // Pass error to error-handling middleware at the bottom
    next(err);
  }
});

// Get all tickets by the status filters set (passed through as queries in url)
router
.route("/status-filter")
.get([session], async (req, res, next) => {
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
          Status: { $in: statusArray },
          Requestor: req.user._id,
        });
        res.status(200).json({
          tickets,
        });
      } else {
        let tickets = await Ticket.find({ Status: { $in: statusArray } });
        res.status(200).json({
          tickets,
        });
      }
    } else {
      // Asr
      let tickets = await Ticket.find({ Status: { $in: statusArray } });
      res.status(200).json({
        tickets,
      });
    }
  } catch (err) {
    // Pass error to error-handling middleware at the bottom
    next(err);
  }
});

router
.route("/req/model")
.get([session], async (req, res) => {
  const TicketSchema = makeModel();
  const fieldsToSend = await getRequiredReqSchema()
  res.json(fieldsToSend);
});


// Get one ticket using ticket id as param
router
.route("/:id")
.get([session], async (req, res, next) => {
  try {
    const { id } = req.params;
    const Ticket = makeModel();
    // If a reqUser, limit the fields returned
    if (req.user.__type === "reqUser") {
      let ticket = await Ticket.findOne({ _id: id }, [...getRequiredReqSchema(), createdAt, updatedAt]);      
      res.status(200).json();
    } else {
      let ticket = await Ticket.findOne({ _id: id });
      res.send(
        ticket
      )
    }
  } catch (err) {
    // Pass error to error-handling middleware at the bottom
    next(err);
  }
});

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
      const Ticket = makeModel();
      let ticketToModify = await Ticket.findOne({ _id: id});
      // console.log(ticketToModify)
      // Error if no ticket with that ID found
      if (!ticketToModify) {
        throw new Error("no ticket with that id exists");
      } else {
        // loop through request body and only update fields that exist in the request
        const AsrTicket = makeAsrModel()

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
.route("/delete/:id")
.post([session], async (req, res, next) => {
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
