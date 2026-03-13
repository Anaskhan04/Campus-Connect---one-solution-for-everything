import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  GraduationCap,
  Plus,
  Trash2,
  ListTodo,
  Loader2,
  Circle,
  AlertCircle,
  ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";

interface Todo {
  _id: string;
  text: string;
  completed: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [attendanceStats, setAttendanceStats] = useState({ avg: 0, count: 0 });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [todosData, statsData, subjectsData] = await Promise.all([
        api.getTodos(),
        api.getAttendanceStats(user?.username || ""),
        api.getSubjects()
      ]);
      
      setTodos(todosData);
      
      const statsValues = Object.values(statsData || {}) as any[];
      if (statsValues.length > 0) {
        const totalAvg = statsValues.reduce((acc, curr) => acc + curr.percentage, 0);
        setAttendanceStats({
          avg: Math.round(totalAvg / statsValues.length),
          count: subjectsData.length
        });
      }
    } catch (error) {
      console.error("Dashboard sync error:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setIsAdding(true);
    try {
      const todo = await api.createTodo(newTodo.trim());
      setTodos([todo, ...todos]);
      setNewTodo("");
      toast.success("Task added");
    } catch (error) {
      toast.error("Failed to add task");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const updated = await api.updateTodo(todo._id, { completed: !todo.completed });
      setTodos(todos.map(t => t._id === todo._id ? updated : t));
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter(t => t._id !== id));
      toast.success("Task removed");
    } catch (error) {
      toast.error("Failed to remove task");
    }
  };

  const stats = [
    {
      title: "Attendance",
      value: `${attendanceStats.avg}%`,
      description: `In ${attendanceStats.count} subjects`,
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Tasks",
      value: todos.filter(t => !t.completed).length.toString(),
      description: "Remaining today",
      icon: ListTodo,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Upcoming Events",
      value: "4",
      description: "Next 7 days",
      icon: Calendar,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      title: "Grade Point",
      value: "3.8",
      description: "Current GPA",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, <span className="text-primary capitalize">{user?.username}</span>!
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's your academic overview for today.
          </p>
        </div>
        
        {/* REC Banda Quick Links */}
        <div className="flex flex-wrap gap-2 pb-1">
          <a href="http://172.16.1.1:8090/httpclient.html" target="_blank" rel="noopener noreferrer">
            <Badge variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors border-none bg-slate-100 text-slate-700 font-semibold gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              REC internet
            </Badge>
          </a>
          <a href="https://apps.recbanda.ac.in/ims/frmLogin.aspx" target="_blank" rel="noopener noreferrer">
            <Badge variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors border-none bg-slate-100 text-slate-700 font-semibold gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              REC ERP
            </Badge>
          </a>
          <a href="https://oneview.aktu.ac.in/WebPages/aktu/OneView.aspx" target="_blank" rel="noopener noreferrer">
            <Badge variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors border-none bg-slate-100 text-slate-700 font-semibold gap-1.5">
              <span className="size-2 rounded-full bg-orange-500" />
              AKTU One-View
            </Badge>
          </a>
          <Badge variant="secondary" onClick={() => (window.location.href = '/attendance')} className="px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors border-none bg-slate-100 text-slate-700 font-semibold gap-1.5">
            <span className="size-2 rounded-full bg-purple-500" />
            Attendance
          </Badge>
          <Badge variant="secondary" onClick={() => (window.location.href = '/resources')} className="px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors border-none bg-slate-100 text-slate-700 font-semibold gap-1.5">
            <span className="size-2 rounded-full bg-slate-400" />
            Resources
          </Badge>
          <a href="https://aktu.ac.in/circulars.html" target="_blank" rel="noopener noreferrer">
            <Badge variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors border-none bg-slate-100 text-slate-700 font-semibold gap-1.5">
              <span className="size-2 rounded-full bg-red-400" />
              Circulars
            </Badge>
          </a>
          <a href="https://aktu.ac.in/syllabus.html" target="_blank" rel="noopener noreferrer">
            <Badge variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors border-none bg-slate-100 text-slate-700 font-semibold gap-1.5">
              <span className="size-2 rounded-full bg-yellow-500" />
              Syllabus
            </Badge>
          </a>
          <a href="https://www.abesit.in/library/question-paper-bank/" target="_blank" rel="noopener noreferrer">
            <Badge variant="secondary" className="px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors border-none bg-slate-100 text-slate-700 font-semibold gap-1.5">
              <span className="size-2 rounded-full bg-pink-500" />
              PYQs
            </Badge>
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-shadow group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold mt-1 text-slate-900">{stat.value}</h3>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.description}</p>
                </div>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                  <stat.icon className="size-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Todo List Area */}
        <Card className="lg:col-span-4 border-none shadow-sm flex flex-col h-full bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ListTodo className="size-5 text-primary" />
                  Task Planner
                </CardTitle>
                <CardDescription>Keep track of your daily goals and assignments.</CardDescription>
              </div>
              <Badge variant="secondary" className="font-bold bg-primary/5 text-primary border-none">
                {todos.length} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
              <Input 
                placeholder="What needs to be done?" 
                value={newTodo}
                onChange={e => setNewTodo(e.target.value)}
                className="h-11 bg-slate-50 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20"
                disabled={isAdding}
              />
              <Button type="submit" disabled={isAdding || !newTodo.trim()} className="h-11 shadow-md px-6">
                {isAdding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              </Button>
            </form>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3">
                      <Skeleton className="size-5 rounded" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))
                ) : todos.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground"
                  >
                    <Circle className="size-12 text-slate-100 mb-2" />
                    <p className="text-sm font-medium">All caught up! No pending tasks.</p>
                  </motion.div>
                ) : (
                  todos.map((todo) => (
                    <motion.div 
                      key={todo._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      layout
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <Checkbox 
                        checked={todo.completed} 
                        onCheckedChange={() => toggleTodo(todo)}
                        className="size-5 border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                      />
                      <span className={`text-sm font-medium flex-1 transition-all ${todo.completed ? "text-slate-400 line-through" : "text-slate-700"}`}>
                        {todo.text}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => deleteTodo(todo._id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-50 pt-4 pb-4">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
              <AlertCircle className="size-3" />
              Synced with Cloud Database
            </p>
          </CardFooter>
        </Card>

        {/* Quick Actions Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative min-h-[200px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="size-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 relative z-10">
              <a href="https://oneview.aktu.ac.in/WebPages/aktu/OneView.aspx" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 border-none text-white shadow-none group">
                  AKTU One-View
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <a href="https://aktu.ac.in/circulars.html" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 border-none text-white shadow-none group">
                  AKTU Circulars
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
              <a href="https://www.abesit.in/library/question-paper-bank/" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button variant="secondary" className="w-full justify-between bg-white/10 hover:bg-white/20 border-none text-white shadow-none group">
                  Previous Year Papers
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </a>
            </CardContent>
            {/* Decorative Background Elements */}
            <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-white/5 blur-2xl" />
            <TrendingUp className="absolute -right-4 bottom-4 size-32 text-white/10 -rotate-12" />
          </Card>

          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-tighter text-xs">
                <span className="size-2 rounded-full bg-primary animate-pulse" />
                Live Notice Board
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-bold leading-tight line-clamp-2">End-semester examination schedule released for 2026.</p>
                <p className="text-[10px] text-slate-400 font-medium">Published 2 hours ago</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold leading-tight line-clamp-2">Tech Fest 2026: Call for student coordinators.</p>
                <p className="text-[10px] text-slate-400 font-medium">Published yesterday</p>
              </div>
              <Button variant="link" className="text-primary p-0 h-auto font-bold text-xs">
                Open Notice Center <ExternalLink className="size-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
