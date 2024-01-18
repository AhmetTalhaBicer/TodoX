import Form from "./components/Form";
import { FormEventHandler } from "react";
import { useState, useEffect } from "react";
import Todo from "./components/Todo";
import { db } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

// Todo'nun tipini tanımlar.
interface TodoType {
  text?: string;
  completed?: boolean;
  id: string;
}

const App = () => {
  // State kullanarak TODO'ları ve input değerini yönetir.
  const [todo, setTodo] = useState<TodoType[]>([]);
  const [input, setInput] = useState("");

  // TODO oluşturmak için kullanılan fonksiyon.
  const createTodo: FormEventHandler<HTMLInputElement> = async (e) => {
    e.preventDefault();
    if (input === "") {
      alert("Lütfen geçerli bir TODO girin");
      return;
    }
    // Firebase Firestore'a yeni bir TODO ekler.
    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
    });
    setInput("");
  };

  // TODO'ları Firestore'dan okuyarak günceller.
  useEffect(() => {
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosArr: TodoType[] = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodo(todosArr);
    });
    return () => unsubscribe(); // Komponent kaldırıldığında Firestore dinleme işlemi sonlandırılır.
  }, []);

  // TODO'ların tamamlanma durumunu güncellemek için kullanılan fonksiyon.
  const toggleComplete = async (todo: TodoType) => {
    await updateDoc(doc(db, "todos", todo.id), {
      completed: !todo.completed,
    });
  };

  // TODO'yu silmek için kullanılan fonksiyon.
  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };

  return (
    <div className="h-screen w-screen p-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 overflow-y-scroll shadow-lg">
      <div className="bg-white max-w-[500px] w-full m-auto rounded-md p-4 shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 p-2 uppercase mb-4">
          TODOX APP
        </h1>
        {/* TODO eklemek için kullanılan Form bileşeni */}
        <Form createTodo={createTodo} input={input} setInput={setInput} />
        <ul>
          {/* Her bir TODO için ayrı bir Todo bileşeni oluşturulur */}
          {todo.map((todos, index) => (
            <Todo
              key={index}
              todos={todos}
              toggleComplete={() => toggleComplete(todos)}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
        {/* TODO sayısını gösteren metin */}
        <p className="text-center">
          {todo.length && todo.length === 1
            ? "Bir göreviniz kaldı"
            : `Toplam ${todo.length} göreviniz bulunmaktadır`}
        </p>
      </div>
    </div>
  );
};

export default App;
