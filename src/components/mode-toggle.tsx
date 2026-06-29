import { Moon, Sun, Droplet, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 blood:scale-0 blood:-rotate-90 neon:scale-0 neon:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 blood:scale-0 blood:rotate-90 neon:scale-0 neon:rotate-90" />
          <Droplet className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all blood:scale-100 blood:rotate-0" />
          <Zap className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all neon:scale-100 neon:rotate-0" />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="size-4" /> Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="size-4" /> Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("blood")}>
          <Droplet className="size-4" /> Sangue
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("neon")}>
          <Zap className="size-4" /> Neon
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
