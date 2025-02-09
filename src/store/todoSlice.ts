import { Todo, TodoState } from "@/types/todo";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


const initialState: TodoState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{
        text: string;
        priority: "low" | "medium" | "high";
      }>
    ) => {
      state.todos.push({
        id: Date.now(),
        text: action.payload.text,
        completed: false,
        priority: action.payload.priority,
        createdAt: new Date().toISOString(),
      });
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload;
    },
    updateTodoPriority: (
      state,
      action: PayloadAction<{ id: number; priority: "low" | "medium" | "high" }>
    ) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.priority = action.payload.priority;
      }
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, setTodos, updateTodoPriority } =
  todoSlice.actions;
export default todoSlice.reducer;
