export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">{title}</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">Last updated: {updatedAt}</p>
      <div className="mt-6 space-y-4 text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </article>
  );
}
