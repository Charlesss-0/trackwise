'use client'

import { Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

export function ThemeToggle(): React.ReactNode {
	const { theme, setTheme } = useTheme()

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			className="relative border border-base-300 dark:border-base-300-dark"
		>
			<Sun className="absolute text-yellow-800 opacity-100 dark:opacity-0" size={22} />
			<Moon className="absolute opacity-0 text-sky-800 dark:opacity-100" size={22} />
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
