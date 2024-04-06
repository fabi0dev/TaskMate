import { Content } from "@components/Content";
import { Header } from "./Header";
import { SubContent } from "@components/SubContent";
import { FrameTaskColumn } from "./FrameTaskColumn";
import { FrameTask } from "./FrameTask";
import { ContentTasks } from "./ContentTasks";
import { Frames } from "./types";

export const Home = () => {
  const frames: Frames[] = [
    {
      id: "",
      order: 0,
      title: "To Do's (03)",
    },
    {
      id: "",
      order: 0,
      title: "In Progress (01)",
    },
    {
      id: "",
      order: 0,
      title: "Completed (01)",
    },
  ];

  return (
    <Content>
      <SubContent>
        <div className="my-5 text-2xl font-bold">Task Mate</div>
        <Header />

        <FrameTask>
          {frames.map(({ title }, index) => (
            <FrameTaskColumn title={title} key={index}>
              <ContentTasks title="Task Title" />
            </FrameTaskColumn>
          ))}
        </FrameTask>
      </SubContent>
    </Content>
  );
};
