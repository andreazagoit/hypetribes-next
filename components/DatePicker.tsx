"use client";
import React, { useState } from "react";

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div>
      <label htmlFor="datePicker">Select a Date:</label>
      <input
        type="date"
        id="datePicker"
        value={selectedDate}
        onChange={handleDateChange}
      />
      {selectedDate && <p>Selected Date: {selectedDate}</p>}
    </div>
  );
};

export default DatePicker;
