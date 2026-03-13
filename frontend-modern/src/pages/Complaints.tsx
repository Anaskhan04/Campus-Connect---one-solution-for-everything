import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  AlertCircle, 
  MessageSquarePlus, 
  History, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  Send,
  MoreVertical,
  Loader2
} from "lucide-react";

interface Complaint {
  _id: string;
  category: string;
  subCategory?: string;
  subject: string;
  description: string;
  status: "Pending" | "In-Progress" | "Resolved" | "Closed";
  isAnonymous: boolean;
  createdAt: string;
}

const CATEGORIES = {
  "Academic": ["Grading", "Faculty", "Course Content", "Schedule"],
  "Infrastructure": ["Hostel", "Canteen", "Lab Equipment", "Classroom"],
  "Administrative": ["Fees", "Documentation", "Scholarship", "ID Card"],
  "Other": ["General", "Security", "IT Support"]
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSaving] = useState(false);

  // Form State
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const data = await api.request("/complaints");
      setComplaints(data);
    } catch (error) {
      toast.error("Failed to fetch your complaints");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !subject || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      await api.request("/complaints", {
        method: "POST",
        body: {
          category,
          subCategory,
          subject,
          description,
          isAnonymous
        }
      });
      toast.success("Complaint submitted successfully!");
      // Reset form
      setCategory("");
      setSubCategory("");
      setSubject("");
      setDescription("");
      setIsAnonymous(false);
      fetchComplaints();
    } catch (error) {
      toast.error("Failed to submit complaint");
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pending": return "warning";
      case "In-Progress": return "info";
      case "Resolved": return "success";
      case "Closed": return "secondary";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending": return <Clock className="h-3 w-3 mr-1" />;
      case "In-Progress": return <Loader2 className="h-3 w-3 mr-1 animate-spin" />;
      case "Resolved": return <CheckCircle2 className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaint System</h1>
          <p className="text-muted-foreground mt-1">
            Voice your concerns and track their resolution status.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Submit Form */}
        <Card className="lg:col-span-2 border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5 text-primary" />
              New Complaint
            </CardTitle>
            <CardDescription>
              Submit a formal grievance to the administration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={v => { setCategory(v); setSubCategory(""); }}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORIES).map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {category && (
                <div className="grid gap-2 animate-in slide-in-from-top-2 duration-200">
                  <Label htmlFor="subCategory">Sub-category</Label>
                  <Select value={subCategory} onValueChange={setSubCategory}>
                    <SelectTrigger id="subCategory">
                      <SelectValue placeholder="Specify issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES[category as keyof typeof CATEGORIES].map(sub => (
                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  placeholder="Brief title of the issue" 
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Please provide as much detail as possible..." 
                  className="min-h-[120px]"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="anonymous" 
                  checked={isAnonymous}
                  onCheckedChange={(v: boolean) => setIsAnonymous(v)}
                />
                <label
                  htmlFor="anonymous"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Submit Anonymously
                </label>
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Complaint
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* History / Tracker */}
        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Your Submissions
            </CardTitle>
            <CardDescription>
              Track the progress of your previously submitted complaints.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-slate-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : complaints.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <ShieldAlert className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="font-semibold">No complaints found</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  You haven't submitted any complaints yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map(complaint => (
                  <div 
                    key={complaint._id} 
                    className="group relative flex flex-col gap-3 p-4 rounded-xl border bg-card hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusVariant(complaint.status)} className="font-medium">
                            {getStatusIcon(complaint.status)}
                            {complaint.status}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(complaint.createdAt))}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {complaint.subject}
                        </h4>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 italic">
                      "{complaint.description}"
                    </p>
                    
                    <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {complaint.category} {complaint.subCategory ? `› ${complaint.subCategory}` : ''}
                      </div>
                      {complaint.isAnonymous && (
                        <Badge variant="outline" className="text-[9px] h-4 bg-slate-100 border-none">
                          Anonymous
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
