import { ArrowRight2, Layer, Refresh } from 'iconsax-react';
import { useState, useEffect } from 'react'
import { getFiles, getRelDir, getBaseDir } from '../utils/dirHelper';
import { getIcon } from '../utils/iconHelper';

const Files = () => {
    const [ currentPath, setPath ] = useState('');
    const [ files, setFiles ] = useState([]);
    const [ baseDir, setBaseDir ] = useState('');
    
    useEffect(() => {
        fetchBaseDir();
    }, [])

    useEffect(() => {
        fetchFiles();
    }, [])

    const fetchBaseDir = async () => {
        const path = await getBaseDir()
        setBaseDir(path)
    }

    const fetchFiles = async (path) => {
        const result = await getFiles(getRelDir(path));
        setFiles(result);
    }

    const goTo = async (p) => {
        let path = currentPath
        let pathBase = baseDir 
        path != '' ?
        path += "\\" + p :
        path += p

        pathBase += "\\" + p
        console.log(pathBase)
        await fetchFiles(path)
        setPath(path)
        setBaseDir(pathBase)
    }

    const backTo = async (index) => {
        let path = currentPath
        let pathBase = baseDir

        const length = baseDir.split('\\').length
        index = length - index - 1

        let arrayBase = pathBase.split('\\')
        
        console.log(index)

        let backPath = ''
        for(let i = 0; i < index; i++) {
            backPath += '\\' + '..'
            arrayBase.pop()
        }

        console.log(backPath)

        path += "\\" + backPath
        pathBase = arrayBase.join("\\")

        await fetchFiles(path)
        setPath(path)
        setBaseDir(pathBase)
    }

    return (
        <div className="flex flex-col max-h-80 h-80">
            <div className="grow h-10 rounded-lg text-xs overflow-hidden relative mb-3">
                <ul className="flex list-unstyled items-center overflow-x-scroll overflow-y-hidden -top-5 md:top-0 left-4 right-4 absolute -bottom-5">
                    <li><Refresh size="14"/></li>
                    <li className="mx-1"><ArrowRight2 size="12"/></li>
                    {baseDir.split("\\").map((value, index) => (
                        <>
                            { index == baseDir.split("\\").length - 1 ?
                                <a><li className="truncate">{value}</li></a> :
                                <a className="cursor-pointer" onClick={() => backTo(index)}>
                                    <li className="text-cyan-500 truncate">{value}</li>
                                </a>
                            }
                            { index == baseDir.split("\\").length - 1 ? <></> : <li className="mx-1"><ArrowRight2 size="12"/></li> }
                        </>
                    ))}
                </ul>
            </div>
            <div class="h-full text-sm w-100 overflow-y-scroll px-1">
                <ul className="list-unstyled">
                    {files.map((value, index) => (
                        <li className="hover:bg-cyan-500/30 px-3 py-2 rounded-md relative">
                            <a className="grid grid-cols-7 gap-2 items-center cursor-pointer" onClick={() => goTo(value.name)}>
                                <div className="col-span-1">
                                    <img src={getIcon(value.extension, value.dir)} className="w-8"/>
                                </div>
                                <div className="truncate col-span-5">
                                    <p className="truncate">{value.name}</p>
                                    { value.dir ? <p className="text-xs text-slate-500">{value.time}</p> : <p className="text-xs text-slate-500">{value.size} B</p> }
                                </div>
                            </a>
                            <div className="absolute z-10 cursor-pointer right-3 bottom-4" onClick={() => alert(1)}>
                                <Layer size="18"/>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Files;