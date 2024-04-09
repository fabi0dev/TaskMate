import React from "react";
import { useSelector } from "react-redux";
import { selectorTasks } from "../../store/reducers/tasks";
import { Task } from "./Task";

export const ContentTasks: React.FC = () => {
  const { data: tasks, groupIdCurrent } = useSelector(selectorTasks);

  let tasksGroup = tasks.filter((item) => item.time == "");

  if (groupIdCurrent != 0) {
    tasksGroup = tasksGroup.filter((item) => item.groupId == groupIdCurrent);
  }

  return (
    <div className="sticky top-0 ">
      <div className="mb-4 font-semibold">Sem horário</div>

      <div>
        {tasksGroup.map((task, index) => (
          <Task key={index} data={task} />
        ))}

        {!tasksGroup.length && <div className="text-gray-600">Nenhuma</div>}
      </div>
    </div>
  );
};
