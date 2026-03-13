import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, type Variants } from "framer-motion";
import { 
  Search, 
  Linkedin, 
  Mail, 
  GraduationCap,
  ExternalLink,
  Building2,
  UserCircle2,
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Alumni {
  _id: string;
  username: string;
  name: string;
  branch: string;
  graduationYear: number;
  currentRole: string;
  company: string;
  email: string;
  linkedin?: string;
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

export default function AlumniPage() {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    branch: "Information Technology",
    graduationYear: new Date().getFullYear(),
    currentRole: "",
    company: "",
    email: "",
    linkedin: ""
  });

  const userProfile = alumni.find(a => a.username === user?.username);

  useEffect(() => {
    fetchAlumni();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        branch: userProfile.branch || "Information Technology",
        graduationYear: userProfile.graduationYear || new Date().getFullYear(),
        currentRole: userProfile.currentRole || "",
        company: userProfile.company || "",
        email: userProfile.email || "",
        linkedin: userProfile.linkedin || ""
      });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.username,
        email: `${user.username}@example.edu`
      }));
    }
  }, [userProfile, user]);

  const fetchAlumni = async () => {
    setIsLoading(true);
    try {
      try {
        await api.request("/alumni/seed", { method: "POST" });
      } catch (e) {
        // Ignore seed errors
      }
      
      const data = await api.request("/alumni");
      const alumniList = Array.isArray(data) ? data : (data.alumni || []);
      
      setAlumni(alumniList.map((a: any) => ({
        ...a,
        graduationYear: a.graduationYear || a.year
      })));
    } catch (error) {
      toast.error("Failed to load alumni directory");
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (userProfile) {
        await api.request(`/alumni/${userProfile._id}`, {
          method: "PUT",
          body: { ...formData, username: user?.username }
        });
        toast.success("Profile updated successfully");
      } else {
        await api.request("/alumni", {
          method: "POST",
          body: { ...formData, username: user?.username }
        });
        toast.success("Profile created successfully");
      }
      setIsModalOpen(false);
      fetchAlumni();
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!userProfile) return;
    if (!confirm("Are you sure you want to delete your alumni profile?")) return;

    try {
      await api.request(`/alumni/${userProfile._id}`, { method: "DELETE" });
      toast.success("Profile deleted successfully");
      setIsModalOpen(false);
      fetchAlumni();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete profile");
    }
  };

  const filteredAlumni = alumni.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.currentRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = yearFilter === "all" || person.graduationYear.toString() === yearFilter;
    const matchesBranch = branchFilter === "all" || person.branch === branchFilter;
    
    return matchesSearch && matchesYear && matchesBranch;
  });

  const years = Array.from(new Set(alumni.map(a => a.graduationYear))).sort((a, b) => b - a);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alumni Network</h1>
          <p className="text-muted-foreground mt-1">
            Connect with our graduates and see where their journey has taken them.
          </p>
        </div>
        {user?.role === 'student' && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto shadow-md transition-all active:scale-95 bg-primary hover:bg-primary/90">
              <UserCircle2 className="mr-2 h-4 w-4" />
              {userProfile ? "Edit Your Alumni Profile" : "Add Your Alumni Profile"}
            </Button>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{userProfile ? "Edit Profile" : "Create Alumni Profile"}</DialogTitle>
                <DialogDescription>
                  Share your career journey with the campus community.
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
                      <Label htmlFor="branch">Branch</Label>
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
                    <div className="space-y-2">
                      <Label htmlFor="year">Graduation Year</Label>
                      <Input id="year" type="number" value={formData.graduationYear} onChange={e => setFormData({...formData, graduationYear: parseInt(e.target.value)})} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Current Role</Label>
                      <Input id="role" value={formData.currentRole} onChange={e => setFormData({...formData, currentRole: e.target.value})} placeholder="e.g. Software Engineer" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="e.g. Google" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input id="linkedin" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="URL" />
                  </div>
                </div>
                <DialogFooter className="gap-2 pt-2">
                  {userProfile && (
                    <Button type="button" variant="destructive" onClick={handleDeleteProfile} className="mr-auto">
                      Delete Profile
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
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
                placeholder="Search by name, role or company..." 
                className="pl-10 bg-white border-slate-200"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="bg-white border-slate-200">
                <SelectValue placeholder="Graduation Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-none shadow-sm flex flex-col h-full overflow-hidden">
              <div className="h-2 bg-slate-100 w-full" />
              <div className="p-6 flex flex-row items-center gap-4 pb-4">
                <Skeleton className="h-14 w-14 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-5 w-24" />
              </CardContent>
              <div className="p-4 border-t border-slate-50 flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredAlumni.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredAlumni.map(person => (
            <motion.div key={person._id} variants={itemVariants}>
              <Card className="border-none shadow-sm hover:shadow-lg transition-all group overflow-hidden flex flex-col h-full bg-white">
                <div className="h-2 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-14 w-14 border-2 border-white shadow-sm ring-1 ring-slate-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.username || person.name}`} />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {person.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-0.5">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors">{person.name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-1 font-medium">
                      <GraduationCap className="h-3 w-3" />
                      <span>Class of {person.graduationYear}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-700">{person.currentRole}</span>
                    </div>
                    <div className="ml-6 text-xs text-muted-foreground">
                      at <span className="font-bold text-primary">{person.company}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[10px] h-5 bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-bold">
                      {person.branch}
                    </Badge>
                  </div>
                </CardContent>
                <div className="flex items-center justify-between p-4 bg-slate-50/5 border-t border-slate-100 mt-auto">
                  <div className="flex gap-3">
                    {person.linkedin && (
                      <a href={person.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#0077b5] transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {person.email && (
                      <a href={`mailto:${person.email}`} className="text-slate-400 hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-primary font-bold hover:bg-primary/10 h-8">
                    Story
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
          <h3 className="text-xl font-semibold text-slate-900">No alumni found</h3>
          <p className="text-muted-foreground mt-2 max-w-xs">
            Try adjusting your filters to find graduates from different years or branches.
          </p>
          <Button 
            variant="outline" 
            onClick={() => { setSearchQuery(""); setYearFilter("all"); setBranchFilter("all"); }} 
            className="mt-6 font-bold"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </motion.div>
  );
}
