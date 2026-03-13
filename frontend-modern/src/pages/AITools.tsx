import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  PenTool, 
  Image as ImageIcon, 
  Code2, 
  Video, 
  Lightbulb, 
  Search, 
  ArrowUpRight,
  Sparkles
} from "lucide-react";

const aiToolsData = {
  writing: [
    { name: 'ChatGPT', url: 'https://chat.openai.com/', domain: 'openai.com' },
    { name: 'Google Gemini', url: 'https://gemini.google.com/', domain: 'google.com' },
    { name: 'Perplexity AI', url: 'https://www.perplexity.ai/', domain: 'perplexity.ai' },
    { name: 'QuillBot', url: 'https://quillbot.com/', domain: 'quillbot.com' },
    { name: 'Notion AI', url: 'https://www.notion.so/product/ai', domain: 'notion.so' },
  ],
  image: [
    { name: 'Midjourney', url: 'https://www.midjourney.com/', domain: 'midjourney.com' },
    { name: 'DALL-E 3', url: 'https://www.bing.com/images/create', domain: 'bing.com' },
    { name: 'Leonardo.Ai', url: 'https://leonardo.ai/', domain: 'leonardo.ai' },
    { name: 'Adobe Firefly', url: 'https://www.adobe.com/sensei/generative-ai/firefly.html', domain: 'adobe.com' },
    { name: 'Stable Diffusion', url: 'https://stablediffusionweb.com/', domain: 'stablediffusionweb.com' },
  ],
  code: [
    { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', domain: 'github.com' },
    { name: 'Tabnine', url: 'https://www.tabnine.com/', domain: 'tabnine.com' },
    { name: 'Replit Ghostwriter', url: 'https://replit.com/ghostwriter', domain: 'replit.com' },
    { name: 'Amazon CodeWhisperer', url: 'https://aws.amazon.com/codewhisperer/', domain: 'amazon.com' },
    { name: 'Blackbox AI', url: 'https://www.blackbox.ai/', domain: 'blackbox.ai' },
  ],
  videoAudio: [
    { name: 'RunwayML', url: 'https://runwayml.com/', domain: 'runway.com' },
    { name: 'Descript', url: 'https://www.descript.com/', domain: 'descript.com' },
    { name: 'ElevenLabs', url: 'https://elevenlabs.io/', domain: 'elevenlabs.io' },
    { name: 'Adobe Podcast', url: 'https://podcast.adobe.com/', domain: 'adobe.com' },
    { name: 'Synthesia', url: 'https://www.synthesia.io/', domain: 'synthesia.io' },
  ],
  productivity: [
    { name: 'Consensus', url: 'https://consensus.app/', domain: 'consensus.app' },
    { name: 'Elicit.org', url: 'https://elicit.org/', domain: 'elicit.org' },
    { name: 'SciSpace', url: 'https://typeset.io/', domain: 'typeset.io' },
    { name: 'Gamma', url: 'https://gamma.app/', domain: 'gamma.app' },
    { name: 'Tome', url: 'https://tome.app/', domain: 'tome.app' },
  ],
};

const getLogoUrl = (domain: string) => `https://logo.clearbit.com/${domain}`;

export default function AIToolsPage() {
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
          {filtered.map((tool) => (
            <a 
              key={tool.name} 
              href={tool.url} 
              target="_blank" 
              rel="noreferrer"
              className="group"
            >
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-white overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="h-14 w-14 mb-3 relative flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 group-hover:border-primary/20 transition-colors">
                    <img 
                      src={getLogoUrl(tool.domain)} 
                      alt={tool.name} 
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name}&background=random`;
                      }}
                    />
                  </div>
                  <p className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors line-clamp-1">
                    {tool.name}
                  </p>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[10px] text-primary font-bold uppercase tracking-wider">
                    Open Tool <ArrowUpRight className="ml-1 h-3 w-3" />
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
            <Sparkles className="h-5 w-5 fill-current" />
            <span className="text-sm font-bold uppercase tracking-wider">Academic Resources</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">AI Tools Directory</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Boost your productivity and learning with the best artificial intelligence 
            tools curated for students and faculty.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search AI tools..." 
            className="pl-10 h-12 bg-white shadow-sm border-slate-200"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-12">
        {renderSection("Text & Writing Assistants", PenTool, aiToolsData.writing, "bg-blue-600")}
        {renderSection("Image Generation", ImageIcon, aiToolsData.image, "bg-purple-600")}
        {renderSection("Code & Development", Code2, aiToolsData.code, "bg-emerald-600")}
        {renderSection("Video & Audio Tools", Video, aiToolsData.videoAudio, "bg-orange-600")}
        {renderSection("Productivity & Research", Lightbulb, aiToolsData.productivity, "bg-pink-600")}
      </div>

      {!searchQuery && (
        <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative p-8 text-center">
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold">Have a tool to suggest?</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              We're always looking for new AI tools that can help our campus community. 
              Contact the IT department to suggest a new addition.
            </p>
            <Button variant="outline" className="bg-transparent border-slate-700 hover:bg-slate-800 text-white">
              Suggest a Tool
            </Button>
          </div>
          <Bot className="absolute -right-10 -bottom-10 h-64 w-64 text-slate-800 opacity-50" />
        </Card>
      )}
    </div>
  );
}
