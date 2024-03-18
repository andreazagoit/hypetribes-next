import ItemCard from "@/app/CardItem";
import moment from "moment";
import React from "react";

interface IProps {
  timelineElement: TimelineElement;
}

const TimelineSection = ({ timelineElement }: IProps) => {
  return (
    <div key={timelineElement.id}>
      <h2 className="text-2xl font-bold mb-4">
        {moment(timelineElement.date).format("YYYY-MM-DD")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {timelineElement.items.map((item) => (
          <ItemCard key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
};

export default TimelineSection;
