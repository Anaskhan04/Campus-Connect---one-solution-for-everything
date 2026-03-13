import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  History, 
  BarChart3, 
  BookOpen, 
  Plus, 
  Trash2,
  Calendar,
  Loader2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Subject {
  _id: string;
  name: string;
  type: string;
}

interface AttendanceRecord {
  _id: string;
  subjectId: string;
  subjectName: string;
  date: string;
  status: "attended" | "missed" | "cancelled";
}

interface Stats {
  [key: string]: {
    subjectId: string;
    subjectName: string;
    total: number;
    present: number;
    absent: number;
    percentage: number;
  }
}

export default function AttendancePage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<Stats>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging, setIsLogging] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: "", type: "Theory" });

  useEffect(() => {
    if (user) {
      initData();
    }
  }, [user]);

  const initData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Subjects
      let currentSubjects = await api.getSubjects();
      
      // 2. If no subjects, try to seed defaults from hardcoded data if student profile exists
      if (currentSubjects.length === 0 && user?.role === 'student') {
        try {
          const profile = await api.request(`/students/${user.username}`);
          // Default subjects for IT 3rd year as a fallback/example
          if (profile && profile.year === 3 && profile.branch === 'Information Technology') {
            const defaults = [
              { name: 'Design analysis and Algorithm', type: 'Theory' },
              { name: 'Computer Graphic', type: 'Theory' },
              { name: 'Web Technology', type: 'Theory' },
              { name: 'DBMS LAB', type: 'Lab' }
            ];
            currentSubjects = await api.seedSubjects(defaults);
          }
        } catch (e) { /* profile might not exist */ }
      }
      
      setSubjects(currentSubjects);
      
      // 3. Fetch Records & Stats
      if (user) {
        const [recordsData, statsData] = await Promise.all([
          api.getAttendance(user.username),
          api.getAttendanceStats(user.username)
        ]);
        setRecords(recordsData);
        setStats(statsData);
      }
    } catch (error) {
      toast.error("Failed to sync attendance data");
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  const handleLogAttendance = async (subject: Subject, status: "attended" | "missed" | "cancelled") => {
    if (!user) return;
    setIsLogging(`${subject._id}-${status}`);
    try {
      await api.logAttendance({
        username: user.username,
        subjectId: subject._id,
        subjectName: subject.name,
        date: new Date().toISOString(),
        status
      });
      toast.success(`Marked ${subject.name} as ${status}`);
      // Refresh history and stats
      const [recordsData, statsData] = await Promise.all([
        api.getAttendance(user.username),
        api.getAttendanceStats(user.username)
      ]);
      setRecords(recordsData);
      setStats(statsData);
    } catch (error) {
      toast.error("Failed to log attendance");
    } finally {
      setIsLogging(null);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    try {
      await api.deleteAttendance(id);
      setRecords(records.filter(r => r._id !== id));
      // Refresh stats
      if (user) {
        const statsData = await api.getAttendanceStats(user.username);
        setStats(statsData);
      }
      toast.success("Record deleted");
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createSubject(newSubject.name, newSubject.type);
      setSubjects([...subjects, created]);
      setIsModalOpen(false);
      setNewSubject({ name: "", type: "Theory" });
      toast.success("Subject added");
    } catch (error) {
      toast.error("Failed to add subject");
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("Deleting this subject will not delete existing logs, but it will remove it from your tracker. Continue?")) return;
    try {
      await api.deleteSubject(id);
      setSubjects(subjects.filter(s => s._id !== id));
      toast.success("Subject removed");
    } catch (error) {
      toast.error("Failed to remove subject");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Tracker</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Manage your daily attendance and monitor your academic performance.
          </p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-md transition-all active:scale-95">
              <Plus className="mr-2 h-4 w-4" />
              Manage Subjects
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Your Subjects</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <form onSubmit={handleAddSubject} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Input 
                    placeholder="Subject name..." 
                    value={newSubject.name} 
                    onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                    required
                  />
                </div>
                <Select value={newSubject.type} onValueChange={v => setNewSubject({...newSubject, type: v})}>
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Theory">Theory</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" size="icon"><Plus className="h-4 w-4" /></Button>
              </form>
              
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {subjects.map(subject => (
                  <div key={subject._id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border">
                    <div>
                      <p className="text-sm font-bold">{subject.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{subject.type}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDeleteSubject(subject._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed">
          <div className="bg-white p-6 rounded-full shadow-sm mb-4">
            <BookOpen className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">No subjects found</h3>
          <p className="text-muted-foreground mt-2 max-w-xs">
            Add your course subjects to start tracking your attendance.
          </p>
          <Button variant="default" onClick={() => setIsModalOpen(true)} className="mt-6">
            Add First Subject
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Quick Log Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm">
              <Calendar className="h-4 w-4" />
              Quick Log: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {subjects.map((subject) => (
                <Card key={subject._id} className="border-none shadow-sm hover:shadow-md transition-all bg-white group overflow-hidden">
                  <div className="h-1.5 w-full bg-slate-100 group-hover:bg-primary/20 transition-colors" />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{subject.name}</CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-tight">{subject.type}</CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-primary leading-none">
                          {stats[subject._id]?.percentage || 0}%
                        </p>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1">Attendance</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-600 font-bold text-[11px]"
                        onClick={() => handleLogAttendance(subject, "attended")}
                        disabled={isLogging !== null}
                      >
                        {isLogging === `${subject._id}-attended` ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
                        Attended
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 border-red-100 bg-red-50/30 hover:bg-red-50 text-red-600 font-bold text-[11px]"
                        onClick={() => handleLogAttendance(subject, "missed")}
                        disabled={isLogging !== null}
                      >
                        {isLogging === `${subject._id}-missed` ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
                        Missed
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 border-slate-100 bg-slate-50/30 hover:bg-slate-100 text-slate-500 font-bold text-[11px]"
                        onClick={() => handleLogAttendance(subject, "cancelled")}
                        disabled={isLogging !== null}
                      >
                        {isLogging === `${subject._id}-cancelled` ? <Loader2 className="h-3 w-3 animate-spin" /> : <MinusCircle className="h-3 w-3 mr-1" />}
                        Holiday
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* History Feed */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-sm">
                <History className="h-4 w-4" />
                Recent Activity
              </div>
              <Card className="border-none shadow-sm bg-white overflow-hidden">
                <div className="divide-y divide-slate-50">
                  {records.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm italic">
                      No logs found for this week.
                    </div>
                  ) : (
                    records.slice(0, 10).map((record) => (
                      <div key={record._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            record.status === 'attended' ? 'bg-emerald-100 text-emerald-600' :
                            record.status === 'missed' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {record.status === 'attended' ? <CheckCircle2 className="h-4 w-4" /> :
                             record.status === 'missed' ? <XCircle className="h-4 w-4" /> : <MinusCircle className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{record.subjectName}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">
                              {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(record.date))}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`text-[9px] uppercase border-none ${
                            record.status === 'attended' ? 'bg-emerald-50 text-emerald-700' :
                            record.status === 'missed' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {record.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-red-500" onClick={() => handleDeleteRecord(record._id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-sm">
              <BarChart3 className="h-4 w-4" />
              Insights
            </div>
            
            <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
              <CardHeader>
                <CardTitle className="text-white/80 text-sm font-bold uppercase tracking-widest">Overall Average</CardTitle>
                <div className="text-5xl font-black mt-2">
                  {Object.values(stats).length > 0 
                    ? Math.round(Object.values(stats).reduce((acc, curr) => acc + curr.percentage, 0) / Object.values(stats).length)
                    : 0}%
                </div>
              </CardHeader>
              <CardContent className="relative z-10 pt-0">
                <p className="text-primary-foreground/70 text-xs font-medium">
                  Across {subjects.length} subjects tracked.
                </p>
              </CardContent>
              <BarChart3 className="absolute -right-10 -bottom-10 h-40 w-40 text-white/10" />
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Low Attendance Alert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.values(stats).filter(s => s.percentage < 75).length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 p-3 rounded-lg">
                    <CheckCircle2 className="h-4 w-4" />
                    You are above 75% in all subjects!
                  </div>
                ) : (
                  Object.values(stats).filter(s => s.percentage < 75).map(s => (
                    <div key={s.subjectId} className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                      <div>
                        <p className="text-xs font-bold text-red-900">{s.subjectName}</p>
                        <p className="text-[10px] text-red-600">Short by {75 - s.percentage}%</p>
                      </div>
                      <Badge variant="destructive" className="bg-red-500 font-bold border-none">{s.percentage}%</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-white/60 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                  <AlertCircle className="h-3 w-3" />
                  Smart Suggestion
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm font-medium leading-relaxed">
                  You need to attend <span className="text-primary font-black">4 more</span> classes in 
                  <span className="font-bold"> Web Technology</span> to cross the 75% criteria.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </motion.div>
  );
}
