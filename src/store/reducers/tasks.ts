import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Task {
  id: string;
  title: string;
  time: string;
  done: boolean;
}

interface TasksProps {
  data: Task[];
}

const initialState: TasksProps = {
  data: [
    {
      id: "1",
      title: "Fazer faxina",
      time: "9:30 ~ 9:45",
      done: false,
    },
    { id: "2", title: "Fazer Almoço", done: false, time: "10:30 ~ 12:00" },
    { id: "3", title: "Fazer Janta", done: true, time: "17:30 ~ 18:30" },
  ],
};

export const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setNewTask: (state, action: PayloadAction<Task>) => {
      state.data.push(action.payload);
    },
    markTaskAsDone: (state, action: PayloadAction<string>) => {
      const task = state.data.find((task) => task.id === action.payload);
      if (task) {
        task.done = !task.done;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((task) => task.id !== action.payload);
    },
    editTask: (state, action: PayloadAction<Task>) => {
      const index = state.data.findIndex(
        (task) => task.id === action.payload.id
      );

      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
  },
});

export const { setNewTask, markTaskAsDone, deleteTask, editTask } =
  slice.actions;
export default slice.reducer;
export const selectorTasks = (state: { tasks: TasksProps }): TasksProps =>
  state.tasks;
