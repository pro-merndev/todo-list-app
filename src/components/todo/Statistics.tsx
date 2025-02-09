import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Todo } from "@/types/todo";

interface StatisticCardProps {
  title: string;
  value: number;
  color: string;
}

const StatisticCard = ({ title, value, color }: StatisticCardProps) => (
  <Card className="border-none bg-transparent">
    <CardContent className="p-4">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <motion.p
        key={value}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className={`text-2xl font-bold ${color}`}
      >
        {value}
      </motion.p>
    </CardContent>
  </Card>
);

export function Statistics({ todos }: { todos: Todo[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <StatisticCard
        title="Total Tasks"
        value={todos.length}
        color="text-blue-600"
      />
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
}
