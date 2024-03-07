import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveGpsData,
  clearGpsData,
  clipAndSendGpsData,
  saveTouchData,
  clearTouchData,
  clipAndSendTouchData,
  saveKeyboardData,
  clearKeyboardData,
  clipAndSendKeyboardData,
  saveStylusData,
  clearStylusData,
  clipAndSendStylusData,
  saveAccelgyroData,
  clearAccelgyroData,
  clipAndSendAccelgyroData,
  saveEyetrackingData,
  clearEyetrackingData,
  clipAndSendEyetrackingData,
} from '../store/actions';

function ArchiveModule({
  clientId,
  quizId,
  quizEnded,
  quizTimelimit,
  gpsData,
  accelgyroData,
  touchData,
  keyboardData,
  stylusData,
  eyetrackingData,
}) {
  const [quizStartedAt, setQuizStartedAt] = useState(new Date().toISOString());
  const [quizEndedAt, setQuizEndedAt] = useState(null);
  const dispatch = useDispatch();
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (!quizStarted && quizEnded) {
      setQuizStartedAt(new Date().toISOString());
      setQuizStarted(true);
    }
  }, [quizEnded]);

  // let quizEndedTime = new Date(quizStartedAt);
  // quizEndedTime.setSeconds(quizEndedTime.getSeconds() + quizTimelimit);
  // let newquizEndedTime = quizEndedTime.toISOString();

  //console.log("quizEnded DA: ", quizEnded)

  useEffect(() => {
    if (gpsData !== null) {
      dispatch(saveGpsData(gpsData));
    }
  }, [gpsData, dispatch]);

  useEffect(() => {
    if (touchData !== null) {
      dispatch(saveTouchData(touchData));
    }
  }, [touchData, dispatch]);

  useEffect(() => {
    if (keyboardData !== null) {
      dispatch(saveKeyboardData(keyboardData));
    }
  }, [keyboardData, dispatch]);

  useEffect(() => {
    if (stylusData !== null) {
      dispatch(saveStylusData(stylusData));
    }
  }, [stylusData, dispatch]);

  useEffect(() => {
    if (accelgyroData !== null) {
      dispatch(saveAccelgyroData(accelgyroData));
    }
  }, [accelgyroData, dispatch]);

  useEffect(() => {
    if (eyetrackingData !== null) {
      dispatch(saveEyetrackingData(eyetrackingData));
    }
  }, [eyetrackingData, dispatch]);

  // useEffect(() => {
  //   if (quizEnded) {
  //     setQuizEndedAt(new Date().toISOString());
  //   }
  // }, [quizEnded]);

  // useEffect(() => {
  //   if (quizEnded) {
  //     dispatch(
  //       clipAndSendGpsData(
  //         clientId,
  //         quizId,
  //         'gps',
  //         quizStartedAt,
  //         new Date().toISOString()
  //       )
  //     );
  //     dispatch(
  //       clipAndSendTouchData(
  //         clientId,
  //         quizId,
  //         'touch',
  //         quizStartedAt,
  //         new Date().toISOString()
  //       )
  //     );
  //     dispatch(
  //       clipAndSendKeyboardData(
  //         clientId,
  //         quizId,
  //         'keyboard',
  //         quizStartedAt,
  //         new Date().toISOString()
  //       )
  //     );
  //     dispatch(
  //       clipAndSendStylusData(
  //         clientId,
  //         quizId,
  //         'stylus',
  //         quizStartedAt,
  //         new Date().toISOString()
  //       )
  //     );
  //     dispatch(
  //       clipAndSendAccelgyroData(
  //         clientId,
  //         quizId,
  //         'accel-gyro',
  //         quizStartedAt,
  //         new Date().toISOString()
  //       )
  //     );
  //     dispatch(
  //       clipAndSendEyetrackingData(
  //         clientId,
  //         quizId,
  //         'eye-tracking',
  //         quizStartedAt,
  //         new Date().toISOString()
  //       )
  //     );

  //     dispatch(clearGpsData());
  //     dispatch(clearTouchData());
  //     dispatch(clearKeyboardData());
  //     dispatch(clearStylusData());
  //     dispatch(clearAccelgyroData());
  //     dispatch(clearEyetrackingData());
  //   }
  // }, [quizEnded, dispatch]);

  return null;
}

export default ArchiveModule;