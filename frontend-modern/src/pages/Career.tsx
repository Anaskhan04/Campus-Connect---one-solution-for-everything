import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  Search, 
  Building2, 
  Globe,
  ArrowUpRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const careerData = {
  jobs: [
    { name: 'Naukri.com', url: 'https://www.naukri.com/', domain: 'naukri.com' },
    { name: 'Indeed', url: 'https://www.indeed.com/', domain: 'indeed.com' },
    { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/', domain: 'linkedin.com' },
    { name: 'Hired', url: 'https://hired.com/', domain: 'hired.com' },
    { name: 'Glassdoor', url: 'https://www.glassdoor.com/', domain: 'glassdoor.com' },
  ],
  internships: [
    { name: 'Internshala', url: 'https://internshala.com/', domain: 'internshala.com' },
    { name: 'LetsIntern', url: 'https://www.letsintern.com/', domain: 'letsintern.com' },
    { name: 'AngelList', url: 'https://angel.co/internships', domain: 'wellfound.com' },
    { name: 'HelloIntern', url: 'https://www.hellointern.com/', domain: 'hellointern.com' },
  ],
  freelance: [
    { name: 'Upwork', url: 'https://www.upwork.com/', domain: 'upwork.com' },
    { name: 'Freelancer', url: 'https://www.freelancer.com/', domain: 'freelancer.com' },
    { name: 'Fiverr', url: 'https://www.fiverr.com/', domain: 'fiverr.com' },
    { name: 'Toptal', url: 'https://www.toptal.com/', domain: 'toptal.com' },
  ]
};

const getLogoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;

export default function CareerPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const renderSection = (title: string, icon: any, data: any[], color: string) => {
    const filtered = data.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${color} bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
            {React.createElement(icon, { className: "h-5 w-5" })}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <Badge variant="outline" className="ml-2 bg-white font-bold">{filtered.length}</Badge>
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((site) => (
            <a 
              key={site.name} 
              href={site.url} 
              target="_blank" 
              rel="noreferrer"
              className="group"
            >
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-white overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-14 w-14 mb-3 relative flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 group-hover:border-primary/20 transition-colors">
                    <img 
                      src={getLogoUrl(site.domain)} 
                      alt={site.name} 
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${site.name}&background=random`;
                      }}
                    />
                  </div>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors line-clamp-1">
                    {site.name}
                  </p>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[10px] text-primary font-bold uppercase tracking-wider">
                    Visit Portal <ArrowUpRight className="ml-1 h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider text-primary">Career Development</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Placement & Career Portal</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Connect with leading job boards, internship portals, and freelance platforms 
            to kickstart your professional career.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search portals..." 
            className="pl-10 h-12 bg-white shadow-sm border-slate-200"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-12">
        {renderSection("Job Portals", Building2, careerData.jobs, "bg-blue-600")}
        {renderSection("Internship Portals", Award, careerData.internships, "bg-emerald-600")}
        {renderSection("Freelance Platforms", Globe, careerData.freelance, "bg-purple-600")}
      </div>

      {!searchQuery && (
        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative p-8">
          <div className="relative z-10 space-y-4 max-w-lg">
            <h3 className="text-2xl font-bold">Preparation is key to success</h3>
            <p className="text-primary-foreground/80 leading-relaxed font-medium">
              Don't just apply—prepare! Check out our Resources section for interview 
              transcripts, technical notes, and past placement papers.
            </p>
            <Button variant="secondary" className="font-bold shadow-lg shadow-black/10">
              Browse Preparation Materials
            </Button>
          </div>
          <Briefcase className="absolute -right-10 -bottom-10 h-64 w-64 text-white/10 -rotate-12" />
        </Card>
      )}
    </div>
  );
}
