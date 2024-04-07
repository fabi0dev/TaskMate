import React from "react";
import { Content } from "@components/Content";
import { MenuLeft } from "@components/MenuLeft";
import { Task } from "./Task";
import { Header } from "./Header";
import { useSelector } from "react-redux";
import { selectorTasks } from "../../store/reducers/tasks";
import { isSameDay } from "date-fns";
import { Quote } from "lucide-react";

export const Home: React.FC = () => {
  const {
    data: tasks,
    dateCurrent,
    groupIdCurrent,
  } = useSelector(selectorTasks);

  const tasksGroup = tasks
    .filter((item) => isSameDay(item.date, dateCurrent))
    .filter((item) => item.groupId == groupIdCurrent);

  const tasksPending = tasksGroup.filter((item) => !item.done);
  const tasksDone = tasksGroup.filter((item) => item.done);

  return (
    <Content>
      <div className="grid grid-cols-[350px_auto] mx-auto w-full h-screen">
        <div>
          <MenuLeft />
        </div>

        <div className="bg-slate2 p-10">
          <Header />

          {tasksPending.length > 0 && (
            <div className="font-bold text-xl my-5 cursor-pointer">
              Pendente
            </div>
          )}
          {tasksPending.map((item, index) => (
            <Task data={item} key={index} />
          ))}

          {tasksDone.length > 0 && (
            <div className="font-bold text-xl my-5 cursor-pointer">
              Concluído
            </div>
          )}

          {tasksDone.map((item, index) => (
            <Task data={item} key={index} />
          ))}

          {!tasksGroup.length && (
            <div className="p-5  text-center text-gray-600 font-bold">
              <Quote className="mx-auto my-2" size={25} />
              Nenhuma tarefa para mostrar.
            </div>
          )}
        </div>
      </div>
    </Content>
  );
};
