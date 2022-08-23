const router = require("express").Router();
const session = require("../middlewares/session");
const { makeModel, getAsrSchema, getRequiredReqSchema } = require("../models/ticket_schema");
const idcounter = require("../models/idcounter")
const { User } = require("../models/base-user");


//  Create a new ticket
router
.route("/create")
.post([session], async (req, res, next) => {
  try {
    
      // Create Ticket from most recent paths (including all custom fields)
      const Ticket = makeModel();
      
      // Incrememnet the Ticket ID
      let newID = await idcounter.findOneAndUpdate(
        { _id: "62fd54304a734f7a798a3708" }, 
        {$inc: { COUNT: 1 }}, 
        {
        new: true,
        upsert: true
      });

      console.log(newID)

      const bodyFields = Object.keys(req.body.newTicketBody);
      let tickerManager
      if(req.user.manager){
        tickerManager = req.user.manager
      } else if (req.user.isManager) {
        tickerManager = req.user._id
      } else {
        tickerManager = 'n/a'
      }
      
      const newTicket = new Ticket({
        Requestor: req.user._id,
        Department: req.user.__type==='asrUser' ? "n/a" : req.user.Department,
        'Project Manager': tickerManager,
        ID: newID.COUNT
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
   catch (err) {
    // Pass error to error-handling middleware at the bottom
    next(err);
  }
});

// Get all tickets
router
.route("/all")
.get([session], async (req, res, next) => {
  try {
    // Restrict req user non-manager all tickets view to only show tickets created by that req user
    if (req.user.__type === "reqUser" && !req.user.isManager) {
      const Ticket = makeModel()
      let allTicketsData = await Ticket.find({ Requestor: req.user._id });
      let allUsers = await User.find({_id: req.user._id});
      res.json({
        allTicketsData,
        allUsers
      });
    } else {
      const Ticket = makeModel()
      let allTicketsData = await Ticket.find({});
      let allUsers = await User.find({});
      res.json({
        allTicketsData,
        allUsers
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
  // console.log(fieldsToSend)
  res.json(fieldsToSend);
});

router
.route("/asr/model")
.get([session], async (req, res)=>{
const allFields = await getAsrSchema()
  res.json(allFields)
})

// Get one ticket using ticket id as param


router
.route("/modify/:id")
.put([session], async (req, res, next) => {
  // Find ticket by document ID passed as parameter
  const { id } = req.params;
  console.log(req.body)
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
.delete([session], async (req, res, next) => {
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

router
.route("/:id")
.get([session], async (req, res, next) => {
  try {
    const { id } = req.params;
    const Ticket = makeModel();
    // If a reqUser, limit the fields returned
    if (req.user.__type === "reqUser") {
      let ticket = await Ticket.findById(id, {
        // Remove fields Reqs should not see
        _id:0,
        __v:0,
        'Date Completed':0,
        'Due Date':0,
        'Warning Date':0,
        Notes:0,
        Timeline:0
      })
      //TODO: change Requestor & Assessor to be names instead of object IDs
      res.send(
        ticket,
        
      )
    } else {
      let ticket = await Ticket.findById(id, {__v:0}); // Remove unnecessary fields
      //TODO: change Requestor & Assessor to be names instead of object IDs
      res.send(
        ticket
      )
    }
  } catch (err) {
    // Pass error to error-handling middleware at the bottom
    next(err);
  }
});

// Universal error handler
// Any error thrown above goes through this
router.use((err, req, res, next) => {
  if(err._message){
    let missingFields = []
    for(let [name, val] of Object.entries(err.errors)){
      missingFields.push(name)
    }
    let errObj = {
      status: `${err._message}, you are missing the following fields: `,
      missingFields
    }
    res.status(500).json(errObj)
  } else {
    res.status(500).json({
      status: err.message,
    });
  }
});

module.exports = router;
