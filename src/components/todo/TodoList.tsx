"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import {
  addTodo,
  toggleTodo,
  removeTodo,
  setTodos,
  updateTodoPriority,
} from "@/store/todoSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Statistics } from "./Statistics";
import { SearchFilters } from "./SearchFilters";
import { AddTodoForm } from "./AddTodoForm";
import { TodoItem } from "./TodoItem";
import { EmptyState, NoSearchResults, NoFilterResults } from "./EmptyStates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence } from "framer-motion";

export function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<
    "low" | "medium" | "high"
  >("low");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">(
    "all"
  );
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");

  const todos = useAppSelector((state) => state.todos.todos);
  const dispatch = useAppDispatch();

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      dispatch(setTodos(JSON.parse(savedTodos)));
    }
  }, [dispatch]);

  // Save todos to localStorage when they change
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

  const handleToggle = (id: number) => {
    dispatch(toggleTodo(id));
    const todo = todos.find((t) => t.id === id);
    toast.success(
      todo?.completed ? "Task marked as incomplete" : "Task completed! 🎉"
    );
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

  const handleRemove = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    dispatch(removeTodo(id));
    toast.success("Task removed", {
      description: `"${todo?.text}" has been deleted`,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterPriority("all");
  };

  const handleShowAllTasks = () => {
    setActiveTab("all");
  };

  const renderTodoList = (filter: "all" | "active" | "completed" = "all") => {
    const filteredTodos = todos
      .filter((todo) => {
        const searchMatch = todo.text
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());
        return searchMatch;
      })
      .filter((todo) => {
        if (filter === "active") return !todo.completed;
        if (filter === "completed") return todo.completed;
        return true;
      })
      .filter((todo) => {
        if (filterPriority === "all") return true;
        return todo.priority === filterPriority;
      })
      .reverse();

    if (todos.length === 0) {
      return <EmptyState />;
    }

    if (filteredTodos.length === 0) {
      if (searchQuery || filterPriority !== "all") {
        return <NoSearchResults onClearFilters={handleClearFilters} />;
      }
      if (filter !== "all") {
        return <NoFilterResults onShowAllTasks={handleShowAllTasks} />;
      }
    }

    return (
      <div className="space-y-2">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onPriorityChange={handlePriorityChange}
              onRemove={handleRemove}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 p-3 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white border-none">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                Todo List
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Organize your tasks efficiently
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <Statistics todos={todos} />
            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterPriority={filterPriority}
              setFilterPriority={(priority) =>
                setFilterPriority(priority as "low" | "medium" | "high")
              }
            />
            <AddTodoForm
              newTodo={newTodo}
              setNewTodo={setNewTodo}
              newTodoPriority={newTodoPriority}
              setNewTodoPriority={setNewTodoPriority}
              onSubmit={handleSubmit}
            />
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as typeof activeTab)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all">{renderTodoList("all")}</TabsContent>
              <TabsContent value="active">
                {renderTodoList("active")}
              </TabsContent>
              <TabsContent value="completed">
                {renderTodoList("completed")}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
