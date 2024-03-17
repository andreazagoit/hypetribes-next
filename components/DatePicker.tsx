"use client";
import moment from "moment";
import React, { useState } from "react";

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    const newDate = moment(event.target.value).utc().format();
    console.log(newDate);
    setSelectedDate(newDate);
  };

  return (
    <div>
      <label htmlFor="datePicker">Select a Date:</label>
      <input
        type="datetime-local"
        id="datePicker"
        value={selectedDate}
        onChange={handleDateChange}
      />
      {selectedDate && <p>Selected Date: {selectedDate}</p>}
    </div>
  );
};

export default DatePicker;
