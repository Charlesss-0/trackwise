'use client'

import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export function ThemeToggle(): React.ReactNode {
	const { theme, setTheme } = useTheme()

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			className="relative overflow-hidden"
		>
			<Sun className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-200 ease-in-out translate-x-0 opacity-100 dark:translate-x-[1.5rem] dark:opacity-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all duration-200 ease-in-out translate-x-[1.5rem] opacity-0 dark:translate-x-0 dark:opacity-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
