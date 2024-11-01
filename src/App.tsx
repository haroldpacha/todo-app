import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { ListTodo, PlusCircle, AlertCircle, ShoppingCart, Wrench } from 'lucide-react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export interface Task {
  id?: number;
  title: string;
  category: string;
  priority: number;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchTasks = async () => {
    const tasks = await invoke<Task[]>('get_tasks');
    setTasks(tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (task: Omit<Task, 'id' | 'completed'>) => {
    await invoke('add_task', { task: { ...task, completed: false } });
    await fetchTasks();
    setIsFormOpen(false);
  };

  const handleToggleTask = async (id: number) => {
    await invoke('toggle_task', { id });
    await fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ListTodo className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Nueva Tarea
          </button>
        </header>

        <main>
          <TaskList tasks={tasks} onToggleTask={handleToggleTask} />
        </main>

        {isFormOpen && (
          <TaskForm onSubmit={handleAddTask} onClose={() => setIsFormOpen(false)} />
        )}
      </div>
    </div>
  );
}

export default App;