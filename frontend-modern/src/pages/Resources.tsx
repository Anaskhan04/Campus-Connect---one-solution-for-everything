import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Upload, 
  Download, 
  Trash2, 
  Loader2,
  FileIcon,
  User
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

interface Resource {
  _id: string;
  title: string;
  description: string;
  branch: string;
  year: string;
  fileName: string;
  fileData: string;
  uploadedBy: string;
  createdAt: string;
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newBranch, setNewBranch] = useState("");
  const [newYear, setNewYear] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources();
    }, 300);
    return () => clearTimeout(timer);
  }, [branchFilter, yearFilter, searchQuery]);

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (branchFilter !== "all") query.append("branch", branchFilter);
      if (yearFilter !== "all") query.append("year", yearFilter);
      if (searchQuery) query.append("q", searchQuery);
      
      const data = await api.request(`/resources?${query.toString()}`);
      setResources(Array.isArray(data) ? data : data.resources || []);
    } catch (error) {
      toast.error("Failed to load resources");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newBranch || !newYear || !selectedFile) {
      toast.error("Please fill in all fields and select a file");
      return;
    }

    setIsUploading(true);
    try {
      const base64File = await convertToBase64(selectedFile);
      await api.request("/resources", {
        method: "POST",
        body: {
          title: newTitle,
          description: newDescription,
          branch: newBranch,
          year: newYear,
          fileName: selectedFile.name,
          fileData: base64File
        }
      });
      
      toast.success("Resource uploaded successfully!");
      setIsUploadModalOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewBranch("");
      setNewYear("");
      setSelectedFile(null);
      fetchResources();
    } catch (error) {
      toast.error("Failed to upload resource");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    
    try {
      await api.request(`/resources/${id}`, { method: "DELETE" });
      toast.success("Resource deleted");
      fetchResources();
    } catch (error) {
      toast.error("Failed to delete resource");
    }
  };

  const downloadFile = (resource: Resource) => {
    const link = document.createElement("a");
    link.href = resource.fileData;
    link.download = resource.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredResources = resources;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shared Resources</h1>
          <p className="text-muted-foreground mt-1">
            Access and share study materials, notes, and previous year questions.
          </p>
        </div>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Resource
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload New Resource</DialogTitle>
              <DialogDescription>
                Share your materials with the campus community.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Data Structures Notes - Unit 1" 
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                  id="desc" 
                  placeholder="Briefly describe what's in this resource..." 
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Branch</Label>
                  <Select value={newBranch} onValueChange={setNewBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Information Technology">IT</SelectItem>
                      <SelectItem value="Electrical Engineering">Electrical</SelectItem>
                      <SelectItem value="Mechanical Engineering">Mechanical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Year</Label>
                  <Select value={newYear} onValueChange={setNewYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" onChange={handleFileChange} />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full" disabled={isUploading}>
                  {isUploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : "Confirm Upload"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title or description..." 
            className="pl-10"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="Information Technology">IT</SelectItem>
              <SelectItem value="Electrical Engineering">Electrical</SelectItem>
              <SelectItem value="Mechanical Engineering">Mechanical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="1">Year 1</SelectItem>
              <SelectItem value="2">Year 2</SelectItem>
              <SelectItem value="3">Year 3</SelectItem>
              <SelectItem value="4">Year 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-48 animate-pulse bg-slate-50 border-none" />
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map(resource => (
            <Card key={resource._id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <FileIcon className="h-6 w-6" />
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="secondary" className="text-[9px] uppercase font-bold">{resource.branch}</Badge>
                    <Badge variant="outline" className="text-[9px] font-bold">Year {resource.year}</Badge>
                  </div>
                </div>
                <CardTitle className="mt-4 line-clamp-1 group-hover:text-primary transition-colors text-lg font-bold">
                  {resource.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px] font-medium text-slate-500">
                  {resource.description || "No description provided."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-slate-50 p-2 rounded-md font-medium">
                  <User className="h-3 w-3" />
                  <span>Uploaded by <span className="font-bold text-slate-900">{resource.uploadedBy}</span></span>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 bg-slate-50/30 gap-2">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex-1 font-bold h-9"
                  onClick={() => downloadFile(resource)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                {user?.username === resource.uploadedBy && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(resource._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-slate-100 p-6 rounded-full mb-4">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold">No resources found</h3>
          <p className="text-muted-foreground mt-2 max-w-xs">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="link" onClick={() => { setSearchQuery(""); setBranchFilter("all"); setYearFilter("all"); }} className="mt-4 font-bold">
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
