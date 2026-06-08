// "use client"

// import { FaArrowUpRightFromSquare } from "react-icons/fa6";

// export default function CompanyCard({company}) {
//     return (
//         <div className="bg-gray-900 p-6 rounded-xl">
//             <h2 className="text-lg font-bold mb-3">
//                 Company
//             </h2>
//             <p className="font-semibold breaks-words">{company.name}</p>
//             <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline hover:text-orange-300 inline-flex items-center gap-2">
//                 Visit Website < FaArrowUpRightFromSquare />
//             </a>
//         </div>
//     )
// }












// CompanyCard.jsx — shows all lookalike companies
"use client"

import { FaArrowUpRightFromSquare } from "react-icons/fa6";

export default function CompanyCard({ companies }) {
    return (
        <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-lg font-bold mb-3">Lookalike Companies</h2>
            {companies.map((company, index) => (
                <div key={index} className="mb-4 last:mb-0">
                    <p className="font-semibold wrap-break-word">{company.name}</p>
                    <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:underline hover:text-orange-300 inline-flex items-center gap-2 text-sm"
                    >
                        Visit Website <FaArrowUpRightFromSquare />
                    </a>
                </div>
            ))}
        </div>
    );
}