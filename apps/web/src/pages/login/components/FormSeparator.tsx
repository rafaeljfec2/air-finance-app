export function FormSeparator() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border dark:border-border-dark"></div>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card dark:bg-card-dark px-2 text-text/60 dark:text-text-dark/60">
          Ou
        </span>
      </div>
    </div>
  );
}
