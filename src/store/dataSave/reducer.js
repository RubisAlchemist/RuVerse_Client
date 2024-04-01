import { SAVE_GPS_DATA, DELETE_GPS_DATA, CLEAR_GPS_DATA, SAVE_TOUCH_DATA, DELETE_TOUCH_DATA, CLEAR_TOUCH_DATA, SAVE_KEYBOARD_DATA, DELETE_KEYBOARD_DATA, CLEAR_KEYBOARD_DATA, SAVE_STYLUS_DATA, DELETE_STYLUS_DATA, CLEAR_STYLUS_DATA, SAVE_ACCELGYRO_DATA, DELETE_ACCELGYRO_DATA,
  CLEAR_ACCELGYRO_DATA, SAVE_EYETRACKING_DATA, DELETE_EYETRACKING_DATA, CLEAR_EYETRACKING_DATA } from './actionTypes';
  import _ from 'lodash';
  
  export const initialState = {
    gpsData: [],
    touchData: [],
    keyboardData: [],
    stylusData: [],
    accelgyroData: [],
    eyetrackingData: [],
  };
  
  export const dataArchiveReducer = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_GPS_DATA:
        return {
          ...state,
          gpsData: [...state.gpsData, action.payload],
        };     
      case DELETE_GPS_DATA:{
          const { startTime, endTime } = action.payload;
          return {
            ...state,
            gpsData: state.gpsData.filter(data => {
              return data.timeStamp < startTime || data.timeStamp > endTime;
            }),
          };
        }
      case CLEAR_GPS_DATA:
        return {
          ...state,
          gpsData: [],  // gpsData를 비움
        }; 
      case SAVE_TOUCH_DATA:
        // check if the payload is an array and flatten it if it is.
        const touchpayload = Array.isArray(action.payload) ? action.payload.flat() : [action.payload];
  
        // remove duplicates from the payload
        const uniquetouchPayload = Array.from(new Set(touchpayload.map(JSON.stringify))).map(JSON.parse);
  
        // filter out any items that are already in the state's touchData array
        // const touchnewItems = uniquetouchPayload.filter(item => !state.touchData.some(data => _.isEqual(item, data)));
  
        return {
          ...state,
          // touchData: [...state.touchData, ...touchnewItems],'
          touchData: [...state.touchData, ...uniquetouchPayload],
        };
      case DELETE_TOUCH_DATA:{
          const { startTime, endTime } = action.payload;
          return {
            ...state,
            touchData: state.touchData.filter(data => {
              return data.it < startTime || data.it > endTime;
            }),
          };
        }
      case CLEAR_TOUCH_DATA:
        return {
          ...state,
          touchData: [],  // touchData를 비움
        };     
      case SAVE_KEYBOARD_DATA:
        // check if the payload is an array and flatten it if it is.
        const keyboardpayload = Array.isArray(action.payload) ? action.payload.flat() : [action.payload];
  
        // remove duplicates from the payload
        const uniquekeyboardPayload = Array.from(new Set(keyboardpayload.map(JSON.stringify))).map(JSON.parse);
  
        // filter out any items that are already in the state's touchData array
        // const keyboardnewItems = uniquekeyboardPayload.filter(item => !state.keyboardData.some(data => _.isEqual(item, data)));
  
        return {
          ...state,
          // keyboardData: [...state.keyboardData, ...keyboardnewItems],
          keyboardData: [...state.keyboardData, ...uniquekeyboardPayload],
        };
      case DELETE_KEYBOARD_DATA:{
          const { startTime, endTime } = action.payload;
          return {
            ...state,
            keyboardData: state.keyboardData.filter(data => {
              return data.it < startTime || data.it > endTime;
            }),
          };
        }
      case CLEAR_KEYBOARD_DATA:
        return {
          ...state,
          keyboardData: [],  // keyboardData를 비움
        };         
      case SAVE_STYLUS_DATA:{
        // check if the payload is an array and flatten it if it is.
        const styluspayload = Array.isArray(action.payload) ? action.payload.flat() : [action.payload];
  
        // remove duplicates from the payload
        const uniquestylusPayload = Array.from(new Set(styluspayload.map(JSON.stringify))).map(JSON.parse);
  
        // filter out any items that are already in the state's touchData array
        // const stylusnewItems = uniquestylusPayload.filter(item => !state.stylusData.some(data => _.isEqual(item, data)));
  
        // return {
        //   ...state,
        //   // stylusData: [...state.stylusData, ...stylusnewItems],
        //   stylusData: [...state.stylusData, ...uniquestylusPayload],
        // }; 
        const newState = {
          ...state,
          // stylusData: [...state.stylusData, ...stylusnewItems],
          stylusData: [...state.stylusData, ...uniquestylusPayload],
        };
        // console.log("Updated state after saving stylus data:", newState); // Log the updated state
  
        return newState; 
      }  
      case DELETE_STYLUS_DATA:{
          const { startTime, endTime } = action.payload;
          return {
            ...state,
            stylusData: state.stylusData.filter(data => {
              return data.it < startTime || data.it > endTime;
            }),
          };
      }
  
      case CLEAR_STYLUS_DATA:
        return {
          ...state,
          stylusData: [],  // stylusData를 비움
        }; 
      case SAVE_ACCELGYRO_DATA:
        // console.log("action.payload", action.payload); // Log "action.payload"
        const { accel_g, accel_nog, gyro } = action.payload[0]; // Payload is array type with one object
        // console.log("accel_g", accel_g); // Log "accel_g"
        // console.log("accel_nog", accel_nog); // Log "accel_nog"
        // console.log("gyro", gyro); // Log "gyro"
        
        // Ensure that each data type is stored as an array.
        return {
          ...state,
          accelgyroData: {
            accel_g: state.accelgyroData?.accel_g ? [...state.accelgyroData.accel_g, accel_g] : [accel_g],
            accel_nog: state.accelgyroData?.accel_nog ? [...state.accelgyroData.accel_nog, accel_nog] : [accel_nog],
            gyro: state.accelgyroData?.gyro ? [...state.accelgyroData.gyro, gyro] : [gyro],
          },
        };
      case DELETE_ACCELGYRO_DATA:{
        const { startTime, endTime } = action.payload;
        const { accel_g, accel_nog, gyro } = state.accelgyroData || {};
        return {
          ...state,
          accelgyroData: {
              accel_g: accel_g ? accel_g.filter(data => new Date(data.timeStamp) < startTime || new Date(data.timeStamp) > endTime) : [],
              accel_nog: accel_nog ? accel_nog.filter(data => new Date(data.timeStamp) < startTime || new Date(data.timeStamp) > endTime) : [],
              gyro: gyro ? gyro.filter(data => new Date(data.timeStamp) < startTime || new Date(data.timeStamp) > endTime) : []
          },
          };
        } 
      case CLEAR_ACCELGYRO_DATA:
        return {
          ...state,
          accelgyroData: [],  // accelgyroData를 비움
        };     
      
      case SAVE_EYETRACKING_DATA:
        return {
          ...state,
          eyetrackingData: Array.isArray(state.eyetrackingData) ? [...state.eyetrackingData, action.payload] : [action.payload],
        };     
      case DELETE_EYETRACKING_DATA:{
          const { startTime, endTime } = action.payload;
          return {
            ...state,
            eyetrackingData: state.eyetrackingData.filter(data => {
              return data.timeStamp < startTime || data.timeStamp > endTime;
            }),
          };
        }
      case CLEAR_EYETRACKING_DATA:
        return {
          ...state,
          eyetrackingData: [],  // eyetrackingData를 비움
        }; 
      default:
        return state;
    }
  };
  
  export default dataArchiveReducer;