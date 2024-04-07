import React from "react";
import { Content } from "@components/Content";
import { MenuLeft } from "@components/MenuLeft";
import { Task } from "./Task";
import { Header } from "./Header";
import { useSelector } from "react-redux";
import { selectorTasks } from "../../store/reducers/tasks";

export const Home: React.FC = () => {
  const { data: tasks } = useSelector(selectorTasks);

  const tasksPending = tasks.filter((item) => item.done);
  const tasksDone = tasks.filter((item) => item.done == false);

  return (
    <Content>
      <div className="grid grid-cols-[350px_auto] mx-auto w-full h-screen">
        <div>
          <MenuLeft />
        </div>

        <div className="bg-slate2 p-10">
          <Header />

          <div className="font-bold text-xl my-5 cursor-pointer">Pendente</div>
          {tasksDone.map((item, index) => (
            <Task data={item} key={index} />
          ))}

          <div className="font-bold text-xl my-5 cursor-pointer">Concluído</div>
          {tasksPending.map((item, index) => (
            <Task data={item} key={index} />
          ))}
        </div>
      </div>
    </Content>
  );
};
