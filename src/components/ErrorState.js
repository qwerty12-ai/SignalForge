"use client";

export default function ErrorState({message}) {
    return (
        <div className="mt-6 bg-gray-900 p-6 rounded-xl">
            <h2 className="text-xl font-semibold">Error</h2>
            <div className="text-gray-400 mt-2">{message}</div>
        </div>
    )
}