import { useState, useEffect } from 'react';

interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
}

export const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('prodomo-tasks');
        if (saved) {
            try {
                setTasks(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse tasks', e);
            }
        }
    }, []);

    const saveTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
        localStorage.setItem('prodomo-tasks', JSON.stringify(newTasks));
    };

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        
        const task: Task = {
            id: crypto.randomUUID(),
            text: newTask,
            completed: false,
            createdAt: Date.now(),
        };
        
        saveTasks([task, ...tasks]);
        setNewTask('');
    };

    const toggleTask = (id: string) => {
        const updated = tasks.map(t => 
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        saveTasks(updated);
    };

    const deleteTask = (id: string) => {
        const updated = tasks.filter(t => t.id !== id);
        saveTasks(updated);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    TASKS
                </h2>
                <div className="text-xs text-white/30 font-mono font-bold bg-white/5 px-2 py-1 rounded-md border border-white/5">
                    {tasks.filter(t => !t.completed).length} PENDING
                </div>
            </div>
            
            <form onSubmit={addTask} className="mb-6 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="text-white/30 text-lg">+</span>
                </div>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-4 outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all placeholder:text-white/20 text-sm font-medium"
                />
            </form>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                {tasks.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-white/20 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3.75h.008v.008H6.75V15.75Zm3.75-3.75h.008v.008H10.5V12Zm0 3.75h.008v.008H10.5V15.75Zm3.75-3.75h.008v.008H14.25V12Zm0 3.75h.008v.008H14.25V15.75Z" />
                        </svg>
                        <span className="text-xs font-mono">No active tasks</span>
                    </div>
                )}
                
                {tasks.map(task => (
                    <div 
                        key={task.id}
                        className={`group flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] transition-all duration-300 ${task.completed ? 'opacity-40' : 'opacity-100'}`}
                    >
                        <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                                task.completed ? 'bg-yellow-400 border-yellow-400' : 'border-white/20 hover:border-yellow-400'
                            }`}
                        >
                            {task.completed && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-black">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                        
                        <div className="flex-1 flex flex-col">
                             <span className={`text-sm font-medium transition-all ${task.completed ? 'line-through text-white/30' : 'text-white/90'}`}>
                                {task.text}
                            </span>
                        </div>
                        
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-lg transition-all"
                            title="Delete Task"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 001.5.06l.3-7.5z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
