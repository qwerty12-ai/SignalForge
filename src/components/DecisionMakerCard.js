"use client"

export default function DecisionMakersCard({people}) {
    return (
        <div className="bg-gray-900 p-6 rounded-xl max-h-125 overflow-y-auto">
            <h2 className="text-lg font-bold mb-3">
                Decision Makers
            </h2>
            {people.map((person, index) => (
                <div key={index} className="mb-3">
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-gray-400">{person.role}</p>
                </div>
            ))}
        </div>
    )
}