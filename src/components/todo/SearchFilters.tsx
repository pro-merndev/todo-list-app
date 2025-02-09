import { Select, SelectItem } from "../ui/select";

import { SearchFiltersProps } from "@/types/todo-components";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { SelectContent, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
}: SearchFiltersProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-3 bg-gray-50 p-3 sm:p-4 rounded-lg">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search todos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-white shadow-sm w-full"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Select
        value={filterPriority}
        onValueChange={(value) =>
          setFilterPriority(value as typeof filterPriority)
        }
      >
        <SelectTrigger className="w-full sm:w-[140px] bg-white shadow-sm">
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
}
