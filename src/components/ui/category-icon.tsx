"use client";

import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Car,
  Coffee,
  CreditCard,
  Dumbbell,
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
};

type CategoryIconProps = {
  name: string;
  color?: string;
  size?: number;
  className?: string;
};

export function CategoryIcon({ name, color, size = 20, className = "" }: CategoryIconProps) {
  const Icon = ICON_MAP[name] ?? Tag;

  return <Icon size={size} style={color ? { color } : undefined} className={className} />;
}
