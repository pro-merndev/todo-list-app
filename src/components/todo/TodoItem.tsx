import { TodoItemProps } from "@/types/todo-components";
import { Button } from "@/components/ui/button";
import { Check, Flag, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const priorityColors = {
  low: "text-green-500",
  medium: "text-yellow-500",
  high: "text-red-500",
} as const;

export function TodoItem({
  todo,
  onToggle,
  onPriorityChange,
  onRemove,
}: TodoItemProps) {
  return (
    <motion.div
      key={todo.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-3 sm:p-4 border-b border-gray-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Button
            onClick={() => onToggle(todo.id)}
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center p-0 hover:bg-blue-100 transition-colors duration-200 flex-shrink-0",
              todo.completed
                ? "bg-green-500 border-green-600"
                : "bg-white border-gray-300"
            )}
          >
            {todo.completed && <Check className="w-4 h-4 text-white" />}
          </Button>
          <div className="flex-1 min-w-0">
            <span
              className={cn(
                "text-base sm:text-lg block truncate",
                todo.completed && "line-through text-gray-400"
              )}
            >
              {todo.text}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 block">
              {new Date(todo.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto ml-9 sm:ml-0">
          <Button
            onClick={() => onPriorityChange(todo.id)}
            className={cn(
              "text-gray-500 hover:text-gray-700 transition-colors duration-200",
              priorityColors[todo.priority]
            )}
            variant="ghost"
            size="sm"
          >
            <Flag className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            onClick={() => onRemove(todo.id)}
            className="text-red-500 hover:text-red-700 transition-colors duration-200"
            variant="ghost"
            size="sm"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
