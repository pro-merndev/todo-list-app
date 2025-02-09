import { Todo } from "./todo";

type Priority = "low" | "medium" | "high";

export interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
}

export interface AddTodoFormProps {
  newTodo: string;
  setNewTodo: (todo: string) => void;
  newTodoPriority: Priority;
  setNewTodoPriority: (priority: Priority) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onPriorityChange: (id: number) => void;
  onRemove: (id: number) => void;
}
