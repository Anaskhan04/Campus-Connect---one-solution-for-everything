import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Navigation, 
  Map as MapIcon, 
  Info, 
  Building2, 
  Phone, 
  Globe,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CampusMapPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campus Map</h1>
          <p className="text-muted-foreground mt-1">
            Find your way around Rajkiya Engineering College, Banda.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.open('https://www.google.com/maps/dir//Rajkiya+Engineering+College,+Banda', '_blank')}>
          <Navigation className="mr-2 h-4 w-4" />
          Get Directions
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Map View */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden min-h-[500px] flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              Interactive View
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3604.832539389531!2d80.5136443150142!3d25.37699898381301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3983134a2338239b%3A0x534f5b533f6912f7!2sRajkiya%20Engineering%20College%2C%20Banda!5e0!3m2!1sen!2sin!4v1663586438575!5m2!1sen!2sin"
              className="w-full h-full min-h-[450px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </CardContent>
        </Card>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-sm text-slate-600">
                  Atarra, Banda, Uttar Pradesh 210201
                </p>
              </div>
              <div className="flex gap-3">
                <Building2 className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-sm text-slate-600">
                  Established in 2010 by Government of Uttar Pradesh.
                </p>
              </div>
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                <p className="text-sm text-slate-600">
                  +91-5191-286161
                </p>
              </div>
              <div className="flex gap-3">
                <Globe className="h-5 w-5 text-slate-400 shrink-0" />
                <a href="https://recbanda.ac.in" target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline flex items-center">
                  recbanda.ac.in
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Main Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Administrative Block
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Academic Blocks (IT, ME, EE)
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Central Library
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Student Hostels (A, B, C, Transit)
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Workshop & Labs
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Sports Ground
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
