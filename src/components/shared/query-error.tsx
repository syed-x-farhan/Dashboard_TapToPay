"use client";

interface QueryErrorProps {
  refetch: () => void;
}

export function QueryError({ refetch }: QueryErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-destructive mb-4">Failed to load data</p>
      <button
        type="button"
        onClick={() => refetch()}
        className="text-sm text-muted-foreground hover:text-primary"
      >
        Try again
      </button>
    </div>
  );
}
