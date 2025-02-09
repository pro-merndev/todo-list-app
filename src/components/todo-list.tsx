"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  addTodo,
  toggleTodo,
  removeTodo,
  setTodos,
  updateTodoPriority,
} from "@/store/todoSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Check,
  Trash2,
  Flag,
  Circle,
  SearchX,
  PackageSearch,
  ListX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Search } from "lucide-react";
import { toast } from "sonner";

const priorityColors = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
};

const StatisticCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
  >
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <motion.p
      key={value}
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      className={`text-2xl font-bold ${color}`}
    >
      {value}
    </motion.p>
  </motion.div>
);

export function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<
    "low" | "medium" | "high"
  >("low");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "completed"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
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
      toast.success("Task added successfully!", {
        description: `Added "${newTodo}" with ${newTodoPriority} priority`,
      });
      setNewTodo("");
      setNewTodoPriority("low");
    } else {
      toast.error("Please enter a task");
    }
  };

  const handlePriorityChange = (id: number) => {
    const priorities: ("low" | "medium" | "high")[] = ["low", "medium", "high"];
    const currentPriority =
      todos.find((todo) => todo.id === id)?.priority || "low";
    const currentIndex = priorities.indexOf(currentPriority);
    const newPriority = priorities[(currentIndex + 1) % priorities.length];
    dispatch(updateTodoPriority({ id, priority: newPriority }));
    toast.success("Priority updated");
  };

  const handleToggle = (id: number) => {
    dispatch(toggleTodo(id));
    const todo = todos.find((t) => t.id === id);
    toast.success(
      todo?.completed ? "Task marked as incomplete" : "Task completed! 🎉"
    );
  };

  const handleRemove = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    dispatch(removeTodo(id));
    toast.success("Task removed", {
      description: `"${todo?.text}" has been deleted`,
    });
  };

  const filteredTodos = todos
    .filter((todo) =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((todo) => {
      if (filterStatus === "active") return !todo.completed;
      if (filterStatus === "completed") return todo.completed;
      return true;
    })
    .filter((todo) => {
      if (filterPriority === "all") return true;
      return todo.priority === filterPriority;
    });

  const filterControls = (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select
        value={filterStatus}
        onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={filterPriority}
        onValueChange={(value) =>
          setFilterPriority(value as typeof filterPriority)
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const statistics = (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatisticCard title="Total Tasks" value={todos.length} color={""} />
      <StatisticCard
        title="Completed"
        value={todos.filter((t) => t.completed).length}
        color="text-green-600"
      />
      <StatisticCard
        title="Pending"
        value={todos.filter((t) => !t.completed).length}
        color="text-yellow-600"
      />
      <StatisticCard
        title="High Priority"
        value={todos.filter((t) => t.priority === "high").length}
        color="text-red-600"
      />
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <PackageSearch className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
      <p className="text-gray-500 text-center max-w-sm mb-4">
        Get started by adding your first task using the form above
      </p>
      <Button
        onClick={() =>
          (
            document.querySelector('input[name="todo"]') as HTMLInputElement
          )?.focus()
        }
        variant="outline"
      >
        Add Your First Task
      </Button>
    </div>
  );

  const NoSearchResults = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
      <SearchX className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No matching tasks found
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-4">
        {searchQuery && `No tasks match "${searchQuery}"`}
        {filterStatus !== "all" && ` in ${filterStatus} status`}
        {filterPriority !== "all" && ` with ${filterPriority} priority`}
      </p>
      <div className="flex gap-3">
        <Button
          onClick={() => {
            setSearchQuery("");
            setFilterStatus("all");
            setFilterPriority("all");
          }}
          variant="outline"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );

  const NoFilterResults = () => (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
      <ListX className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No {filterStatus === "completed" ? "completed" : "active"} tasks
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-4">
        {filterStatus === "completed"
          ? "Complete some tasks to see them here"
          : "All tasks are completed! Add more tasks to stay productive"}
      </p>
      <Button onClick={() => setFilterStatus("all")} variant="outline">
        Show All Tasks
      </Button>
    </div>
  );

  const renderTodoList = () => {
    if (todos.length === 0) {
      return <EmptyState />;
    }

    if (filteredTodos.length === 0) {
      if (searchQuery || filterPriority !== "all") {
        return <NoSearchResults />;
      }
      if (filterStatus !== "all") {
        return <NoFilterResults />;
      }
    }

    return (
      <div className="space-y-4">
        {filteredTodos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4"
          >
            <Button
              onClick={() => handleToggle(todo.id)}
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center p-0 hover:bg-blue-500",
                todo.completed
                  ? "bg-green-500 border-green-600"
                  : "bg-white border-gray-300"
              )}
            >
              {todo.completed && <Check className="w-4 h-4 text-white" />}
            </Button>
            <span
              className={cn(
                "flex-1 text-lg",
                todo.completed && "line-through text-gray-400"
              )}
            >
              {todo.text}
            </span>
            <Button
              onClick={() => handlePriorityChange(todo.id)}
              className={cn(
                "text-gray-500 hover:text-gray-700",
                priorityColors[todo.priority]
              )}
              variant="ghost"
            >
              <Flag className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => handleRemove(todo.id)}
              className="text-red-500 hover:text-red-700"
              variant="ghost"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Todo List</h1>
          <p className="text-gray-600">Organize your tasks efficiently</p>
        </header>

        {filterControls}

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
              <Select
                onValueChange={(value) =>
                  setNewTodoPriority(value as "low" | "medium" | "high")
                }
              >
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
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4"
            >
              <Plus className="w-5 h-5" />
              Add
            </Button>
          </div>
        </form>

        {statistics}

        {renderTodoList()}
      </div>
    </div>
  );
}
