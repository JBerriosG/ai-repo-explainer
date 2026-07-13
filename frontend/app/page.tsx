import Link from "next/dist/client/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center gap-4">
      <div className="text-center max-w-2xl bg-gray-700 p-8 rounded-xl shadow-md auto text-white">
        <h1 className="text-4xl font-bold text-center">AI Repository Explainer</h1>
        <p className="text-lg text-center mt-4">
          Generate comprehensive documentation for any repository in minutes.
        </p>
        <p className="text-lg text-center mt-4">
          AI Repository Explainer analyzes your project's source code, structure, dependencies, and architecture to automatically produce clear, organized documentation. Simply select a repository and start the analysis to receive a complete technical overview.
        </p>
      </div>
      <a
        href="http://localhost:5000/auth/github"
        className="rounded-xl bg-gray-900 px-6 py-3 text-white"
      >
        Connect with GitHub
      </a>
    </main>
  );
}