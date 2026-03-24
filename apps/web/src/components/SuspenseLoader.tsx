export function SuspenseLoader() {
  return (
    <div className="absolute inset-x-0 top-0 z-50 h-0.5 overflow-hidden">
      <div className="h-full w-full animate-route-progress bg-primary-500/80" />
    </div>
  );
}
