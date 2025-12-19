import { useState, useEffect } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { Bell, BellOff, CheckCircle2, Clock, Trash2, Plus } from 'lucide-react';

interface Task {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    deadline?: number; // timestamp
    reminderSet: boolean;
}

export const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [filter, setFilter] = useState<'pending' | 'completed'>('pending');
    const [showDateInput, setShowDateInput] = useState(false);
    const [deadlineInput, setDeadlineInput] = useState('');
    const [permission, setPermission] = useState(Notification.permission);

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

    // Check permissions on mount
    useEffect(() => {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission().then(setPermission);
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
            reminderSet: false
        };

        if (deadlineInput) {
             const date = new Date(deadlineInput);
             if (!isNaN(date.getTime())) {
                 task.deadline = date.getTime();
                 // Schedule notification if future
                 if (date.getTime() > Date.now() && permission === 'granted') {
                     task.reminderSet = true;
                     scheduleNotification(task);
                 }
             }
        }
        
        saveTasks([task, ...tasks]);
        setNewTask('');
        setDeadlineInput('');
        setShowDateInput(false);
    };

    const scheduleNotification = (task: Task) => {
        if (!task.deadline) return;
        const delay = task.deadline - Date.now();
        if (delay > 0 && delay < 2147483647) { // Max setTimeout delay
            setTimeout(() => {
                new Notification("Prodomo Task Reminder", {
                    body: `It's time for: ${task.text}`,
                    icon: '/icon.png' // Assumes icon exists
                });
            }, delay);
        }
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

    const requestNotify = async () => {
        const res = await Notification.requestPermission();
        setPermission(res);
    };

    const filteredTasks = tasks.filter(t => filter === 'pending' ? !t.completed : t.completed);

    return (
        <div className="flex flex-col h-full bg-black/20 p-6">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                    <button 
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'pending' ? 'bg-yellow-500 text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
                    >
                        Pending
                    </button>
                    <button 
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'completed' ? 'bg-green-500 text-black shadow-lg' : 'text-white/50 hover:text-white'}`}
                    >
                        Done
                    </button>
                </div>

                {permission !== 'granted' && (
                    <button onClick={requestNotify} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/50 hover:text-yellow-400 transition-colors" title="Enable Notifications">
                        <BellOff className="w-5 h-5" />
                    </button>
                )}
            </div>
            
            {/* Add Task Form - Only in Pending */}
            {filter === 'pending' && (
                <form onSubmit={addTask} className="mb-6 space-y-3">
                    <div className="relative group">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add a new task..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-4 outline-none focus:border-yellow-400/50 focus:bg-white/10 transition-all placeholder:text-white/20 text-sm font-medium"
                        />
                        <button 
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-500 rounded-xl text-black hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                            disabled={!newTask.trim()}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    
                    {/* Optional Details Toggle */}
                    <div className="flex items-center gap-2">
                        <button 
                            type="button"
                            onClick={() => setShowDateInput(!showDateInput)}
                            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${showDateInput || deadlineInput ? 'bg-white/10 border-yellow-500/50 text-yellow-400' : 'border-transparent text-white/30 hover:bg-white/5'}`}
                        >
                            <Clock className="w-3 h-3" />
                            {deadlineInput ? format(new Date(deadlineInput), 'MMM dd, HH:mm') : 'Add Deadline'}
                        </button>
                    </div>

                    {showDateInput && (
                        <div className="animate-in slide-in-from-top-2 fade-in">
                            <input 
                                type="datetime-local" 
                                value={deadlineInput}
                                onChange={(e) => setDeadlineInput(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl p-2 text-xs text-white outline-none w-full"
                            />
                        </div>
                    )}
                </form>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {filteredTasks.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-white/20 gap-2 min-h-[200px]">
                        <div className="p-4 bg-white/5 rounded-full">
                            <CheckSquare className="w-8 h-8 opacity-50" />
                        </div>
                        <span className="text-xs font-mono">No {filter} tasks</span>
                    </div>
                )}
                
                {filteredTasks.map(task => (
                    <div 
                        key={task.id}
                        className={`group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300 ${task.completed ? 'bg-white/[0.02] border-white/5' : 'bg-white/[0.05] border-white/10 hover:border-white/20'}`}
                    >
                        <button
                            onClick={() => toggleTask(task.id)}
                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                                task.completed ? 'bg-green-500 border-green-500 scale-110' : 'border-white/20 hover:border-yellow-400'
                            }`}
                        >
                            {task.completed && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                        </button>
                        
                        <div className="flex-1 flex flex-col gap-1">
                             <span className={`text-sm font-medium transition-all ${task.completed ? 'line-through text-white/30' : 'text-white/90'}`}>
                                {task.text}
                            </span>
                            
                            {/* Meta Info */}
                            <div className="flex items-center gap-3 text-[10px] uppercase font-bold text-white/40">
                                {task.deadline && (
                                    <div className={`flex items-center gap-1 ${!task.completed && isPast(new Date(task.deadline)) ? 'text-red-400' : ''}`}>
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(task.deadline), isToday(new Date(task.deadline)) ? 'HH:mm' : 'MMM dd')}
                                    </div>
                                )}
                                {task.reminderSet && !task.completed && (
                                    <div className="flex items-center gap-1 text-yellow-500/80">
                                        <Bell className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-lg transition-all"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Temp icon helper
const CheckSquare = ({className}: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

