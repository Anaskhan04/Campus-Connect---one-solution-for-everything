import { useEffect, useState } from "react";
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
  Mail, 
  ExternalLink,
  Microscope,
  Briefcase,
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

interface Faculty {
  _id: string;
  username: string;
  name: string;
  branch: string;
  designation: string;
  email: string;
  research: string;
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

export default function FacultyPage() {
  const { user } = useAuth();
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    branch: "Information Technology",
    designation: "Assistant Professor",
    research: "",
    email: ""
  });

  const userProfile = facultyList.find(f => f.username === user?.username);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFaculty();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, branchFilter]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        branch: userProfile.branch || "Information Technology",
        designation: userProfile.designation || "Assistant Professor",
        research: userProfile.research || "",
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

  const fetchFaculty = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchQuery) query.append("q", searchQuery);
      if (branchFilter !== "all") query.append("branch", branchFilter);
      
      const data = await api.request(`/faculty?${query.toString()}`);
      const list = Array.isArray(data) ? data : (data.faculty || []);
      setFacultyList(list);
    } catch (error) {
      toast.error("Failed to load faculty directory");
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (userProfile) {
        await api.request(`/faculty/${user?.username}`, {
          method: "PUT",
          body: formData
        });
        toast.success("Profile updated successfully");
      } else {
        await api.request("/faculty", {
          method: "POST",
          body: formData
        });
        toast.success("Profile created successfully");
      }
      setIsModalOpen(false);
      fetchFaculty();
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredFaculty = facultyList;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faculty Directory</h1>
          <p className="text-muted-foreground mt-1">
            Learn about our esteemed faculty members and their research areas.
          </p>
        </div>
        {user?.role === 'faculty' && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto shadow-md transition-all active:scale-95 bg-primary hover:bg-primary/90">
                <Briefcase className="mr-2 h-4 w-4" />
                {userProfile ? "Update My Profile" : "Create My Profile"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{userProfile ? "Edit Faculty Profile" : "Create Faculty Profile"}</DialogTitle>
                <DialogDescription>
                  Share your expertise and research areas with the community.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveProfile} className="space-y-4 py-4">
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Select value={formData.designation} onValueChange={v => setFormData({...formData, designation: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professor">Professor</SelectItem>
                          <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                          <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                          <SelectItem value="Head of Department">Head of Department</SelectItem>
                          <SelectItem value="Lecturer">Lecturer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="branch">Department</Label>
                      <Select value={formData.branch} onValueChange={v => setFormData({...formData, branch: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Information Technology">Information Technology</SelectItem>
                          <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                          <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="research">Research Interests</Label>
                    <Textarea id="research" value={formData.research} onChange={e => setFormData({...formData, research: e.target.value})} placeholder="Keywords or brief description..." className="min-h-[100px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Official Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, designation or research interests..." 
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
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
              <div className="h-2 bg-slate-100 w-full" />
              <div className="p-6 flex flex-row items-center gap-4 pb-4">
                <Skeleton className="h-14 w-14 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <div className="p-4 border-t border-slate-50 flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredFaculty.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {filteredFaculty.map(faculty => (
            <motion.div key={faculty._id} variants={itemVariants}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col h-full bg-white">
                <div className="h-2 bg-primary/10 group-hover:bg-primary/20 transition-colors w-full" />
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <Avatar className="h-14 w-14 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${faculty.name}`} />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {faculty.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-0.5">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">
                      {faculty.name}
                    </h3>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">{faculty.designation}</p>
                    <Badge variant="outline" className="text-[10px] h-5 mt-1 bg-slate-50/50 border-slate-200">
                      {faculty.branch}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Microscope className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Research Interests</p>
                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                          {faculty.research || "Information coming soon."}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50/5 border-t border-slate-100 mt-auto">
                  <a 
                    href={`mailto:${faculty.email}`} 
                    className="flex items-center text-xs font-bold text-slate-500 hover:text-primary transition-colors"
                  >
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    {faculty.email || "Contact via portal"}
                  </a>
                  <Button variant="ghost" size="sm" className="text-xs text-primary font-bold hover:bg-primary/10 h-8">
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
          <h3 className="text-xl font-semibold text-slate-900">No faculty members found</h3>
          <p className="text-muted-foreground mt-2 max-w-xs">
            We couldn't find any faculty members matching your criteria.
          </p>
          <Button variant="link" onClick={() => { setSearchQuery(""); setBranchFilter("all"); }} className="mt-4 font-bold">
            Clear filters
          </Button>
        </div>
      )}
    </motion.div>
  );
}
