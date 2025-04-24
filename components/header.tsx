import Login from "@/components/login";

export function Header() {
  return (
    <header className="sticky px-10 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div>
          <span className="text-xl font-bold">Email Time Capsule</span>
        </div>
        <div>
          <Login />
        </div>
      </div>
    </header>
  );
}
