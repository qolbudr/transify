import icUpload from '../assets/images/ic_upload.png'
import { toast } from 'react-toastify';
import { upload, getFiles, getRelDir } from '../utils/dirHelper';

const Upload = ({currentPath, setPath, baseDir, setBaseDir, files, setFiles}) => {
    const uploadFile = async (e) => {
        await toast.promise(
            upload(currentPath, e.target.files[0]),
            {
              pending: 'Mengirim berkas...',
              success: 'Berkas berhasil dikirim',
              error: 'Pengiriman berkas gagal'
            }
        )
        const result = await getFiles(getRelDir(currentPath));
        setFiles(result);
    } 

    return (
        <div className="py-3 px-3 md:px-10 bg-sky-50/50 border-dashed border border-cyan-500/50 rounded-lg h-full flex items-center justify-center">
            <div className="grid grid-cols-3 md:grid-cols-2 gap-4 justify-items-center items-center">
            <div className="col-span-1 md:col-span-2">
                <img src={icUpload} className="w-16 md:w-32 opacity-70"/>
            </div>
            <div className="col-span-2 md:col-span-2 text-center">
                <p className="text-sm text-slate-500">Upload your files here.</p>
                <input id="file" onChange={uploadFile} type="file" style={{'display': 'none'}}/>
                <p className="text-sm text-slate-500"> or&nbsp;
                    <label for="file" className="text-cyan-500 cursor-pointer">Browse</label>
                </p>
            </div>
            </div>
        </div>
    );
}

export default Upload;