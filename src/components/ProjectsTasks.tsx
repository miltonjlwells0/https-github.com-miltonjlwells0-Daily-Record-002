import React, { useState } from 'react';
import { useData } from '../store/DataContext';
import { Plus, CheckCircle2, Circle, Clock, Filter, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import { TaskStatus, Priority } from '../types';

export const ProjectsTasks = () => {
  const { tasks, projects, addTask, updateTask, deleteTask } = useData();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Today' | 'High Priority'>('All');
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('Medium');
  const [taskProjectId, setTaskProjectId] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName || !taskDueDate) return;
    addTask({
      name: taskName,
      dueDate: taskDueDate,
      priority: taskPriority,
      status: 'To Do',
      projectId: taskProjectId || undefined
    });
    setTaskName('');
    setTaskDueDate('');
    setShowTaskForm(false);
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  
  let displayedTasks = tasks;
  if (activeFilter === 'Today') {
    displayedTasks = tasks.filter(t => t.dueDate === today);
  } else if (activeFilter === 'High Priority') {
    displayedTasks = tasks.filter(t => t.priority === 'High');
  }

  // Group by status for board-like view
  const todoTasks = displayedTasks.filter(t => t.status === 'To Do');
  const doingTasks = displayedTasks.filter(t => t.status === 'Doing');
  const doneTasks = displayedTasks.filter(t => t.status === 'Done');

  const renderTaskCard = (task: typeof tasks[0]) => {
    const project = projects.find(p => p.id === task.projectId);
    
    return (
      <div key={task.id} className="bg-white/60 p-3 rounded-xl border border-nat-border group hover:bg-white/80 transition-colors">
        <div className="flex gap-3 items-start">
          <button 
            onClick={() => updateTask(task.id, { status: task.status === 'Done' ? 'To Do' : 'Done' })}
            className="shrink-0 mt-0.5"
          >
            {task.status === 'Done' ? (
              <div className='w-5 h-5 rounded-full bg-nat-accent-2 border-2 border-nat-accent-2 flex items-center justify-center'>
                <span className='text-[10px] text-white'>✓</span>
              </div>
            ) : (
              <div className='w-5 h-5 rounded-full border-2 border-nat-accent-1'></div>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p className={cn("text-sm font-semibold truncate", task.status === 'Done' && "opacity-40 line-through")}>
              {task.name}
            </p>
            {project && (
              <p className="text-[10px] opacity-60 mt-1 truncate">
                {project.name}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-sm font-medium text-white",
                task.priority === 'High' ? "bg-nat-accent-4" :
                task.priority === 'Medium' ? "bg-nat-accent-1" :
                "bg-nat-accent-2"
              )}>
                {task.priority}
              </span>
              <span className="text-[10px] opacity-50 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 
                {format(new Date(task.dueDate), 'MMM d')}
              </span>
            </div>
          </div>
          <button onClick={() => deleteTask(task.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
             &times;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl serif italic tracking-wide text-nat-accent-2">Projects & Tasks</h1>
          <p className="text-nat-text opacity-60 mt-1 text-sm">Manage your daily actions and ongoing projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-nat-light-1 p-1 rounded-lg">
            {['All', 'Today', 'High Priority'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  activeFilter === f ? "bg-white text-nat-text shadow-sm" : "text-nat-text opacity-50 hover:opacity-80"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowTaskForm(!showTaskForm)}
            className="bg-nat-accent-2 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-nat-accent-3 transition-colors flex items-center gap-1 h-[32px]"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
        </div>
      </div>

      {showTaskForm && (
        <form onSubmit={handleAddTask} className="glass p-6 rounded-2xl mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium opacity-70 mb-1">Task Name</label>
            <input type="text" required value={taskName} onChange={e => setTaskName(e.target.value)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none" placeholder="What needs to be done?" />
          </div>
          <div>
            <label className="block text-xs font-medium opacity-70 mb-1">Due Date</label>
            <input type="date" required value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium opacity-70 mb-1">Priority</label>
            <select value={taskPriority} onChange={e => setTaskPriority(e.target.value as Priority)} className="w-full rounded-md border-nat-border shadow-sm focus:border-nat-accent-2 focus:ring-nat-accent-2 text-sm px-3 py-2 border bg-white/50 outline-none">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex gap-2">
             <button type="submit" className="w-full bg-nat-accent-2 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-nat-accent-3">Add</button>
          </div>
        </form>
      )}

      {/* Kanban Board style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* To Do */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="serif italic text-sm">To Do</h3>
            <span className="text-xs bg-nat-light-1 px-2 py-0.5 rounded-full font-medium">{todoTasks.length}</span>
          </div>
          <div className="space-y-3">
            {todoTasks.map(renderTaskCard)}
            {todoTasks.length === 0 && (
              <div className="p-4 border border-dashed border-nat-border rounded-xl text-center text-xs opacity-50">Empty</div>
            )}
          </div>
        </div>

        {/* Doing */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="serif italic text-sm text-nat-accent-4">In Progress</h3>
            <span className="text-xs bg-nat-accent-4/10 text-nat-accent-4 px-2 py-0.5 rounded-full font-medium">{doingTasks.length}</span>
          </div>
          <div className="space-y-3">
            {doingTasks.map(renderTaskCard)}
            {doingTasks.length === 0 && (
              <div className="p-4 border border-dashed border-nat-border rounded-xl text-center text-xs opacity-50">Empty</div>
            )}
          </div>
        </div>

        {/* Done */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="serif italic text-sm opacity-50">Completed</h3>
            <span className="text-xs bg-nat-light-1 opacity-50 px-2 py-0.5 rounded-full font-medium">{doneTasks.length}</span>
          </div>
          <div className="space-y-3 opacity-70 hover:opacity-100 transition-opacity">
            {doneTasks.map(renderTaskCard)}
             {doneTasks.length === 0 && (
              <div className="p-4 border border-dashed border-nat-border rounded-xl text-center text-xs opacity-50">Empty</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
