const express = require("express");
const app = express();


const usersRouter = require("./users/users.router");
const pastesRouter = require("./pastes/pastes.router");
//const pastes = require("./data/pastes-data");


app.use(express.json()) //express.json() function is a built-in middleware that adds a body property to the request (req.body). 

/* Added this as a function to pastes.controller.js
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
*/
app.use("/users", usersRouter);
app.use("/pastes", pastesRouter); // Note: app.use
/*
app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});  // Modified the existing handler for /pastes to handle only GET requests(35.3).
*/




// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
});


module.exports = app;
