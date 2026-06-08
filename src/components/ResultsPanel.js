"use client";

import OutreachCard from "./OutreachCard";
import ProspectTable from "./ProspectTable";
import PipelineStatus from "./PipelineStatus";
import CompanyCard from "./CompanyCard";
import DecisionMakersCard from "./DecisionMakerCard";

export default function ResultsPanel({results}) {
    if (!results) return null;

    return (

        <>
        
        <PipelineStatus results={results} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {results.company && (<CompanyCard companies={results.companies} />)}
            {results.decisionmakers?.length > 0 && <DecisionMakersCard people={results.decisionmakers} />}
            {results.contacts?.length > 0 && <ProspectTable contacts={results.contacts}/>}
            {results.outreaches?.length > 0 && <OutreachCard outreaches={results.outreaches} />}
        </div>

        </>


    )
}