import React from "react";
import { Content } from "@components/Content";
import { MenuLeft } from "@components/MenuLeft";
import { ContentTasksScheduled } from "./ContentTasksScheduled";
import { ContentTasks } from "./ContentTasks";
import { Header } from "./Header";

export const Home: React.FC = () => {
  return (
    <Content>
      <div className="grid grid-cols-[350px_auto] mx-auto w-full h-screen bg-slate2 ">
        <div>
          <MenuLeft />
        </div>

        <div className="relative overflow-auto">
          <div>
            <Header />

            <div className="grid grid-cols-[auto_400px]">
              <ContentTasksScheduled />

              <div className="p-5">
                <div className="sticky top-[140px]">
                  <ContentTasks />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div></div>
      </div>
    </Content>
  );
};
