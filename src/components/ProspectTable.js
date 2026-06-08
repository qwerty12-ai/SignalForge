"use client";

export default function ProspectTable({contacts}) {
    return (
        <div className="bg-gray-900 p-6 rounded-xl h-full overflow-x-auto">
            <h2 className="text-lg font-bold">Contacts</h2>
            {contacts.map((contact, index) => (
                <div key={index} className="border border-gray-800 rounded-lg p-3 mb-3">
                    <p className="font-semibold">📧 {contact.email}</p>
                    <p className={contact.verified ? "text-green-400" : "text-red-400"}>{contact.verified ? "✅ Verified" : "❌ Not Verified"}</p>
                </div>
            ))}
        </div>
    )
}