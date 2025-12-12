const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', async (req, res) => {
  const event = req.body;
  events.push(event);

  // Рассылка события в микросервисы через их имена в Docker Compose
  const services = [
    "http://posts:4000/events",
    "http://comments:4001/events",
    "http://query:4002/events",
    "http://moderation:4003/events",
  ];

  for (let url of services) {
    try {
      await axios.post(url, event);
    } catch (err) {
      console.log(`Error sending to ${url}: ${err.message}`);
    }
  }

  res.send({ status: "OK" });
});

app.get('/events', (req, res) => {
  res.send(events);
});

// Export for tests
module.exports = app;

// Run only if executed directly
if (require.main === module) {
  app.listen(4005, () => {
    console.log("Event bus listening on 4005");
  });
}
