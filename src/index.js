// src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const { twiml: { VoiceResponse } } = require("twilio");

const app = express();
const port = process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded (Twilio envia assim)
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint principal que o Twilio chama
app.post("/voice", (req, res) => {
  const response = new VoiceResponse();

  // Mensagem inicial do IVR
  const gather = response.gather({
    numDigits: 1,
    action: "/twilio/voice/handle-key",
    method: "POST"
  });

  gather.say(
    "Welcome to Pathsaala Inn. " +
    "To speak with the front desk, press 1. " +
    "For hotel hours, press 2. " +
    "For the restaurant, press 3.",
    { language: "en-US" }
  );

  // Se o caller não apertar nada, volta pro menu
  response.redirect("/twilio/voice");

  res.type("text/xml");
  res.send(response.toString());
});

// Endpoint que trata o primeiro dígito pressionado
app.post("/voice/handle-key", (req, res) => {
  const digit = req.body.Digits;
  const response = new VoiceResponse();

  if (digit === "1") {
    // Front desk: fala e transfere a ligação para o número fixo
    response.say(
      "You chose front desk. Your call will be transferred.",
      { language: "en-US" }
    );

    // Faz a chamada para o número 506 425 7494 (formato E.164)
    response.dial("+15064257494");

  } else if (digit === "2") {
    // Submenu de hotel hours
    const gather = response.gather({
      numDigits: 1,
      action: "/twilio/voice/hours",
      method: "POST"
    });

    gather.say(
      "You chose hotel hours. " +
      "For staff hours, press 1. " +
      "For check in and check out hours, press 2.",
      { language: "en-US" }
    );

    // Se não escolher nada, volta pro menu principal
    response.redirect("/twilio/voice");

  } else if (digit === "3") {
    response.say(
      "You chose restaurant. At this season, our restaurant is closed.",
      { language: "en-US" }
    );

  } else {
    response.say("Invalid option. Let’s try again.", { language: "en-US" });
    response.redirect("/twilio/voice");
  }

  res.type("text/xml");
  res.send(response.toString());
});

// Endpoint que trata o submenu de hotel hours
app.post("/voice/hours", (req, res) => {
  const digit = req.body.Digits;
  const response = new VoiceResponse();

  if (digit === "1") {
    // TODO: set your STAFF HOURS here
    response.say(
      "Our staff hours are: ", // <- complete this sentence with your real hours
      { language: "en-US" }
    );

  } else if (digit === "2") {
    // TODO: set your CHECK IN / CHECK OUT HOURS here
    response.say(
      "Our check in and check out hours are: ", // <- complete this sentence with your real hours
      { language: "en-US" }
    );

  } else {
    response.say("Invalid option. Let’s go back to the main menu.", { language: "en-US" });
    response.redirect("/twilio/voice");
  }

  res.type("text/xml");
  res.send(response.toString());
});

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Twilio IVR app listening on port ${port}`);
});
