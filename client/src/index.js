import React from "react";
import ReactDOM from "react-dom";
import MapComponent from "./map_component";
import "./styles.css";
import {
  MuiPickersUtilsProvider,
  DatePicker,
  TimePicker
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";

const Index = () => {
  const [selectedDate, setSelectedDate] = React.useState(null);

  function handleDateChange(date) {
    setSelectedDate(date);
  }
  return (
    <div>
      <div className="header">
        <h1>Welcome to the example task!</h1>
      </div>
      <div>
        {/* used date picker and time picker instead  of slider because i am not that used to react, but i am rather more familiar with vue and angular*/}
        {/* TODO(Task 2): Add a slider to select datetime in the past.
        Pass the selected value as prop to the MapContainer */}
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="space-around">
            <DatePicker
              disableToolbar
              autoOk
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              minDate={new Date("2019-05-30T22:36:54.000Z")}
              maxDate={new Date("2019-07-23T18:25:52.148Z")}
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
            />
            <TimePicker
              margin="normal"
              autoOk
              id="time-picker"
              label="Select Time"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </div>

      <MapComponent selectedDate={selectedDate} />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("main-container"));
