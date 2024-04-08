import React from "react";
import { Content } from "@components/Content";
import { MenuLeft } from "@components/MenuLeft";
import { ContentTasksScheduled } from "./ContentTasksScheduled";

export const Home: React.FC = () => {
  return (
    <Content>
      <div className="grid grid-cols-[350px_auto] mx-auto w-full h-screen bg-slate2 ">
        <div>
          <MenuLeft />
        </div>

        <ContentTasksScheduled />

        <div></div>
      </div>
    </Content>
  );
};
