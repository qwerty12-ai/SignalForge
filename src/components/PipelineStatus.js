export default function PipelineStatus({results}){
    if(!results) return null;

    const statuses = [
        {
            label: "Company Discovery",
            complete: !!results.company
        },
        {
            label: "Decision Makers",
            complete: results.decisionmakers?.length > 0
        },
        {
            label: "Email Resolution",
            complete: results.contacts?.length > 0
        },
        {
            label: "OutReach Generation", 
            complete: results.outreaches?.length > 0 
        },
    ];

    return (
        <div className="bg-gray-900 rounded-xl mt-8 p-4">
            <h2 className="font-bold mb-4">Pipeline status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-2">

                {statuses.map((status) => (
                    <div key={status.label} className={`bg-gray-800 rounded-lg p-4 ${status.complete?"bg-green-900 border border-green-700":"bg-gray-800"}`}>
                        <span>{status.complete ? "✅" : "❌"}</span>
                        <span className="ml-2">{status.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}