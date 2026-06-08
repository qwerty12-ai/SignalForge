"use client"

import { useState } from "react";

export default function CompanyForm({ onResults, loading, setLoading, setError }) {
    const [company, setCompany] = useState("");

    async function handleSubmit(e)  {
        e.preventDefault();

        if(!company.trim()) return;

        setLoading(true);
        setError("");
        onResults(null);

        try {
            const response = await fetch("/api/pipeline", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ company }),
            });

            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message || "Pipeline failed");
            }
            onResults(data.data);
        } catch (error) {
            setError("Something went wrong while running the pipeline.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Enter a seed domain (e.g. hubspot.com)" value={company} onChange={(e) => setCompany(e.target.value)}
            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 outline-none text-sm md:text-base"/>
            <button type="submit" className="mt-4 w-full bg-white text-black py-3 rounded-lg font-semibold">{loading ? "Analyzing..." : "Analyze"}</button>
        </form>
    )
}