export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <a
        href="http://localhost:5000/auth/github"
        className="rounded-xl bg-black px-6 py-3 text-white"
      >
        Login with GitHub
      </a>
    </main>
  );
}