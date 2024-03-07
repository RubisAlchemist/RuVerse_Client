import React, { useEffect, useState, useRef, useMemo } from 'react';

const TouchLoggerContainer = ({
  name,
  // myRef,
  touchData,
  setTouchData,
  quizType,
  deviceType,
  children,
  quizSessionType,
  ...props
}) => {
  const [stylusState, setStylusState] = useState('IDLE');
  const [lastY, setLastY] = useState(0);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [nextScrollTop, setNextScrollTop] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    if (nextScrollTop === null) return;
    myRef.current.scrollTop = nextScrollTop;
    setNextScrollTop(null);
    requestAnimationFrame(() => {
      if (myRef.current) myRef.current.scrollTop = nextScrollTop;
    });
  }, [myRef, nextScrollTop]);

  const eventTypeMapping = {
    ENTER: ['OFF_SCREEN', 0],
    DOWN: ['ON_SCREEN', 1],
    MOVE: [stylusState, 2],
    UP: ['OFF_SCREEN', 3],
    LEAVE: ['IDLE', 4],
  };

  const quizTypeMapping = {
    OX: 0,
    STYLUS: 1,
    MULTIPLE: 2,
    SHORT: 3,
    LONG: 4,
  };

  const handlePointerEvent = (e, eventType, isoDate) => {
    // Prevent pointer event inside the keyboard layout; they are logged in keyboard-logger.
    const keyboardDefault =
      'react-simple-keyboard simple-keyboard hg-theme-default hg-layout-default';
    const keyboardShift =
      'react-simple-keyboard simple-keyboard hg-theme-default hg-layout-shift';
    if (
      e.target.className === keyboardDefault ||
      e.target.className === keyboardShift ||
      e.target.id === 'react-sketch-canvas-student__canvas-background'
    ) {
      return;
    }

    setStylusState(eventTypeMapping[eventType][0]);
    setIsPointerDown(
      eventType === 'DOWN' ||
        (eventType === 'MOVE' && stylusState === 'ON_SCREEN')
    );
    if (eventType === 'DOWN') {
      setLastY(e.clientY);
    }
    if (eventType === 'MOVE' && isPointerDown) {
      const deltaY = lastY - e.clientY;
      setNextScrollTop(myRef.current.scrollTop + deltaY);
      setLastY(e.clientY);
    }

    const pointerType =
      e.pointerType === 'mouse' ? 0 : e.pointerType === 'touch' ? 1 : 2;
    // const height = deviceType === 'iOS' ? e.height / 10 : e.height;
    // const width = deviceType === 'iOS' ? e.width / 10 : e.width;
    const height = e.height;
    const width = e.width;

    const eventData = {
      pt: pointerType,
      pi: e.pointerId,
      et: eventTypeMapping[eventType][1],
      ws: stylusState === 'IDLE' ? 0 : stylusState === 'OFF_SCREEN' ? 1 : 2,
      t: Math.floor(e.timeStamp),
      it: isoDate,
      px: e.pageX,
      py: e.pageY + myRef.current.scrollTop,
      sx: e.screenX,
      sy: e.screenY,
      p: e.pressure,
      tx: e.tiltX,
      ty: e.tiltY,
      h: height,
      w: width,
      qt: quizTypeMapping[quizType] || -1,
    };
    // console.log("setTouchData", eventData)

    // if (quizSessionType === 'QUIZ') {
      setTouchData([eventData]);
    // } else {
    //   setTouchData((prevTouchData) => [...prevTouchData, eventData]);
    // }
  };

  const eventHandlers = ['Enter', 'Down', 'Move', 'Up', 'Leave'].reduce(
    (handlers, eventType) => {
      handlers['onPointer' + eventType] = (e) => {
        const isoDate = new Date().toISOString();
        handlePointerEvent(e, eventType.toUpperCase(), isoDate);
      };
      return handlers;
    },
    {}
  );

  // const eventHandlers = useMemo(() => {
  //   const handlers = {};
  //   ['Enter', 'Down', 'Move', 'Up', 'Leave'].forEach((eventType) => {
  //     handlers['onPointer' + eventType] = (e) => {
  //       const isoDate = new Date().toISOString();
  //       handlePointerEvent(e, eventType.toUpperCase(), isoDate);
  //     };
  //   });
  //   return handlers;
  // }, [handlePointerEvent]);

  return (
    <div
      ref={myRef}
      name={name}
      {...eventHandlers}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        padding: '32px',
        paddingBottom: '100px',
        overflowY: 'scroll',
        touchAction: 'none',

        // position: 'fixed', // 화면을 덮는 고정 위치 요소로 변경
        // top: 0, // 상단에 위치
        // left: 0, // 왼쪽에 위치
        // right: 0, // 오른쪽에 위치
        // bottom: 0, // 하단에 위치
        // overflowY: 'scroll', // 세로 스크롤바를 표시
        // WebkitOverflowScrolling: 'touch', // iOS에서 스크롤을 매끄럽게
        // zIndex: 100, // 다른 요소들보다 위에 표시
        // touchAction: 'none', // 스크롤 방지
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default React.memo(TouchLoggerContainer);