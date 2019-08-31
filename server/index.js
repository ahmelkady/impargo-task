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
  res.send({});
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));

//split the data based on odometer, when the odometer stays the same for a number of consecutive readings
function getSplitData(Data,thresholdLimit) {
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
