import * as React from "react"
import {
  Calendar,
  FileText,
  User,
  Search,
  Loader2,
  BookOpen
} from "lucide-react"
import { Command } from "cmdk"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [results, setResults] = React.useState<{
    students?: any[];
    faculty?: any[];
    events?: any[];
    notices?: any[];
    resources?: any[];
  }>({
    students: [],
    faculty: [],
    events: [],
    notices: [],
    resources: [],
  })
  
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (!query) {
      setResults({ students: [], faculty: [], events: [], notices: [], resources: [] })
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await api.request(`/search?q=${query}`)
        setResults(data)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-64"
      >
        <span className="hidden lg:inline-flex">Search students, events...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg max-w-2xl border-0">
          <VisuallyHidden><DialogTitle>Global Search</DialogTitle></VisuallyHidden>
          <Command
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
            shouldFilter={false}
          >
            <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Type a command or search..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0 focus:ring-0"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            
            <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden pb-2">
              <Command.Empty className="py-6 text-center text-sm">
                {loading ? "Searching..." : "No results found."}
              </Command.Empty>

              {results.students && results.students.length > 0 && (
                <Command.Group heading="Students">
                  {results.students.map((student) => (
                    <Command.Item
                      key={student._id}
                      onSelect={() => runCommand(() => navigate("/students"))}
                      className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                    >
                      <User className="mr-2 h-4 w-4 text-blue-500" />
                      <span>{student.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({student.branch})</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {results.events && results.events.length > 0 && (
                <Command.Group heading="Events">
                  {results.events.map((event) => (
                    <Command.Item
                      key={event._id}
                      onSelect={() => runCommand(() => navigate("/events"))}
                      className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                    >
                      <Calendar className="mr-2 h-4 w-4 text-orange-500" />
                      <span>{event.title}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {results.notices && results.notices.length > 0 && (
                <Command.Group heading="Notices">
                  {results.notices.map((notice) => (
                    <Command.Item
                      key={notice._id}
                      onSelect={() => runCommand(() => navigate("/"))}
                      className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                    >
                      <FileText className="mr-2 h-4 w-4 text-green-500" />
                      <span>{notice.title}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {results.resources && results.resources.length > 0 && (
                <Command.Group heading="Resources">
                  {results.resources.map((resource) => (
                    <Command.Item
                      key={resource._id}
                      onSelect={() => runCommand(() => navigate("/resources"))}
                      className="flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                    >
                      <BookOpen className="mr-2 h-4 w-4 text-purple-500" />
                      <span>{resource.title}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
