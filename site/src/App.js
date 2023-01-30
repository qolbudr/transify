import logo from './logo.svg';
import { useCallback } from 'react'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesConfig from './particles.json'
import Upload from './components/Upload';
import Files from './components/Files';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react'

const App = () => {
  const [ currentPath, setPath ] = useState('');
  const [ baseDir, setBaseDir ] = useState('');
  const [ files, setFiles ] = useState([]);

  const particlesInit = useCallback(async engine => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  return (
    <>
    <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
    <div className="relative flex justify-center items-center h-screen w-screen">
      <Particles id="tsparticles" options={particlesConfig} init={particlesInit} loaded={particlesLoaded} />
      <div className="absolute p-6 rounded-lg backdrop-blur-sm bg-white/50 w-11/12 md:max-w-screen-md md:min-w-screen-md">
        <p className="mb-3 text-lg font-semibold">Transi<span className="text-cyan-600">fy</span></p>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <Upload currentPath={currentPath} setPath={setPath} baseDir={baseDir} setBaseDir={setBaseDir} files={files} setFiles={setFiles}/>
          </div>
          <div className="col-span-2 md:col-span-1">
            <Files currentPath={currentPath} setPath={setPath} baseDir={baseDir} setBaseDir={setBaseDir} files={files} setFiles={setFiles}/>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
