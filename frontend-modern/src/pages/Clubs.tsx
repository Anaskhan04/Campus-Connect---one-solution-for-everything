import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Code, 
  Cpu, 
  Laptop, 
  Plane, 
  Zap, 
  Settings,
  UserCircle2,
  GraduationCap
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const clubsData = [
  {
    id: 1,
    logo: "fas fa-code",
    icon: Code,
    name: "Student Developer Club",
    description: "Building the next generation of software engineers through collaborative projects and workshops.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhijeet",
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"],
    },
  },
  {
    id: 2,
    logo: "fas fa-microchip",
    icon: Cpu,
    name: "Internet of Things (IoT) Club",
    description: "Exploring the intersection of hardware and software with smart, connected devices.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhijeet",
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"],
    },
  },
  {
    id: 3,
    logo: "fas fa-laptop-code",
    icon: Laptop,
    name: "Web Development Club (WDC)",
    description: "Crafting beautiful and functional web experiences using modern technologies.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhijeet",
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"],
    },
  },
  {
    id: 4,
    logo: "fas fa-plane-departure",
    icon: Plane,
    name: "Drone Club",
    description: "Taking to the skies with autonomous flight and aerial photography.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhijeet",
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"],
    },
  },
  {
    id: 5,
    logo: "fas fa-bolt",
    icon: Zap,
    name: "IEEE Student Branch",
    description: "Advancing technology for humanity through technical excellence and networking.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhijeet",
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"],
    },
  },
  {
    id: 6,
    logo: "fas fa-cogs",
    icon: Settings,
    name: "MDAC Club",
    description: "Mastering Design and Analysis of Components through engineering principles.",
    color: "text-slate-600",
    bgColor: "bg-slate-50",
    facultyCoordinator: {
      name: "Mr. Abhijeet Singh",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Abhijeet",
    },
    mentors: {
      finalYear: ["Priya Patel", "Vikram Rathore", "Nikhil Sharma", "Sneha Verma", "Rajesh Kumar"],
      thirdYear: ["Ananya Singh", "Aryan Sharma", "Aditi Rao", "Mohit Agarwal", "Pooja Desai"],
    },
  },
];

export default function ClubsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Campus Clubs</h1>
        <p className="text-muted-foreground max-w-2xl">
          Join our student-led organizations to develop new skills, collaborate on projects, 
          and connect with like-minded peers.
        </p>
      </div>

      <div className="grid gap-6">
        <Accordion type="single" collapsible className="space-y-4">
          {clubsData.map((club) => (
            <AccordionItem 
              key={club.id} 
              value={`club-${club.id}`}
              className="border-none shadow-sm rounded-xl bg-white overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4 text-left">
                  <div className={`p-3 rounded-xl ${club.bgColor} ${club.color}`}>
                    <club.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{club.name}</h3>
                    <p className="text-sm text-muted-foreground font-normal line-clamp-1">{club.description}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <div className="grid gap-8 md:grid-cols-3 pt-4 border-t">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2 text-slate-900">
                      <UserCircle2 className="h-4 w-4 text-primary" />
                      Faculty Coordinator
                    </h4>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={club.facultyCoordinator.photo} />
                        <AvatarFallback>FC</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{club.facultyCoordinator.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Department Head</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2 text-slate-900">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      Final Year Mentors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {club.mentors.finalYear.map((mentor) => (
                        <Badge key={mentor} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none">
                          {mentor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2 text-slate-900">
                      <Users className="h-4 w-4 text-primary" />
                      Third Year Mentors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {club.mentors.thirdYear.map((mentor) => (
                        <Badge key={mentor} variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                          {mentor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
