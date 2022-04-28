import React from "react";

import IcomoonReact from "icomoon-react";
import iconSet from "./selection.json";

const Icon: React.FC<{
  color?: string;
  size?: string | number;
  icon: string;
  className?: string;
}> = (props) => {
  const { color, size = 24, ...prosp } = props;
  return (
    <IcomoonReact iconSet={iconSet} color={color} size={size} {...props} />
  );
};

export default Icon;
