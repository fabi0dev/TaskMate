import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectorTasks } from "../../store/reducers/tasks";
import { isSameDay } from "date-fns";
import { Task } from "./Task";
import { cn } from "../../lib/utils";

interface TaskItem {
  id: number;
  title: string;
  time: string;
  done: boolean;
  groupId: number;
  date: Date;
}

export const ContentTasksScheduled: React.FC = () => {
  const {
    data: tasks,
    dateCurrent,
    groupIdCurrent,
  } = useSelector(selectorTasks);

  let tasksGroup = tasks.filter((item) => isSameDay(item.date, dateCurrent));
  if (groupIdCurrent != 0) {
    tasksGroup = tasksGroup.filter((item) => item.groupId == groupIdCurrent);
  }

  const startHour = 0;
  const endHour = 23;

  const hours: number[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    hours.push(hour);
  }

  const currentHourRef = useRef<HTMLDivElement>(null);
  const currentHour = new Date().getHours();

  useEffect(() => {
    if (currentHourRef.current) {
      currentHourRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentHourRef, dateCurrent, groupIdCurrent]);

  return (
    <div>
      <div className="p-10 pt-0 w-[90%] mx-auto ">
        <div className="my-4 font-semibold">Horários de tarefas</div>

        <div>
          {hours.map((hour, index) => {
            const tasksAtHour = tasksGroup.filter((task: TaskItem) => {
              if (parseInt(task.time.split("~")[0].split(":")[0]) == hour) {
                return task;
              }
            });

            return (
              <div key={index} className="flex flex-col">
                <div
                  ref={currentHour === hour ? currentHourRef : null}
                  data-hour={hour}
                  className={`text-gray-500 mt-3 grid grid-cols-[60px_auto] items-center ${
                    currentHour === hour ? " text-emerald-800" : ""
                  }`}
                >
                  <div>{hour}h00</div>
                  {!tasksAtHour.length && (
                    <div
                      className={cn(
                        "bg-gray-800 h-[1px] w-full",
                        currentHour === hour ? " bg-emerald-800" : ""
                      )}
                    ></div>
                  )}
                </div>
                {tasksAtHour.map((task, index) => (
                  <Task key={index} data={task} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
