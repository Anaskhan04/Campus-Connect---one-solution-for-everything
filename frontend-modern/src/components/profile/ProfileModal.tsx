import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Camera, X } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstTime?: boolean;
}

export function ProfileModal({ isOpen, onClose, isFirstTime = false }: ProfileModalProps) {
  const { user, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    year: "1",
    branch: "Information Technology",
    intro: "",
    skills: "",
    linkedin: "",
    github: "",
    email: "",
    profileImage: "",
  });

  useEffect(() => {
    if (isOpen && user) {
      // If editing, we should ideally fetch the current student data.
      // But for now, we'll initialize with what we have.
      const fetchStudentData = async () => {
        try {
          if (user.role === 'student') {
             const data = await api.request(`/students/${user.username}`);
             if (data) {
               setFormData({
                 name: data.name || "",
                 rollNo: data.rollNo || "",
                 year: data.year?.toString() || "1",
                 branch: data.branch || "Information Technology",
                 intro: data.intro || "",
                 skills: (data.skills || []).join(", "),
                 linkedin: data.linkedin || "",
                 github: data.github || "",
                 email: data.email || user.email || "",
                 profileImage: user.profileImage || "",
               });
               return;
             }
          }
           setFormData(prev => ({
            ...prev,
            name: user.username,
            email: user.email || "",
            profileImage: user.profileImage || "",
          }));
        } catch (error) {
          console.error("Failed to fetch student data:", error);
          setFormData(prev => ({
            ...prev,
            name: user.username,
            email: user.email || "",
            profileImage: user.profileImage || "",
          }));
        }
      };
      
      fetchStudentData();
    }
  }, [isOpen, user]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await api.uploadImage(file);
      await api.updateProfileImage(result.url);
      setFormData(prev => ({ ...prev, profileImage: result.url }));
      if (user) updateUser({ ...user, profileImage: result.url });
      toast.success("Profile picture updated");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateProfile(formData);
      if (user) {
        updateUser({ 
          ...user, 
          isProfileSetup: true,
          profileImage: formData.profileImage 
        });
      }
      toast.success(isFirstTime ? "Profile setup complete!" : "Profile updated!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSaving && (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{isFirstTime ? "Complete Your Profile" : "Edit Profile"}</DialogTitle>
            {!isFirstTime && (
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <DialogDescription>
            {isFirstTime 
              ? "Welcome to Campus Connect! Please fill in your details to get started." 
              : "Keep your profile up to date for better networking."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-primary/10 shadow-md">
                <AvatarImage src={formData.profileImage} />
                <AvatarFallback className="text-2xl">
                  {formData.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="text-white h-6 w-6" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground font-medium">Click to change profile picture</p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNo">Roll Number</Label>
                <Input 
                  id="rollNo" 
                  value={formData.rollNo} 
                  onChange={e => setFormData({...formData, rollNo: e.target.value})} 
                  required 
                  placeholder="e.g. 21IT001"
                />
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
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
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
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input 
                  id="linkedin" 
                  value={formData.linkedin} 
                  onChange={e => setFormData({...formData, linkedin: e.target.value})} 
                  placeholder="https://linkedin.com/in/..." 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub Profile URL</Label>
              <Input 
                id="github" 
                value={formData.github} 
                onChange={e => setFormData({...formData, github: e.target.value})} 
                placeholder="https://github.com/..." 
              />
            </div>
          </div>

          <DialogFooter className="pt-4 gap-2">
            {!isFirstTime && (
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
            )}
            {isFirstTime && (
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
                Skip for now
              </Button>
            )}
            <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 shadow-md">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isFirstTime ? "Complete Profile" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
