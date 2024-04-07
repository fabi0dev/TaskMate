import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITask {
  id: number;
  title: string;
  time: string;
  done: boolean;
  groupId: number;
  date: Date;
}

interface TasksProps {
  dateCurrent: Date;
  groupIdCurrent: number;
  data: ITask[];
}

const initialState: TasksProps = {
  dateCurrent: new Date(),
  groupIdCurrent: 0,
  data: [],
};

export const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setNewTask: (state: TasksProps, action: PayloadAction<Partial<Task>>) => {
      const taskId = state.data.length + 1;
      action.payload.id = taskId;
      action.payload.done = false;
      action.payload.groupId = state.groupIdCurrent;
      action.payload.date = state.dateCurrent;

      state.data.push(action.payload as Task);
      state.data.sort((a, b) => {
        const [startHourA] = a.time.split(" ")[0].split(":");
        const [startHourB] = b.time.split(" ")[0].split(":");
        return parseInt(startHourA) - parseInt(startHourB);
      });

      state.data = [...state.data];
    },
    markTaskAsDone: (state, action: PayloadAction<number>) => {
      const task = state.data.find((task) => task.id === action.payload);
      if (task) {
        task.done = !task.done;
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
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
    selectDateCurrent: (state, action: PayloadAction<Date>) => {
      state.dateCurrent = action.payload;
    },
    selectGroupIdCurrent: (state, action: PayloadAction<number>) => {
      state.groupIdCurrent = action.payload;
    },
  },
});

export const {
  setNewTask,
  markTaskAsDone,
  deleteTask,
  editTask,
  selectDateCurrent,
  selectGroupIdCurrent,
} = slice.actions;
export default slice.reducer;
export const selectorTasks = (state: { tasks: TasksProps }): TasksProps =>
  state.tasks;
