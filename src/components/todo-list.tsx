"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { addTodo, toggleTodo, removeTodo, setTodos, updateTodoPriority } from "@/store/todoSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2, Flag, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

const priorityColors = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

export function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("low");
  const todos = useAppSelector((state) => state.todos.todos);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      dispatch(setTodos(JSON.parse(savedTodos)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo({ text: newTodo, priority: newTodoPriority }));
      setNewTodo("");
      setNewTodoPriority("low");
    }
  };

  const handlePriorityChange = (id: number) => {
    const priorities: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
    const currentPriority = todos.find((todo) => todo.id === id)?.priority || "low";
    const currentIndex = priorities.indexOf(currentPriority);
    const newPriority = priorities[(currentIndex + 1) % priorities.length];
    dispatch(updateTodoPriority({ id, priority: newPriority }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Todo List</h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </header>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task"
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="">
              <Select onValueChange={(value) => setNewTodoPriority(value as "low" | "medium" | "high")}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-green-500" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-yellow-500" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Circle className="w-4 h-4 text-red-500" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4">
              <Plus className="w-5 h-5" />
              Add
            </Button>
          </div>
        </form>

        <AnimatePresence>
          {todos.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-500">
              <p className="text-xl">Your todo list is empty. Add some tasks to get started!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={cn(
                    "flex items-center gap-4 p-4 bg-white rounded-md border transition-all duration-300",
                    todo.completed ? "border-green-200" : "border-gray-200"
                  )}
                >
                  <Button
                    onClick={() => dispatch(toggleTodo(todo.id))}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center p-0 hover:bg-blue-500",
                      todo.completed ? "bg-green-500 border-green-600" : "bg-white border-gray-300"
                    )}
                  >
                    {todo.completed && <Check className="w-4 h-4 text-white" />}
                  </Button>
                  <span className={cn("flex-1 text-lg", todo.completed && "line-through text-gray-400")}>{todo.text}</span>
                  <Button
                    onClick={() => handlePriorityChange(todo.id)}
                    className={cn("text-gray-500 hover:text-gray-700", priorityColors[todo.priority])}
                    variant="ghost"
                  >
                    <Flag className="w-5 h-5" />
                  </Button>
                  <Button onClick={() => dispatch(removeTodo(todo.id))} className="text-red-500 hover:text-red-700" variant="ghost">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
