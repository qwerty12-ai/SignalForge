"use client";
import { useState } from "react";

export default function OutreachCard({ outreaches }) {
    const [status, setStatus] = useState("idle"); // idle | sending | sent | error
    const [sentCount, setSentCount] = useState(0);

    async function confirmAndSend() {
        setStatus("sending");
        try {
            const response = await fetch("/api/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ outreaches })
            });
            if (!response.ok) throw new Error("Send failed");
            const data = await response.json();
            setSentCount(data.sentCount || outreaches.length);
            setStatus("sent");
        } catch {
            setStatus("error");
        }
    }

    if (!outreaches?.length) return null;

    return (
        <div className="bg-gray-900 p-6 rounded-xl col-span-1 lg:col-span-2">
            <h2 className="text-lg font-bold mb-2">Generated Outreach</h2>
            <p className="text-gray-400 text-sm mb-6">
                {outreaches.length} personalized email{outreaches.length > 1 ? "s" : ""} ready to send
            </p>

            <div className="space-y-6 mb-6">
                {outreaches.map((item, index) => (
                    <div key={index} className="border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="font-semibold text-sm">{item.contact.personName}</p>
                                <p className="text-gray-400 text-xs">{item.contact.personRole}</p>
                            </div>
                            <p className="text-green-400 text-xs font-mono">{item.contact.email}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">Subject</p>
                            <p className="text-sm font-semibold">{item.outreach.subject}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Message</p>
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                {item.outreach.body}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {status === "sent" ? (
                <div className="text-green-400 font-semibold">
                    ✅ {sentCount} email{sentCount > 1 ? "s" : ""} sent successfully
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={confirmAndSend}
                        disabled={status === "sending"}
                        className="bg-white text-black px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                        {status === "sending"
                            ? `Sending ${outreaches.length} emails...`
                            : `🚀 Confirm & Send All (${outreaches.length})`}
                    </button>
                </div>
            )}
            {status === "error" && (
                <p className="text-red-400 text-sm mt-2">Send failed. Check console.</p>
            )}
        </div>
    );
}