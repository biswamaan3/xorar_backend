import Link from "next/link"

export const PageHeader = ({ title, description, backbutton }) => {
    return (
        <div className='flex items-center justify-between mb-4'>
            <div className="flex items-center gap-2">
{backbutton && <Link href={backbutton} className=" p-2 bg-black rounded-lg text-white " >Back</Link> }
            <h1 className='text-3xl font-semibold'>{title}</h1>
            </div>
            <p className='text-sm text-gray-500'>{description}</p>
        </div>
    )
}