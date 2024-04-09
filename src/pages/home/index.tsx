import React from "react";
import { Content } from "@components/Content";
import { MenuLeft } from "@components/MenuLeft";
import { ContentTasksScheduled } from "./ContentTasksScheduled";
import { ContentTasks } from "./ContentTasks";
import { Header } from "./Header";
import { useSelector } from "react-redux";
import { selectorTasks } from "../../store/reducers/tasks";
import { cn } from "../../lib/utils";

export const Home: React.FC = () => {
  const { data: tasks } = useSelector(selectorTasks);

  const unscheduledTask = tasks.filter((item) => item.time == "");

  return (
    <Content>
      <div
        className={cn(
          "grid grid-cols-[350px_auto] mx-auto w-full h-screen bg-slate2 "
        )}
      >
        <div>
          <MenuLeft />
        </div>

        <div className="relative overflow-auto">
          <div>
            <Header />

            <div
              className={cn(
                unscheduledTask.length > 0 ? "grid grid-cols-[auto_400px]" : ""
              )}
            >
              <ContentTasksScheduled />

              {unscheduledTask.length > 0 && (
                <div className="p-5">
                  <div className="sticky top-[140px]">
                    <ContentTasks />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </Content>
  );
};
