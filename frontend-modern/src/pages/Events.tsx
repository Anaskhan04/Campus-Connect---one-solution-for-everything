import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, type Variants } from "framer-motion";
import { 
  MapPin, 
  Clock, 
  Plus, 
  Search, 
  Loader2, 
  Trash2, 
  Edit2,
  CalendarDays,
  User,
  FilterX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  createdBy: string;
  image?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 260, damping: 20 }
  }
};

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const data = await api.request("/events");
      const list = Array.isArray(data) ? data : (data.events || []);
      setEvents(list);
    } catch (error: any) {
      toast.error("Failed to fetch events");
    } finally {
      setTimeout(() => setIsLoading(false), 400);
    }
  };

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      const eventDate = new Date(event.date);
      const formattedDate = eventDate.toISOString().split('T')[0];
      
      setFormData({
        title: event.title,
        description: event.description,
        date: formattedDate,
        time: event.time,
        location: event.location,
        organizer: event.organizer,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        organizer: user?.role === 'faculty' ? "Department of " + (user.username || "Faculty") : "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingEvent) {
        await api.request(`/events/${editingEvent._id}`, {
          method: "PUT",
          body: formData
        });
        toast.success("Event updated successfully");
      } else {
        await api.request("/events", {
          method: "POST",
          body: formData
        });
        toast.success("Event created successfully");
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || "Failed to save event");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.request(`/events/${id}`, { method: "DELETE" });
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Campus Events</h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Discover and join the latest happenings on campus.
          </p>
        </div>
        {user?.role === 'faculty' && (
          <Button onClick={() => handleOpenModal()} className="w-full md:w-auto shadow-md bg-primary hover:bg-primary/90 transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        )}
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search events by title, description or location..." 
          className="pl-10 h-12 shadow-sm bg-white border-slate-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-sm flex flex-col h-full overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <div className="pt-4 space-y-2 border-t border-slate-50">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredEvents.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredEvents.map((event) => (
            <motion.div key={event._id} variants={itemVariants}>
              <Card className="border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col bg-white h-full">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image || "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1.5 uppercase tracking-wider text-primary">
                    <User className="h-3 w-3" />
                    {event.organizer}
                  </div>
                  {user?.role === 'faculty' && event.createdBy === user.username && (
                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="h-8 w-8 bg-white/90 shadow-lg" 
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(event); }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="h-8 w-8 bg-red-500/90 shadow-lg" 
                        onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event._id); }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 font-semibold text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                    {new Intl.DateTimeFormat('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }).format(new Date(event.date))}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-50 space-y-2">
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700">{event.time || "TBA"}</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-700 line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 p-4 mt-auto">
                  <Button variant="outline" className="w-full h-10 text-xs font-bold border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:shadow-md">
                    RSVP & Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed">
          <div className="bg-white p-6 rounded-full shadow-sm mb-4">
            <FilterX className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">No events found</h3>
          <p className="text-muted-foreground mt-2 max-w-xs">
            We couldn't find any events matching your search criteria. Try a different keyword!
          </p>
          <Button variant="link" onClick={() => setSearchQuery("")} className="mt-4 font-bold">
            Clear Search
          </Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            <DialogDescription>
              Fill in the details below to publish an event to the campus community.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEvent} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Annual Tech Symposium" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="What is this event about?"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location / Venue</Label>
                <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Main Auditorium" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input id="organizer" value={formData.organizer} onChange={e => setFormData({...formData, organizer: e.target.value})} placeholder="e.g. IT Department" required />
              </div>
            </div>
            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving} className="min-w-[120px]">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (editingEvent ? "Update Event" : "Create Event")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
