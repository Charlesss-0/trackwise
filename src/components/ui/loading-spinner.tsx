type LoadingSpinnerProps = {
	size?: "xs" | "sm" | "md" | "lg";
	className?: string;
};

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
	return (
		<div className={`flex items-center justify-center ${className}`}>
			<span className={`loading loading-spinner loading-${size}`} />
		</div>
	);
}
