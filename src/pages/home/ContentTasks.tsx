import { FC } from "react";

interface ContentTasksProps {
  title: string;
}

export const ContentTasks: FC<ContentTasksProps> = ({ title }) => {
  return (
    <div className="border bg-white rounded-sm shadow-lg p-5">
      <h2 className="text-lg  mb-2">{title}</h2>
    </div>
  );
};
