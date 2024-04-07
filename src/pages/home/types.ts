export interface Frames {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Task {
  id: string;
  description: string;
  done: boolean;
}
