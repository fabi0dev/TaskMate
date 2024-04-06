import React, { FC, ReactNode } from "react";

interface FrameTaskProps {
  children: ReactNode;
}

export const FrameTask: FC<FrameTaskProps> = ({ children }) => {
  return (
    <div className=" mt-10 flex flex-row gap-7">
      {React.Children.map(children, (child) => (
        <div className="flex-grow">{child}</div>
      ))}
    </div>
  );
};
