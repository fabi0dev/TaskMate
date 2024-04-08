import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectorTasks } from "../../store/reducers/tasks";
import { isSameDay } from "date-fns";
import { Header } from "./Header";
import { Task } from "./Task";

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

  const tasksGroup = tasks
    .filter((item) => isSameDay(item.date, dateCurrent))
    .filter((item) => item.groupId == groupIdCurrent);

  const startHour = 0;
  const endHour = 23;

  const hours: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    hours.push(`${hour.toString()} ${hour < 12 ? "AM" : "PM"}`);
  }

  const currentHourRef = useRef<HTMLDivElement>(null);
  const currentHour = new Date().getHours();

  useEffect(() => {
    if (currentHourRef.current) {
      currentHourRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentHourRef, dateCurrent, groupIdCurrent]);

  let hourFormated = -1;
  let turnHour = " AM";

  return (
    <div className="overflow-auto">
      <Header />
      <div className="p-10 pt-0 w-[90%] mx-auto ">
        <div>
          {hours.map((hour, index) => {
            const tasksAtHour = tasksGroup.filter((task: TaskItem) => {
              if (
                parseInt(task.time.split("~")[0].split(":")[0]) ==
                parseInt(hour)
              ) {
                return task;
              }
            });

            hourFormated++;

            if (hourFormated > 12) {
              hourFormated = 1;
              turnHour = " PM";
            }

            return (
              <div key={index} className="flex flex-col">
                <div
                  ref={currentHour === parseInt(hour) ? currentHourRef : null}
                  data-hour={hour}
                  className={`text-gray-500 mt-3 grid grid-cols-[60px_auto] items-center ${
                    currentHour === parseInt(hour) ? "font-bold" : ""
                  }`}
                >
                  <div>
                    {hourFormated.toString().padStart(2, "0")}
                    {turnHour}
                  </div>
                  {!tasksAtHour.length && (
                    <div className="bg-gray-800 h-[1px] w-full"></div>
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
