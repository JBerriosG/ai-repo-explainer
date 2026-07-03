"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {

  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {

    fetch(
      "http://localhost:5000/github/repos",
      {
        credentials: "include"
      }
    )
      .then(res => {
        if (res.status === 401) {
          window.location.href = "http://localhost:5000/auth/github";
          return [];
        }
        return res.json();
      })
      .then(data => {

        if (Array.isArray(data)) {
          setRepos(data);
        } else {
          console.error(data);
          setRepos([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleAnalyze = (repo: any) => {
    try {
      fetch(
        `http://localhost:5000/github/repos/${repo.owner.login}/${repo.name}/analyze`,
        {
          credentials: "include"
        }
      )
        .then(res => res.json())
        .then(data => {
          setAnalysis(data);
          console.log("Analysis result:", data);
        });
    } catch (error) {
      console.error("Error analyzing repository:", error);
    }
  };
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 my-6 mx-6">

      {repos.map((repo: any) => (

        <div
          key={repo.id}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
        >

          {/* HEADER */}
          <div className="flex flex-1 items-start justify-between p-5">

            <div className="flex-1">

              <div className="mb-2 flex items-center gap-2">

                <h2 className="text-lg font-semibold text-gray-900">
                  {repo.name}
                </h2>

                <span className="
              rounded-full
              bg-green-100
              px-2
              py-1
              text-xs
              font-medium
              text-green-700
            ">
                  {repo.private ? "Private" : "Public"}
                </span>

              </div>

              <p className="line-clamp-2 text-sm text-gray-500">
                {repo.description || "No description"}
              </p>

            </div>

          </div>

          {/* FOOTER */}
          <div className="grid grid-cols-2 border-t border-gray-200">

            <a
              href={repo.html_url}
              target="_blank"
              className="
            flex
            items-center
            justify-center
            gap-2
            border-r
            border-gray-200
            p-4
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
          "
            >
              <span>🔗</span>
              Repository
            </a>

            <button
              onClick={() => handleAnalyze(repo)}
              className="
            flex
            items-center
            justify-center
            gap-2
            p-4
            text-sm
            font-medium
            text-gray-700
            transition
            hover:bg-gray-50
          "
            >
              <span>🤖</span>
              Analyze
            </button>

          </div>

        </div>
      ))}

      {
        analysis && (

          <div className="mt-10 rounded-2xl border p-6">

            <h2 className="mb-4 text-2xl font-bold">
              Repository Analysis
            </h2>

            <pre className="overflow-auto text-sm">
              {JSON.stringify(analysis, null, 2)}
            </pre>

          </div>
        )
      }

    </div>
  );
}