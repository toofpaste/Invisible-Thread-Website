import { useEffect } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'
import { easeQuadInOut, easeCircleInOut, easeSinInOut, easeExpInOut, easeQuadIn, easeQuadOut, easePolyInOut, easeBackInOut, easeCubicInOut } from 'd3-ease'

export default function useYScroll(bounds, props) {
  const [{ scrollSpring }, setScrollSpring] = useSpring(() => ({ scrollSpring: 0, config: config.molasses }));
  const [{ positionSpring }, setPositionSpring] = useSpring(() => ({
    positionSpring: [0, 0, 5], config: {
      tension: 190,
      friction: 220,
    }
  }));
  const [{ rotationSpring }, setRotationSpring] = useSpring(() => ({
    rotationSpring: [0, 0, 0], config: {
      tension: 150,
      friction: 220
    }
  }));

  const Stage1 = () => {
    setPositionSpring({ positionSpring: [0, 0, 20], config: { easing: easeQuadInOut, duration: 4000 } })
  }

  const Stage2 = () => {
    setPositionSpring({ positionSpring: [0, 0, 5], config: { easing: easeQuadInOut, duration: 2000 } })
    setRotationSpring({ rotationSpring: [-90, 0, 0], config: { easing: easeQuadInOut, duration: 2000 } })
  }

  const Stage3 = () => {
    // setPositionSpring({ positionSpring: [0, 10, 0], config: { easing: easeQuadInOut, duration: 2000 } })
    // setRotationSpring({ rotationSpring: [0, 0, 45], config: { easing: easeQuadInOut, duration: 2000 } })
  }


  const startAnimationDown = () => {
    Stage1()
    setTimeout(Stage2, 2000);
    setTimeout(Stage3, 4000);
  }



  let scroll = 0;
  let last = 0;
  let startDragPos = undefined;
  let lock = false;
  let moveUp = false;

  const startDrag = ({ xy: [, y] }) => {
    startDragPos = y;
  }

  const endDrag = () => {
    startDragPos = undefined;
  }

  const fn = ({ xy: [, cy], previous: [, py], memo = scrollSpring.getValue() }) => {
    if (!lock) {
      scroll = clamp(memo + (py - cy) * 0.05, ...bounds)
      if (startDragPos && Math.abs(startDragPos - cy) > 1) {
        setScrollSpring({ scrollSpring: scroll })
      }
      return scroll
    }
  }

  const fn2 = ({ xy: [, y] }) => {
    if (!lock) {
      scroll = clamp(scroll + (y - last) * 0.05, ...bounds)
      setScrollSpring({ scrollSpring: scroll })
    }
    last = y;
  }

  const setScroll = e => {
    scroll = e;
    setScrollSpring({ scrollSpring: scroll })
  }

  const setRotation = e => {
    // rotation = e;
    setRotationSpring({ rotationSpring: e });
  }

  // const getPos = () => {
  //   return [positionX, positionY, positionZ]
  // }

  useEffect(() => {
    startAnimationDown();
  }, )

  const setScrollDown = e => {
    const pos = scrollSpring.getValue();
    const max = 5
    // if (pos > 1 && pos < max) {
    //   if (moveUp) {
    //     setScrollSpring(0)
    //     setRotationSpring({ rotationSpring: 0 })
    //   } else {
    //     setScrollSpring(max + max * 0.1)
    //     setRotationSpring({ rotationSpring : -90 })
    //   }
    // }
    // setPositionSpring({ positionSpring: [0, pos, 5]})

    if (pos > max) {
      moveUp = true;
    }
    if (pos < 1) {
      moveUp = false;
    }

    if (pos >= 0 && pos <= 4.5) {

    } else if (pos > 4.5 && pos <= 5) {
      setPositionSpring({
        positionSpring: [0, 0, 5], config: {
          delay: 300,
          mass: 200,
          velocity: 0,
          tension: 80,
          friction: 300
        }
      })
    } else if (pos > 5) {
      setPositionSpring({ positionSpring: [0, pos, 5] })
    }


    console.log(pos);

    lock = (pos > 1 && pos < max);
  }


  // const [{ rotation }, set] = useSpring(() => ({ rotation: 0, config: config.slow }));
  // camera.rotation.x = THREE.Math.degToRad(-90);

  // if (pos < vh(2)) {
  //   set({ rotation: 0 });
  //   // set({ rotation: -(pos / (vh(100) * 0.9)) });
  // } else {
  //   set({ rotation: -90 });
  // }
  // camera.rotation.x = THREE.Math.degToRad(rotationValue);

  // setLock((rotationValue > -90 && rotationValue < 0))


  // if (pos < vh(2)) {
  //   camera.position.y = 0;
  // } else {
  //   camera.position.y = -pos;
  // }

  const bind = useGesture({ onWheel: fn2, onDrag: fn, onDragStart: startDrag, onDragEnd: endDrag }, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])

  return { positionSpring, scrollSpring, setScroll, rotationSpring, setRotation, setScrollDown }
}
