import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, type Variants } from "framer-motion";
import { 
  Search, 
  Linkedin, 
  Github, 
  Mail, 
  ExternalLink,
  MoreVertical,
  Loader2,
  UserPlus,
  FilterX
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Student {
  _id: string;
  username: string;
  name: string;
  rollNo: string;
  year: number;
  branch: string;
  intro: string;
  skills: string[];
  email?: string;
  linkedin?: string;
  github?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    year: "1",
    branch: "Information Technology",
    intro: "",
    skills: "",
    linkedin: "",
    github: "",
    email: ""
  });

  const userProfile = students.find(s => s.username === user?.username);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, yearFilter, branchFilter]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        rollNo: userProfile.rollNo || "",
        year: userProfile.year?.toString() || "1",
        branch: userProfile.branch || "Information Technology",
        intro: userProfile.intro || "",
        skills: (userProfile.skills || []).join(", "),
        linkedin: userProfile.linkedin || "",
        github: userProfile.github || "",
        email: userProfile.email || ""
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.username,
        email: `${user.username}@example.edu`
      }));
    }
  }, [userProfile, user]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchQuery) query.append("q", searchQuery);
      if (yearFilter !== "all") query.append("year", yearFilter);
      if (branchFilter !== "all") query.append("branch", branchFilter);
      
      const data = await api.request(`/students?${query.toString()}`);
      const studentList = Array.isArray(data) ? data : (data.students || []);
      setStudents(studentList);
    } catch (error) {
      toast.error("Failed to load students directory");
    } finally {
      // Small delay to make the transition feel smoother
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        year: parseInt(formData.year),
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s !== "")
      };

      if (userProfile) {
        await api.request(`/students/${user?.username}`, {
          method: "PUT",
          body: payload
        });
        toast.success("Profile updated successfully");
      } else {
        await api.request("/students", {
          method: "POST",
          body: payload
        });
        toast.success("Profile created successfully");
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStudents = students;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Directory</h1>
          <p className="text-muted-foreground mt-1">
            Connect with your peers across different branches and years.
          </p>
        </div>
        {user?.role === 'student' && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto shadow-md transition-all active:scale-95 bg-primary hover:bg-primary/90">
                <UserPlus className="mr-2 h-4 w-4" />
                {userProfile ? "Edit My Profile" : "Create My Profile"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{userProfile ? "Edit Your Profile" : "Create Your Student Profile"}</DialogTitle>
                <DialogDescription>
                  This information will be visible to other students and faculty members.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveProfile} className="space-y-4 py-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNo">Roll Number</Label>
                      <Input id="rollNo" value={formData.rollNo} onChange={e => setFormData({...formData, rollNo: e.target.value})} required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Current Year</Label>
                      <Select value={formData.year} onValueChange={v => setFormData({...formData, year: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch">Department/Branch</Label>
                      <Select value={formData.branch} onValueChange={v => setFormData({...formData, branch: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intro">Short Bio</Label>
                    <Textarea 
                      id="intro" 
                      value={formData.intro} 
                      onChange={e => setFormData({...formData, intro: e.target.value})} 
                      placeholder="Tell us a bit about yourself..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input 
                      id="skills" 
                      value={formData.skills} 
                      onChange={e => setFormData({...formData, skills: e.target.value})} 
                      placeholder="React, Python, UI Design, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">College Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input id="linkedin" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Profile URL</Label>
                    <Input id="github" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} placeholder="https://github.com/..." />
                  </div>
                </div>
                <DialogFooter className="pt-4 gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : "Save Profile"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, username or skills..." 
                className="pl-10 bg-white border-slate-200"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Filter by Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Filter by Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="Information Technology">Information Technology</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-none shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-6 flex flex-row items-start gap-4 pb-4">
                <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
              <CardContent className="space-y-4 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex flex-wrap gap-1.5">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </CardContent>
              <div className="p-4 border-t border-slate-50 flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredStudents.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredStudents.map(student => (
            <motion.div key={student._id} variants={itemVariants}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all group flex flex-col h-full bg-white">
                <CardHeader className="flex flex-row items-start gap-4 pb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.username}`} />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {student.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg leading-none text-slate-900 group-hover:text-primary transition-colors">
                        {student.name}
                      </h3>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">@{student.username}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="secondary" className="text-[10px] h-5 px-2 bg-slate-100 text-slate-600 border-none font-bold">
                        Year {student.year}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] h-5 px-2 truncate max-w-[120px] border-slate-200 font-semibold">
                        {student.branch}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <p className="text-sm text-slate-600 line-clamp-3 italic leading-relaxed">
                    "{student.intro || "No bio provided yet."}"
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills.slice(0, 4).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-primary/5 text-primary text-[10px] font-bold border border-primary/10">
                        {skill}
                      </span>
                    ))}
                    {student.skills.length > 4 && (
                      <span className="text-[10px] text-muted-foreground flex items-center font-medium">
                        +{student.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50/50 border-t border-slate-50">
                  <div className="flex gap-3">
                    {student.linkedin && (
                      <a href={student.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {student.github && (
                      <a href={student.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors">
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {student.email && (
                      <a href={`mailto:${student.email}`} className="text-slate-400 hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-primary font-bold hover:bg-primary/10">
                    Profile
                    <ExternalLink className="ml-1.5 h-3 w-3" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed">
          <div className="bg-white p-6 rounded-full shadow-sm mb-4">
            <FilterX className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">No students found</h3>
          <p className="text-muted-foreground mt-2 max-w-xs">
            Try adjusting your filters or search query to find who you're looking for.
          </p>
          <Button variant="link" onClick={() => { setSearchQuery(""); setYearFilter("all"); setBranchFilter("all"); }} className="mt-4 font-bold">
            Clear all filters
          </Button>
        </div>
      )}
    </motion.div>
  );
}
