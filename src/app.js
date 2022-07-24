const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");
// TODO: Follow instructions in the checkpoint to implement ths API.

app.use(express.json()) //express.json() function is a built-in middleware that adds a body property to the request (req.body). 

app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));

  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    //next(`Paste id not found: ${pasteId}`);
    next({ status: 404, message: `Paste id not found: ${pasteId}` });
  }
});
app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});  // Modified the existing handler for /pastes to handle only GET requests(35.3).

// New middleware function to validate the request body
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next(); // Call `next()` without an error message if the result exists
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", bodyHasTextProperty, (req, res, next) => {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;

  const newPaste = {
    id: ++lastPasteId, // Increment last ID, then assign as the current ID
    name,
    syntax,
    exposure,
    expiration,
    text,
    user_id,
  };
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});


// TODO: return an array of users from /users in form of { data: Array }
// TODO: return a single user by id from /users/:userId in form of { data: Object }

// TODO: return all states from /states in the form of { data: Array }
// TODO: Return a single state from /states/:stateCode in the form of { data: { stateCode: String, name: String } }

// TODO: add not-found handler
// TODO: Add error handler

module.exports = app;
