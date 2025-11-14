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
    action: "/voice/handle-key",  // pra onde Twilio envia a escolha
    method: "POST"
  });

  gather.say(
    "Olá, bem vindo ao Pathsaala Inn. " +
    "Para falar com a recepção, aperte 1. " +
    "Para informações sobre reservas, aperte 2. " +
    "Para restaurante, aperte 3.",
    { language: "pt-BR" }
  );

  // Se o caller não apertar nada:
  response.redirect("/voice");

  res.type("text/xml");
  res.send(response.toString());
});

// Endpoint que trata o dígito pressionado
app.post("/voice/handle-key", (req, res) => {
  const digit = req.body.Digits;
  const response = new VoiceResponse();

  if (digit === "1") {
    response.say("Você escolheu recepção. Sua ligação será transferida.", { language: "pt-BR" });
    // Aqui você poderia usar <Dial> para algum número real
  } else if (digit === "2") {
    response.say("Você escolheu reservas. Em breve, teremos um atendente.", { language: "pt-BR" });
  } else if (digit === "3") {
    response.say("Você escolheu restaurante. Um atendente irá falar com você.", { language: "pt-BR" });
  } else {
    response.say("Opção inválida. Vamos tentar novamente.", { language: "pt-BR" });
    response.redirect("/voice");
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
