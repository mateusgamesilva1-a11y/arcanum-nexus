import { Sun, Moon, Droplet, Zap, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  // Define qual ícone/emoji mostrar no gatilho com base no tema selecionado
  const renderTriggerIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
      case "blood":
        return <Droplet className="h-[1.2rem] w-[1.2rem] text-rose-600" />
      case "neon":
        return <Zap className="h-[1.2rem] w-[1.2rem] text-purple-400" />
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative size-9 rounded-xl shadow-sm">
          {renderTriggerIcon()}
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 font-sans">
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 font-medium">
          <Sun className="size-4 text-amber-500" /> Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 font-medium">
          <Moon className="size-4 text-blue-400" /> Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("blood")} className="gap-2 font-medium">
          <Droplet className="size-4 text-rose-600" /> Sangue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("neon")} className="gap-2 font-medium">
          <Zap className="size-4 text-purple-400" /> Neon
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 font-medium">
          <Monitor className="size-4 text-muted-foreground" /> Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}