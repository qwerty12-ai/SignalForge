"use client";

export default function LoadingState() {
    return (
        <div className="mt-6 bg-gray-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold">Running the pipeline...</h2>
            <p className="text-gray-400 mt-2">Discovering lookalike companies, surfacing decision-makers, and resolving contacts. This takes about 15–20 seconds.</p>
        </div>
    )
}