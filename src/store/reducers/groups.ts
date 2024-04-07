import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Group {
  id: number;
  title: string;
}

interface GroupsProps {
  groups: Group[];
}

const initialState: GroupsProps = {
  groups: [],
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    createGroup: (state, action: PayloadAction<string>) => {
      const newGroupId = state.groups.length + 1;
      const newGroup: Group = {
        id: newGroupId,
        title: action.payload,
      };
      state.groups.push(newGroup);
    },
    deleteGroup: (state, action: PayloadAction<number>) => {
      const groupIdToDelete = action.payload;
      state.groups = state.groups.filter(
        (group) => group.id !== groupIdToDelete
      );
    },
  },
});

export const { createGroup, deleteGroup } = groupsSlice.actions;
export default groupsSlice.reducer;

export const selectorGroups = (state: { groups: GroupsProps }): GroupsProps =>
  state.groups;
