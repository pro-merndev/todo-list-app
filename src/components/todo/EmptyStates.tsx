import { Button } from "@/components/ui/button";
import { PackageSearch, SearchX, ListX } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
      <PackageSearch className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
      <p className="text-gray-500 text-center max-w-sm mb-4">
        Get started by adding your first task using the form above
      </p>
      <Button
        onClick={() => {
          const input = document.querySelector(
            'input[name="new-todo"]'
          ) as HTMLInputElement;
          if (input) {
            input.focus();
          }
        }}
        variant="outline"
      >
        Add Your First Task
      </Button>
    </div>
  );
}

interface NoSearchResultsProps {
  onClearFilters: () => void;
}

export function NoSearchResults({ onClearFilters }: NoSearchResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
      <SearchX className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No matching tasks found
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-4">
        Try adjusting your search or filter criteria
      </p>
      <Button onClick={onClearFilters} variant="outline">
        Clear All Filters
      </Button>
    </div>
  );
}

interface NoFilterResultsProps {
  onShowAllTasks: () => void;
}

export function NoFilterResults({ onShowAllTasks }: NoFilterResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
      <ListX className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        No tasks in this category
      </h3>
      <p className="text-gray-500 text-center max-w-sm mb-4">
        There are no tasks that match the current filter settings
      </p>
      <Button onClick={onShowAllTasks} variant="outline">
        Show All Tasks
      </Button>
    </div>
  );
}
