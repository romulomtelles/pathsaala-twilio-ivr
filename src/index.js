// src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const { twiml: { VoiceResponse } } = require("twilio");

const app = express();
const port = process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded (Twilio envia assim)
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint que o Twilio vai chamar
app.post("/voice", (req, res) => {
  const response = new VoiceResponse();

  // Mensagem inicial do IVR
  const gather = response.gather({
    numDigits: 1,
    action: "/twilio/voice/handle-key",  // pra onde Twilio envia a escolha
    method: "POST"
  });

  gather.say(
  "Welcome to Pathsaala Inn. " +
  "To speak with the front desk, press 1. " +
  "For reservation information, press 2. " +
  "For the restaurant, press 3.",
  { language: "en-US" }
  );

  // Se o caller não apertar nada:
  response.redirect("/twilio/voice");

  res.type("text/xml");
  res.send(response.toString());
});

// Endpoint que trata o dígito pressionado
app.post("/voice/handle-key", (req, res) => {
  const digit = req.body.Digits;
  const response = new VoiceResponse();

  if (digit === "1") {
  response.say("You chose front desk. Your call will be transferred.", { language: "en-US" });
} else if (digit === "2") {
  response.say("You chose reservations. An agent will be with you shortly.", { language: "en-US" });
} else if (digit === "3") {
  response.say("You chose restaurant. An agent will be with you shortly.", { language: "en-US" });
} else {
  response.say("Invalid option. Let’s try again.", { language: "en-US" });
  response.redirect("/twilio/voice");
}


  res.type("text/xml");
  res.send(response.toString());
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Twilio IVR app listening on port ${port}`);
});
