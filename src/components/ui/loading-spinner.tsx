import { LoaderCircle } from "lucide-react";
import { twMerge } from "@/utils/tw-merge";

type LoadingSpinnerProps = { size?: "xs" | "sm" | "md" | "lg"; className?: string };
export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
	return (
		<span role="status" className={twMerge("inline-flex items-center justify-center", className)}>
			<LoaderCircle aria-hidden="true" className={twMerge("animate-spin", { xs: "size-3", sm: "size-4", md: "size-5", lg: "size-7" }[size])} />
			<span className="sr-only">Loading</span>
		</span>
	);
}
