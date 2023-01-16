import icUpload from '../assets/images/ic_upload.png'

const Upload = () => {
    return (
        <div className="py-3 px-3 md:px-10 bg-sky-50/50 border-dashed border border-cyan-500/50 rounded-lg h-full flex items-center justify-center">
            <div className="grid grid-cols-3 md:grid-cols-2 gap-4 justify-items-center items-center">
            <div className="col-span-1 md:col-span-2">
                <img src={icUpload} className="w-16 md:w-32 opacity-70"/>
            </div>
            <div className="col-span-2 md:col-span-2 text-center">
                <p className="text-sm text-slate-500">Upload your files here.</p>
                <p className="text-sm text-slate-500"> or<a href="#" className="text-cyan-500"> Browse</a></p>
            </div>
            </div>
        </div>
    );
}

export default Upload;