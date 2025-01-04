export const PageHeader = ({ title, description }) => {
    return (
        <div className='flex items-center justify-between mb-4'>
            <h1 className='text-3xl font-semibold'>{title}</h1>
            <p className='text-sm text-gray-500'>{description}</p>
        </div>
    )
}