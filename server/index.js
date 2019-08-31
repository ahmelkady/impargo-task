const express = require("express");
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const exampleData = require("../data/tracking.json");
const exampleDataSplit = getSplitData(exampleData, 5);

app.get("/", (req, res) => {
  res.send(exampleDataSplit);
});

app.get("/location/:when", (req, res) => {
  // TODO(Task 2): Return the tracking data closest to `req.params.when` from `exampleData`.
  if (req.params.when != "null") {
    let time = new Date(req.params.when).getTime();
    let selectedTrip = getTrip(exampleDataSplit, time);
    let closest = getClosest(selectedTrip, time);
    return res.send({ selectedTrip: selectedTrip, closest: closest });
  } else {
    res.status(404).send({});
  }
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));

//split the data based on odometer, when the odometer stays the same for a number of consecutive readings
function getSplitData(Data, thresholdLimit) {
  let DataSplit = [];
  let split = [];
  let threshold = 0;
  let odometer = -1;
  let newPeriod = false;
  for (var data of Data) {
    if (data.odometer != odometer) {
      threshold = 0;
      if (!newPeriod) {
        split.push(data);
        odometer = data.odometer;
      } else {
        DataSplit.push(split);
        split = [];
        newPeriod = false;
      }
    } else {
      split.push(data);
      if (threshold < thresholdLimit) {
        threshold++;
      } else {
        newPeriod = true;
      }
    }
  }
  DataSplit.push(split);
  return DataSplit;
}

function getTrip(data, time) {
  for (var trip of data) {
    if (
      new Date(trip[trip.length - 1].time).getTime() <= time &&
      time <= new Date(trip[0].time).getTime()
    )
      return trip;
  }
  return null;
}

function getClosest(trip, time) {
  var diff = Infinity;
  let closest = null;
  if (trip) {
    for (item of trip) {
      if (Math.abs(new Date(item.time).getTime() - time) < diff) {
        closest = item;
        diff = Math.abs(new Date(closest.time).getTime() - time);
      } else {
        break;
      }
    }
  }
  return closest;
}
