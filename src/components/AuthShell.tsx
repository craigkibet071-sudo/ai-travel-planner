export default function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="animated-gradient flex min-h-[calc(100vh-3.6rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl bg-white/90 p-8 text-gray-900 shadow-xl backdrop-blur dark:bg-gray-950/90 dark:text-gray-100">
        <h1 className="mb-6 text-3xl font-bold">{title}</h1>
        {children}
      </div>
    </main>
  );
}