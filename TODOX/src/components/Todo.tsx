import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

interface TodoProps {
  todos: TodoType;
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
}

const Todo = ({ todos, toggleComplete, deleteTodo }: TodoProps) => {
  return (
    <li className="p-2 bg-white my-2 rounded-md uppercase shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <p
          className={`text-gray-700 cursor-pointer ${
            todos.completed ? "line-through opacity-50" : ""
          }`}
        >
          {todos.text}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => toggleComplete(todos.id)}
            className={`text-green-500 hover:text-green-700 transition-colors`}
            aria-label="Toggle Complete"
          >
            <CheckIcon />
          </button>
          <button
            onClick={() => deleteTodo(todos.id)}
            className={`text-red-500 hover:text-red-700 transition-colors`}
            aria-label="Delete Todo"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </li>
  );
};

export type TodoType = {
  text?: string;
  completed?: boolean;
  id: string;
};

export default Todo;
