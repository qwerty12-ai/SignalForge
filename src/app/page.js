"use client";

import { useState } from "react";
import CompanyForm from "@/components/CompanyForm";
import ResultsPanel from "@/components/ResultsPanel";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";


export default function Home() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="md:text-5xl text-3xl font-bold">SignalForge</h1>
          <p className="mt-4 text-sm md:text-base text-gray-400">AI powered Outreach Engine</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <CompanyForm loading={loading} onResults={setResults} setLoading={setLoading} setError={setError} />
        </div>
        {loading && <LoadingState />}
        {error && <ErrorState message={error} />}
        {!loading && ! error && (<ResultsPanel results={results}/>)}
      </div>
    </main>
  );
}
