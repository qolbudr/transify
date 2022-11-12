import logo from './logo.svg';
import { useCallback } from 'react'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesConfig from './particles.json'

const App = () => {

  const particlesInit = useCallback(async engine => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  return (
    <Particles id="tsparticles" options={particlesConfig} init={particlesInit} loaded={particlesLoaded} />
  );
}

export default App;
