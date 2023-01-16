import logo from './logo.svg';
import { useCallback } from 'react'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesConfig from './particles.json'
import icUpload from './assets/images/ic_upload.png'
import { ArrowRight2, Home2, Folder2, Document } from 'iconsax-react';

const App = () => {

  const particlesInit = useCallback(async engine => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  return (
    <div className="relative flex justify-center items-center h-screen w-screen">
      <Particles id="tsparticles" options={particlesConfig} init={particlesInit} loaded={particlesLoaded} />
      <div className="absolute p-6 rounded-lg backdrop-blur-sm bg-white/50 w-11/12 md:w-auto md:max-w-screen-md">
        <p className="mb-3 text-lg font-semibold">Transi<span className="text-cyan-600">fy</span></p>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
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
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col max-h-80 h-80">
              <div className="h-10 rounded-lg text-xs overflow-hidden relative mb-3">
                <ul className="flex list-unstyled items-center overflow-x-scroll overflow-y-hidden -top-5 md:top-0 left-4 right-4 absolute -bottom-5">
                  <li><Home2 size="14"/></li>
                  <li className="mx-1"><ArrowRight2 size="12"/></li>
                  <li className="text-cyan-500">Users</li>
                  <li className="mx-1"><ArrowRight2 size="12"/></li>
                  <li className="text-cyan-500">PC</li>
                  <li className="mx-1"><ArrowRight2 size="12"/></li>
                  <li className="text-cyan-500">Downloads</li>
                  <li className="mx-1"><ArrowRight2 size="12"/></li>
                  <li className="text-cyan-500">Downloads</li>
                  <li className="mx-1"><ArrowRight2 size="12"/></li>
                  <li className="text-cyan-500">Downloads</li>
                </ul>
              </div>
              <div class="px-4 grow text-sm w-100 overflow-y-scroll">
                <ul className="list-unstyled">
                  <li className="flex justify-between items-center mb-3">
                    <div className="grow mr-2">
                      <img src={'icon/doc.png'} className="w-28"/>
                    </div>
                    <div className="truncate">
                      <p className="truncate">IMPLEMENTASI MODEL DESAIN THINKING SEBAGAI PENDEKATAN PERANCANGAN ANTARMUKA SMART APP UNIVERSITAS ISLAM LAMONGAN.docx</p>
                      <p className="text-xs text-slate-500">126 Kb</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
