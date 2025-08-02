```
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TICKETS_FILE = './tickets.json';

let tickets = [];
if (fs.existsSync(TICKETS_FILE)) {
  tickets = JSON.parse(fs.readFileSync(TICKETS_FILE));
}

function saveTickets() {
  fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2));
}

app.get('/tickets', (req, res) => {
  res.json(tickets);
});

app.post('/tickets', (req, res) => {
  const { name, picks, win, matched, prize } = req.body;
  if (!name || !picks || !win || matched === undefined || !prize) {
    return res.status(400).json({ error: "Missing fields" });
  }
  tickets.unshift({ name, picks, win, matched, prize, id: Date.now() });
  saveTickets();
  res.json({ message: "Ticket saved" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```