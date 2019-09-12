import * as THREE from 'three/src/Three'
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { apply as applyThree, Canvas, useRender, useThree } from 'react-three-fiber'
import { apply as applySpring, useSpring, a } from 'react-spring/three'
import { a as aDom } from '@react-spring/web'
import './styles.css'
import { Images, Image } from './sceneElements/Images'
import Stars from './sceneElements/Stars'
import heart from './images/heart.mp4'
import video1 from './images/small/video1.mp4'
import video2 from './images/small/video2.mp4'
import Logo from './sceneElements/Logo'

import ContactFormElement from './sceneElements/ContactFormElement'

import useYScroll from './helpers/useYScroll'

import ContactForm from './sceneElements/ContactForm'
import { Vector3, Camera, SpotLight } from 'three/src/Three';
import ImageLoader from './helpers/ImageLoader'
import data from './data'

import { EffectComposer } from './postprocessing/EffectComposer'
import { RenderPass } from './postprocessing/RenderPass'
import { GlitchPass } from './postprocessing/GlitchPass'
import { WaterPass } from './postprocessing/WaterPass'

applySpring({ EffectComposer, RenderPass, GlitchPass, WaterPass })
applyThree({ EffectComposer, RenderPass, GlitchPass, WaterPass })

function App() {
  const [{ mouse }, set] = useSpring(() => ({ mouse: [0, 0] }));
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => set({ mouse: [x - window.innerWidth / 2, y - window.innerHeight / 2] }), []);
  const [loaded, setLoaded] = useState(false);
  const imageLoader = useMemo(() => new ImageLoader(data, setLoaded), [data])
  const cameraControl = useYScroll([0, 100], { domTarget: window })
  return (
    <>
      {
        loaded === true ?
          <>
            <Canvas className="canvas" onMouseMove={onMouseMove}>
              <Scene1 mouse={mouse} cameraControl={cameraControl} imageLoader={imageLoader} />
              <Scene2 mouse={mouse} cameraControl={cameraControl} />
            </Canvas>
            <aDom.div className="bar" style={{ height: cameraControl.scrollSpring.interpolate([0, 100], ['0%', '100%']) }} />

            <ContactFormElement />
          </>
          :
          <Loading />
      }
      {/* <video id="video1" loop crossOrigin="anonymous" style={{ display: 'none' }}>
        <source src={heart} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
      </video>
      <video id="video2" loop crossOrigin="anonymous" style={{ display: 'none' }}>
        <source src={video1} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
      </video>
      <video id="video3" loop crossOrigin="anonymous" style={{ display: 'none' }}>
        <source src={video2} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
      </video> */}
    </>
  );
}
export default App;


function Loading() {

  return <>
    <h1 style={{ color: 'white', margin: 'auto', fontSize: '20vh' }}>Loading...</h1>
  </>
}


function Scene1({ imageLoader, mouse, cameraControl: { positionSpring, scrollSpring, setScroll, rotationSpring, setRotation, setScrollDown } }) {
  const { size, camera, scene } = useThree()
  const scrollMax = size.height * 4.5
  const [snapped, setSnapped] = useState(false);

  const snap = useCallback((snapTo, newY) => {
    if (snapTo) {
      setScroll(-(newY + 2.5));
      setSnapped(true);
    } else {
      setScroll(scrollSpring.getValue() - 2);
      setSnapped(false);
    }
  }, [setScroll])

  useRender(() => {
    const [posX, posY, posZ] = positionSpring.getValue();
    const [rotX, rotY, rotZ] = rotationSpring.getValue();
    // const posY = positionY.getValue();
    // const posZ = positionZ.getValue();
    // const rot = rotation.getValue();

    // if (pos > 1 && pos < 2) {
    //   setRot(-90);
    //   setY(2);
    // }
    // console.log(rot, pos);

    setScrollDown();

    // if (pos < 0.5) {
    //   setScrollDown(true);
    // } else if (pos > 4.5) {
    //   setScrollDown(false);
    // }

    // if (pos > 1 && pos < 5) {
    //   if ()
    //   setScrollDown(true);
    // }

    // console.log(mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5]).getValue());     

    camera.rotation.x = THREE.Math.degToRad(rotX);
    camera.rotation.y = THREE.Math.degToRad(rotY);
    camera.rotation.z = THREE.Math.degToRad(rotZ);
    camera.position.x = posX;
    camera.position.y = -posY;
    camera.position.z = posZ;
    // console.log(posX, posY, posZ);
    // console.log(scrollSpring.getValue());

    //Set mouse hover offset
    const mousePos = mouse.getValue();
    let cameraOffset = new THREE.Vector3(
      (mousePos[0] * 10) / 50000 - camera.position.x,
      camera.position.y,
      (mousePos[1] * 10) / 50000 - camera.position.z)
    // if (posY > 1) {
    // camera.position.lerp(cameraOffset, 0.8);
    // }
  })

  return (
    <>
       {/*<a.spotLight intensity={1} distance={500} penumbra={0.0} angle={THREE.Math.degToRad(45)} color="white" position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])} />*/}
       {/*<SpotLight  */}
      <a.pointLight intensity={1} color="white" position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])} />
      <Effects factor={scrollSpring.interpolate([0, 150], [1, 0])} />

       <Logo top={scrollSpring} />
      {/*<Stars position={[0, 0, -50]} depthTest={false} scrollSpring={scrollSpring} />*/}

      <Images top={scrollSpring} mouse={mouse} scrollMax={scrollMax} snap={snap} imageLoader={imageLoader} />
      {/* <Stars position={[0, 0, 0]} /> */}

      <mesh castShadow receiveShadow position={[0, -10, 0]} >
        {/*<boxGeometry attach="geometry" args={[2, 2, 2]} />*/}
        <meshStandardMaterial attach="material" />
      </mesh>

      {/* <Thing  position={mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5])}/> */}
      {/* <Background color={positionY.interpolate([0, scrollMax * 0.25, scrollMax * 0.8, scrollMax], ['#27282F', '#247BA0', '#70C1B3', '#f8f3f1'])} /> */}
    </>
  )
}

function Scene2({ mouse, cameraControl: { positionSpring, scrollSpring, setScroll, rotationSpring, setRotation, setScrollDown } }) {
  const { size, camera, scene } = useThree()
  const scrollMax = size.height * 4.5
  const [snapped, setSnapped] = useState(false);

  const snap = useCallback((snapTo, newY) => {
    if (snapTo) {
      setScroll(-(newY + 2.5));
      setSnapped(true);
    } else {
      setScroll(scrollSpring.getValue() - 2);
      setSnapped(false);
    }
  }, [setScroll])

  useRender(() => {
    const [posX, posY, posZ] = positionSpring.getValue();
    const [rotX, rotY, rotZ] = rotationSpring.getValue();
    // const posY = positionY.getValue();
    // const posZ = positionZ.getValue();
    // const rot = rotation.getValue();

    // if (pos > 1 && pos < 2) {
    //   setRot(-90);
    //   setY(2);
    // }
    // console.log(rot, pos);

    setScrollDown();

    // if (pos < 0.5) {
    //   setScrollDown(true);
    // } else if (pos > 4.5) {
    //   setScrollDown(false);
    // }

    // if (pos > 1 && pos < 5) {
    //   if ()
    //   setScrollDown(true);
    // }

    // console.log(mouse.interpolate((x, y) => [x / 100, -y / 100, 6.5]).getValue());

    camera.rotation.x = THREE.Math.degToRad(rotX);
    camera.rotation.y = THREE.Math.degToRad(rotY);
    camera.rotation.z = THREE.Math.degToRad(rotZ);
    camera.position.x = posX;
    camera.position.y = -posY;
    camera.position.z = posZ;
    // console.log(posX, posY, posZ);
    // console.log(scrollSpring.getValue());

    //Set mouse hover offset
    const mousePos = mouse.getValue();
    let cameraOffset = new THREE.Vector3(
        (mousePos[0] * 10) / 50000 - camera.position.x,
        camera.position.y,
        (mousePos[1] * 10) / 50000 - camera.position.z)
    // if (posY > 1) {
    // camera.position.lerp(cameraOffset, 0.8);
    // }
  })

  return (
      <>
        <ContactForm />
      </>
  )
}

// /** This component creates a glitch effect */
const Effects = React.memo(({ factor }) => {
  const { gl, scene, camera, size } = useThree()
  const composer = useRef()

  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  // This takes over as the main render-loop (when 2nd arg is set to true)
  useRender(() => composer.current.render(), true)
  return (
    <effectComposer ref={composer} args={[gl]}>
      {/* Main Pass that renders the Scene */}
      <renderPass attachArray="passes" args={[scene, camera]} />
      {/* <a.waterPass attachArray="passes" factor={1} renderToScreen /> */}

      {/* <a.unrealBloomPass attachArray="passes" factor={factor} renderToScreen /> */}
      {/* Effect Passes renderToScreen draws current pass to screen*/}
      <a.glitchPass attachArray="passes" renderToScreen factor={factor} />
    </effectComposer>
  )
})
