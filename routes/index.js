var express = require("express");
var router = express.Router();
const cors = require("cors");
const User = require("../db/userModel");

// Middleware to handle CORS request
router.use(cors()); // Użyj cors jako middleware do obsługi żądań CORS

// Middleware to handle frontend on port 3001
const corsOptions = {
  origin: "https://webwatchtower.onrender.com",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
router.use(cors(corsOptions)); // Dodaj middleware do routera

// Zmienna do przechowywania ostatnich timestampów dla użytkowników
const lastRequestTimestamps = new Map();
router.post("/userData", async (req, res) => {
  const userId = req.body.userId;
  // Sprawdź, czy użytkownik już istnieje w mapie lastRequestTimestamps
  if (lastRequestTimestamps.has(userId)) {
    const lastTimestamp = lastRequestTimestamps.get(userId);
    const currentTimestamp = Date.now();
    const timePassed = currentTimestamp - lastTimestamp;

    // Jeśli upłynęło mniej niż 10 minut (600 000 milisekund), odrzuć żądanie
    if (timePassed < 600000) {
      return res.status(429).json({ error: "Zbyt częste żądania POST." });
    }
  }
  // Zapisz obecny timestamp jako ostatni dla tego użytkownika
  lastRequestTimestamps.set(userId, Date.now());

  const receivedData = req.body;
  console.log("Otrzymane dane:", receivedData);

  // Zapisz dane w bazie danych
  const newUser = new User({
    location: req.body.location,
    date: req.body.date,
    deviceType: req.body.deviceType,
  });
  await newUser.save();
  res.send("Dane zostały odebrane i zapisane w bazie danych.");
});

router.get("/usersData", async (req, res) => {
  try {
    const allUsersData = await User.find();
    const usersDataToSend = allUsersData.map((userData) => ({
      location: userData.location,
      date: userData.date,
      deviceType: userData.deviceType,
    }));
    res.json(usersDataToSend);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
