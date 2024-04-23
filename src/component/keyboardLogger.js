// import React, { useState, useRef, useEffect } from 'react';
// import Keyboard from 'react-hangul-virtual-keyboard';
// import 'react-hangul-virtual-keyboard/build/css/index.css';
// import { combineHangul } from 'hangul-util';

// const KeyboardLogger = ({
//   setInput,
//   keyboardData,
//   setKeyboardData,
//   deviceType,
//   quizCurrentIndex,
// }) => {
//   const [movePoints, setMovePoints] = useState([]);
//   const [layout, setLayout] = useState('default');
//   const [language, setLanguage] = useState('default');
//   const keyboard = useRef();
//   const options = {
//     display: {
//       '{bksp}': '⌫',
//       '{tab}': 'Tab',
//       '{shift}': '⇧',
//       '{language}': '🌐',
//       '{enter}': '< Enter',
//       '{space}': 'Space',
//     },
//   };

//   const [pressedKey, setPressedKey] = useState('');
//   const [releasedKey, setReleasedKey] = useState('');
//   const [keyPointerId, setKeyPointerId] = useState([]);
//   const [validKeyPress, setValidKeyPress] = useState(false);

//   // Functions to change virtual keyboard layout
//   const handleShift = () => {
//     const newLayoutName = layout === 'default' ? 'shift' : 'default';
//     setLayout(newLayoutName);
//   };
//   const handleLanguage = () => {
//     const languageToggle = language === 'default' ? 'english' : 'default';
//     setLanguage(languageToggle);
//   };

//   // Get key values from virtual keyboard
//   const onKeyPress = (key) => {
//     if (key === undefined) {
//       return;
//     }
//     setPressedKey(key);
//     setValidKeyPress(true);
//   };

//   const onKeyRelease = (key) => {
//     if (key === undefined) {
//       return;
//     }
//     setReleasedKey(key);
//   };

//   // Pointer event handlers
//   const handleKeyEnter = (e) => {
//     // onPointerEnter
//     e.stopPropagation();
//   };

//   const handleKeyDown = (e) => {
//     // onPointerDown
//     const ISOtimestamp = new Date().toISOString();
//     const timestamp = e.timeStamp;
//     const eventType = 'DOWN';
//     const pointerType = e.pointerType;
//     const pointerId = e.pointerId;
//     const pressure = e.pressure;
//     let height = e.height;
//     let width = e.width;
//     // if (deviceType === 'iOS'){
//     //   height = height / 10;
//     //   width = width / 10;
//     // }
//     const area = height * width;

//     if (validKeyPress === false) {
//       // Invalid input (when pressing the area between keys)
//       const invalidKey = 'Invalid';
//       setKeyPointerId((prevData) => [
//         ...prevData,
//         { pressedKey: invalidKey, pointerId, pointerType },
//       ]);
//     } else {
//       setKeyPointerId((prevData) => [
//         ...prevData,
//         { pressedKey, pointerId, pointerType },
//       ]);
//       // const eventData = {deviceType, pressedKey, pointerType, pointerId, eventType, timestamp, pressure, height, width};
//       const eventData = {
//         deviceType,
//         pressedKey,
//         pointerType,
//         pointerId,
//         eventType,
//         timestamp,
//         ISOtimestamp,
//         pressure,
//         area,
//       };
//       const eventDataCompressed = compressKeyboardData(eventData, eventType);

//       // setKeyboardData([eventDataCompressed]);
//       setKeyboardData((prevData) => [...prevData, eventDataCompressed]);
//       setMovePoints((prevData) => [
//         ...prevData,
//         { pointerId, timestamp, pressure, height, width },
//       ]);

//       console.log(eventData);
//       console.log("deviceType: "+deviceType+", pressedKey: "+pressedKey+", pointerType: "+pointerType+", pointerId: "+pointerId + ", eventType: "+eventType +", timestamp: "+timestamp +", ISOtimestamp: "+ISOtimestamp+", pressure: "+pressure +", area: "+area); // to inspect in ipad chrome
//       console.log(eventDataCompressed);

//       if (pressedKey === '{shift}') handleShift();
//       if (pressedKey === '{language}') handleLanguage();
//     }

//     setValidKeyPress(false);
//     e.stopPropagation();
//   };

//   const handleKeyMove = (e) => {
//     // onPointerMove
//     const timestamp = new Date().toISOString();
//     const pointerId = e.pointerId;
//     const pressure = e.pressure;
//     let height = e.height;
//     let width = e.width;
//     // if (deviceType === 'iOS'){
//     //   height = height / 10;
//     //   width = width / 10;
//     // }
//     const keyPointerIdCheck = keyPointerId.find(
//       (item) => item.pointerId === pointerId
//     );

//     if (keyPointerIdCheck === undefined) {
//       e.stopPropagation();
//       return;
//     }
//     const key = keyPointerIdCheck.pressedKey;
//     setMovePoints((prevData) => [
//       ...prevData,
//       { pointerId, timestamp, pressure, height, width },
//     ]);

//     e.stopPropagation();
//   };

//   const handleKeyUp = (e) => {
//     // onPointerUp
//     const timestamp = e.timeStamp;
//     const eventType = 'UP';
//     const pointerType = e.pointerType;
//     const pointerId = e.pointerId;
//     e.stopPropagation();
//   };

//   const handleKeyLeave = (e) => {
//     // onPointerLeave
//     const ISOtimestamp = new Date().toISOString();
//     const timestamp = e.timeStamp;
//     const eventType = 'UP';
//     const pointerType = e.pointerType;
//     const pointerId = e.pointerId;

//     const keyPointerIdCheck = keyPointerId.find(
//       (item) => item.pointerId === pointerId
//     );
//     if (keyPointerIdCheck === undefined) {
//       e.stopPropagation();
//       return;
//     }
//     if (keyPointerIdCheck.pressedKey !== releasedKey) {
//       // Invalid keyup
//       e.stopPropagation();
//       return;
//     }

//     if (
//       movePoints.filter((item) => item.pointerId === pointerId) === undefined
//     ) {
//       e.stopPropagation();
//       return;
//     }

//     // Get pressures from pointerMove events
//     let pressures = [0.0];
//     pressures = movePoints
//       .filter((item) => item.pointerId === pointerId)
//       .map((item) => item.pressure);
//     if (pressures.length === 0) {
//       // no move event occurred
//       pressures = [0.0];
//     }
//     let pressureMin = Math.min(...pressures);
//     let pressureMax = Math.max(...pressures);
//     let pressureAvg =
//       pressures.reduce((sum, num) => sum + num, 0) / pressures.length;

//     // Get area (height*width) from pointerMove events (ipad touch)
//     let areas = [0.0];
//     areas = movePoints
//       .filter((item) => item.pointerId === pointerId)
//       .map((item) => item.height * item.width);
//     if (areas.length === 0) {
//       // no move event occurred
//       areas = [0.0];
//     }
//     let areaMin = Math.min(...areas);
//     let areaMax = Math.max(...areas);
//     let areaAvg = areas.reduce((sum, num) => sum + num, 0) / areas.length;

//     const eventData = {
//       deviceType,
//       releasedKey,
//       pointerType,
//       pointerId,
//       eventType,
//       timestamp,
//       ISOtimestamp,
//       pressureMin,
//       pressureMax,
//       pressureAvg,
//       areaMin,
//       areaMax,
//       areaAvg,
//     };
//     const eventDataCompressed = compressKeyboardData(eventData, eventType);
//     // setKeyboardData([eventDataCompressed]);
//     setKeyboardData((prevData) => [...prevData, eventDataCompressed]);

//     setKeyPointerId(
//       keyPointerId.filter((item) => item.pointerId !== pointerId)
//     );
//     setMovePoints(movePoints.filter((item) => item.pointerId !== pointerId));

//     // console.log(eventData)
//     // console.log(eventDataCompressed);
//     // console.log("deviceType: "+deviceType+", releasedKey: "+releasedKey+", pointerType: "+pointerType+", pointerId: "+pointerId + ", eventType: "+eventType +", timestamp: "+timestamp +", ISOtimestamp: "+ISOtimestamp+", pressureMin: "+pressureMin +", pressureMax: "+pressureMax +", pressureAvg: "+pressureAvg +", areaMin: "+areaMin + ", areaMax: "+areaMax +", areaAvg: "+areaAvg ); // to inspect in ipad chrome
//     e.stopPropagation();
//   };

//   const onChange = (input) => {
//     let combinedInput = combineHangul(input.split('')); // combine hangul. ex) ㄱ ㅏ ㅇ -> 강
//     setInput(combinedInput); // set input value for the Input component (in quiz-input.js, quiz-long-input.js)
//   };

//   // Compress the data
//   const compressKeyboardData = (keyboardData, dataType) => {
//     // dt(Device): Android, iOS,
//     // k(Key value)
//     // pt(PointerType): => 0: mouse, 1: touch, 2: pen
//     // pi(PointerId): int (unique id for each pointer)
//     // et(EventType): => 0: enter, 1: down, 2: move, 3: up, 4: leave
//     // t(Timestamp): string (event timestamp)
//     // it(IsoDate): string (iso date)
//     // px(PageX): int (pageX)
//     // py(PageY): int (pageY)
//     // sx(ScreenX): int (screenX)
//     // sy(ScreenY): int (screenY)
//     // p(Pressure): float (pressure)
//     // a(Area): float (area)
//     // h(Height): int (height)
//     // w(Width): int (width)

//     // np(pressureMin)
//     // xp(pressureMax)
//     // ap(pressureAvg)
//     // na(areaMin)
//     // xa(areaMax)
//     // aa(areaAvg)
//     if (dataType === 'DOWN') {
//       let {
//         deviceType: dt,
//         pressedKey: k,
//         pointerType: pt,
//         pointerId: pi,
//         eventType: et,
//         timestamp: t,
//         ISOtimestamp: it,
//         pressure: p,
//         area: a,
//       } = keyboardData;
//       dt = dt === 'Android' ? 'a' : dt === 'iOS' ? 'i' : 'o';
//       pt = pt === 'mouse' ? 0 : pt === 'touch' ? 1 : 2;
//       et = 1;
//       const compressedData = { dt, k, pt, pi, et, t, it, p, a };
//       return compressedData;
//     } else {
//       // "UP"
//       let {
//         deviceType: dt,
//         releasedKey: k,
//         pointerId: pi,
//         eventType: et,
//         timestamp: t,
//         ISOtimestamp: it,
//         pressureMin: np,
//         pressureMax: xp,
//         pressureAvg: ap,
//         areaMin: na,
//         areaMax: xa,
//         areaAvg: aa,
//       } = keyboardData;
//       dt = dt === 'Android' ? 'a' : dt === 'iOS' ? 'i' : 'o';
//       et = 3;
//       const compressedData = { dt, k, pi, et, t, it, np, xp, ap, na, xa, aa };
//       return compressedData;
//     }
//   };

//   // const getInnerDiv = (e) => {
//   //   let currentElement = e.target;
//   //   while (currentElement !== null && currentElement.tagName !== 'DIV') {
//   //     currentElement = currentElement.parentNode;
//   //   }
//   //   if (currentElement !== null) {
//   //     console.log(currentElement.getAttribute('data-skbtn'));
//   //     return;
//   //   }
//   // };

//   return (
//     // <div style={{ position: 'relative', height: '100vh' }}>
//     <div
//       id="keyboard"
//       style={{
//         display: 'flex',
//         bottom: 0,
//         width: '95vw',
//         justifyContent: 'center',
//       }} //
//       onPointerEnter={(e) => handleKeyEnter(e)}
//       onPointerDown={(e) => handleKeyDown(e)}
//       onPointerMove={(e) => handleKeyMove(e)}
//       onPointerUp={(e) => handleKeyUp(e)}
//       onPointerLeave={(e) => handleKeyLeave(e)}
//     >
//       <Keyboard
//         keyboardRef={(r) => (keyboard.current = r)}
//         layoutName={layout}
//         language={language}
//         onKeyPress={onKeyPress}
//         onKeyReleased={onKeyRelease}
//         onChange={onChange}
//         newLineOnEnter={true}
//         disableCaretPositioning={true}
//         preventMouseDownDefault={false}
//         disableButtonHold={true}
//         stopMouseDownPropagation={false}
//         useTouchEvents={false}
//         useButtonTag={false} //
//         {...options}
//       />
//       {/* <div>
//           Data: {keyboardData}
//         </div> */}
//     </div>
//     // </div>
//   );
// };

// export default KeyboardLogger;
