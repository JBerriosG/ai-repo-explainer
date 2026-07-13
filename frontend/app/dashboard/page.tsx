"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {

  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyzingRepoId, setAnalyzingRepoId] = useState<number | null>(null);

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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAnalysisModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);

  }, []);

  const handleAnalyze = async (repo: any) => {
    setAnalyzingRepoId(repo.id);
    try {
      const res = await fetch(
        `http://localhost:5000/github/repos/${repo.owner.login}/${repo.name}/analyze`,
        {
          credentials: "include"
        }
      );
      const data = await res.json();
      setAnalysis(data.context); // Mapeamos directo el objeto context procesado
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error analyzing repository:", error);
    } finally {
      setAnalyzingRepoId(null);
    }
  };

  const closeAnalysisModal = () => {
    setIsModalOpen(false);
    setAnalysis(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm font-medium text-gray-500">
        Loading...
      </div>
    );
  }
  return (
    <div className="relative min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Repositories</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {repos.map((repo: any) => {
            const isThisRepoAnalyzing = analyzingRepoId === repo.id;
            return (
              <div
                key={repo.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* HEADER */}
                <div className="flex flex-1 items-start justify-between p-5">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900 truncate max-w-50">
                        {repo.name}
                      </h2>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${repo.private ? "bg-red-50 text-red-700 border border-red-100" : "bg-green-50 text-green-700 border border-green-100"
                        }`}>
                        {repo.private ? "Private" : "Public"}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {repo.description || "Sin descripción disponible."}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="grid grid-cols-2 border-t border-gray-200 bg-gray-50/50">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 border-r border-gray-200 p-4 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                  >
                    <span>🔗</span>
                    GitHub
                  </a>

                  <button
                    onClick={() => handleAnalyze(repo)}
                    disabled={analyzingRepoId !== null}
                    className="flex items-center justify-center gap-2 p-4 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
                  >
                    {isThisRepoAnalyzing ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    ) : (
                      <span>🤖</span>
                    )}
                    {isThisRepoAnalyzing ? "Analyzing..." : "Analyze"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POP-UP MODAL SEMÁNTICO */}
      {isModalOpen && analysis && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={closeAnalysisModal}
        >
          <div
            className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all animate-slide-up"
            onClick={(e) => e.stopPropagation()} // Evita cerrar si hacen clic dentro del modal
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-6 bg-linear-to-r from-indigo-50/50 to-white">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                  {analysis.projectType || "Detected structure"}
                </span>
                <h3 className="text-xl font-bold text-gray-900">
                  Result of Analysis
                </h3>
              </div>
              <button
                onClick={closeAnalysisModal}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">

              {/* Stack Tecnológico */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  🚀 Tech Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.stack?.map((tech: string) => (
                    <span key={tech} className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                      {tech}
                    </span>
                  )) || <span className="text-sm text-gray-400">No detectado</span>}
                </div>
              </div>

              {/* Arquitectura del Proyecto */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-b border-gray-100 py-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    📐 Arquitectonic pattern
                  </h4>
                  <p className="text-sm font-medium text-gray-900">
                    {analysis.architecture?.pattern || "Estructura Estándar"}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    📁 Key Folders (`src/`)
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysis.architecture?.folders?.map((folder: string) => (
                      <span key={folder} className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-mono font-medium text-gray-600">
                        {folder.replace('src/', '')}
                      </span>
                    )) || <span className="text-xs text-gray-400">None</span>}
                  </div>
                </div>
              </div>

              {/* Infraestructura y DevOps */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  ⚙️ Infrastructure and DevOps
                </h4>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={analysis.infrastructure?.docker ? "text-green-500" : "text-gray-300"}>
                      {analysis.infrastructure?.docker ? "✅" : "❌"}
                    </span>
                    <span className={analysis.infrastructure?.docker ? "text-gray-900 font-medium" : "text-gray-400 line-through"}>
                      Docker Setup
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={analysis.infrastructure?.ci ? "text-green-500" : "text-gray-300"}>
                      {analysis.infrastructure?.ci ? "✅" : "❌"}
                    </span>
                    <span className={analysis.infrastructure?.ci ? "text-gray-900 font-medium" : "text-gray-400 line-through"}>
                      CI/CD Configured
                    </span>
                  </div>
                </div>
              </div>

              {/* Dependencias Críticas */}
              {analysis.dependencies && analysis.dependencies.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    📦 Dependencies of Ecosystem
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.dependencies.map((dep: string) => (
                      <span key={dep} className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-mono font-medium text-gray-600">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={closeAnalysisModal}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => alert("Próximamente: Enviar contexto al prompt de la IA")}
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                >
                  Generate README.md 🤖
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div> // Fin del contenedor principal de la página
  );
}