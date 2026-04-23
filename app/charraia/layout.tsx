export default function CharraiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="junino" className="flex flex-1 flex-col bg-background text-foreground">
      {children}
    </div>
  );
}
