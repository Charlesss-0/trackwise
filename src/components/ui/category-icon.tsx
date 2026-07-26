"use client";

import type { LucideIcon } from "lucide-react";
import {
	Briefcase,
	Car,
	Coffee,
	CreditCard,
	Dumbbell,
	Film,
	Fuel,
	Gamepad2,
	Gift,
	GraduationCap,
	Heart,
	Home,
	Music,
	Phone,
	PiggyBank,
	Plane,
	Shirt,
	ShoppingBag,
	Tag,
	Tv,
	Utensils,
	Zap,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
	Utensils,
	Home,
	Car,
	CreditCard,
	Gamepad2,
	Heart,
	ShoppingBag,
	Zap,
	GraduationCap,
	Plane,
	Music,
	Gift,
	Coffee,
	Dumbbell,
	Briefcase,
	Phone,
	Tv,
	PiggyBank,
	Fuel,
	Shirt,
	Tag,
	Film,
};

type CategoryIconProps = {
	name: string;
	color?: string;
	size?: number;
	className?: string;
};

export function CategoryIcon({ name, color, size = 20, className = "" }: CategoryIconProps) {
	const formattedName = name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
		.join("");

	const Icon = ICON_MAP[formattedName] ?? Tag;

	return <Icon size={size} style={color ? { color } : undefined} className={className} />;
}
