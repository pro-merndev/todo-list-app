import { AddTodoFormProps } from "@/types/todo-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Circle, Plus } from "lucide-react";

export function AddTodoForm({
  newTodo,
  setNewTodo,
  newTodoPriority,
  setNewTodoPriority,
  onSubmit,
}: AddTodoFormProps) {
  return (
    <div className="mb-8 bg-blue-50 p-3 sm:p-4 rounded-lg">
      <form onSubmit={onSubmit}>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-grow">
            <label
              htmlFor="new-todo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Task
            </label>
            <Input
              id="new-todo"
              name="new-todo"
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-white shadow-sm w-full"
            />
          </div>

          <div className="w-full sm:w-32">
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <Select
              value={newTodoPriority}
              onValueChange={(value) =>
                setNewTodoPriority(value as "low" | "medium" | "high")
              }
            >
              <SelectTrigger
                id="priority"
                className="w-full bg-white shadow-sm"
              >
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
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add Task
          </Button>
        </div>
      </form>
    </div>
  );
}
