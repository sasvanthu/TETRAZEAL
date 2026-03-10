import React, { useState, useEffect } from "react";
import { Landmark, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const schemesData = [

{
id:1,
name:"Pradhan Mantri Mudra Yojana (PMMY)",
category:"Micro Finance",
amount:"Up to ₹10 Lakhs",
interest:"8.5% - 12%",
description:"Loans for micro and small businesses without collateral.",
website:"https://www.mudra.org.in/"
},

{
id:2,
name:"Stand-Up India Scheme",
category:"SC/ST/Women Entrepreneurs",
amount:"₹10L - ₹1 Crore",
interest:"Base Rate + 3%",
description:"Supports women and SC/ST entrepreneurs to start businesses.",
website:"https://www.standupmitra.in/"
},

{
id:3,
name:"Credit Guarantee Fund Trust (CGTMSE)",
category:"Collateral Free",
amount:"Up to ₹2 Crores",
interest:"Varies by bank",
description:"Collateral-free credit support for MSMEs.",
website:"https://www.cgtmse.in/"
},

{
id:4,
name:"PMEGP Scheme",
category:"Entrepreneurship",
amount:"Up to ₹25 Lakhs",
interest:"Subsidized",
description:"Prime Minister Employment Generation Programme for startups.",
website:"https://www.kviconline.gov.in/pmegp"
}

];

export const GovSchemes = () => {

const navigate = useNavigate();

const [schemes,setSchemes] = useState(schemesData);
const [search,setSearch] = useState("");

useEffect(()=>{

const filtered = schemesData.filter((s)=>
s.name.toLowerCase().includes(search.toLowerCase())
);

setSchemes(filtered);

},[search]);

return (

<div className="p-8 text-white space-y-6">

<div className="flex justify-between items-center">

<div>
<h1 className="text-3xl font-bold">Government Schemes</h1>
<p className="text-slate-400 text-sm mt-1">
Explore financial support programs for entrepreneurs
</p>
</div>

<button
onClick={()=>navigate("/ai-advisor")}
className="bg-emerald-500 px-5 py-2 rounded font-semibold"
>
Ask AI Advisor
</button>

</div>

<div className="relative max-w-md">

<Search className="absolute left-3 top-3 h-4 w-4 text-slate-400"/>

<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Search schemes..."
className="w-full pl-10 pr-4 py-2 bg-slate-800 rounded"
/>

</div>

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{schemes.map((scheme)=>(
<div
key={scheme.id}
className="bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-between"
>

<div>

<div className="flex items-center mb-3">
<Landmark className="h-5 w-5 text-indigo-400 mr-2"/>
<h3 className="font-semibold text-lg">{scheme.name}</h3>
</div>

<p className="text-sm text-slate-400 mb-3">
{scheme.description}
</p>

<div className="space-y-1 text-sm">

<p>
<span className="text-slate-400">Category:</span> {scheme.category}
</p>

<p>
<span className="text-slate-400">Loan Amount:</span> {scheme.amount}
</p>

<p>
<span className="text-slate-400">Interest Rate:</span> {scheme.interest}
</p>

</div>

</div>

<div className="grid grid-cols-2 gap-3 mt-6">

<button
onClick={()=>navigate("/documents")}
className="bg-white/10 py-2 rounded text-sm"
>
Details
</button>

<a
href={scheme.website}
target="_blank"
rel="noopener noreferrer"
className="bg-indigo-500 py-2 rounded text-sm flex items-center justify-center"
>
Apply <ArrowRight className="ml-2 h-4 w-4"/>
</a>

</div>

</div>
))}

</div>

</div>

);

};