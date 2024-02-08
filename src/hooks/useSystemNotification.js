// // import {
// //   createSystemNotification,
// //   getSystemNotification,
// //   postSystemNotificationError,
// //   updateSystemNotification,
// // } from "@api";
// // import {
// //   getActiveClassroomPromise,
// //   getParticipationPromise,
// //   setSelectedClass,
// //   setSocketData,
// //   setTeacherClientId,
// //   updateParticipationPromise,
// // } from "@store/actions";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import moment from "moment";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";

// export const notificationKind = {
//   // 수업 시작
//   CLASS_START: "CLASS_START",
//   // 퀴즈 퍼미션 준비 요청 from 선생님
//   QUIZSET_PERMISSION_READY: "QUIZSET_PERMISSION_READY",
//   // 퀴즈 퍼미션 준비 완료
//   QUIZSET_PERMISSION_STUDENT_READY: "QUIZSET_PERMISSION_STUDENT_READY",
//   // 퀴즈 준비 from 선생님
//   QUIZSET_READY: "QUIZSET_READY",
//   // 학생 현재 상태
//   QUIZSET_STUDENT_STATUS: "QUIZSET_STUDENT_STATUS",
//   // 퀴즈 시작
//   QUIZSET_START: "QUIZSET_START",
//   // 다음 퀴즈 시작
//   QUIZ_NEXT_START: "QUIZ_NEXT_START",
//   // 퀴즈 종료
//   QUIZSET_COMPLETED: "QUIZSET_COMPLETED",
//   // 설문 시작 from 선생님
//   SURVEYSET_START: "SURVEYSET_START",
//   // 현재 퀴즈 진행 중 여부 확인
//   QUIZSET_SESSION_ACTIVE_CHECK: "QUIZSET_SESSION_ACTIVE_CHECK",
//   // 현재 퀴즈 진행 중 컨펌
//   QUIZSET_SESSION_ACTIVE_CONFIRM: "QUIZSET_SESSION_ACTIVE_CONFIRM",
// };
// export const useSystemNotification = (enabled = false) => {
//   const groupId = useSelector((state) => state.control.selectedClassId);
//   const queryClient = useQueryClient();
//   const user = useSelector((state) => state.user);
//   const history = useHistory();
//   const dispatch = useDispatch();
//   const teacherClientId = useSelector((state) => state.control.teacherClientId);
//   const { data: messages, isRefetching } = useQuery({
//     queryKey: ["system-notification"],
//     queryFn: () =>
//       getSystemNotification({
//         limit: 30,
//         offset: 0,
//         state: "UNREAD",
//         clientId: user.clientId,
//       }),
//     select: ({ data }) => {
//       return data?.systemNotifications;
//     },
//     enabled: !!user.clientId,
//     refetchInterval: 5000,
//   });

//   const { mutateAsync: onSendMessage } = useMutation({
//     mutationFn: async (params) => {
//       // params { notificationKind, title, body, payload }
//       console.log("🚀 ~ SendMessage ~ ", params.notificationKind);
//       console.log("🚀 ~ SendMessage ~ ", params.payload);
//       dispatch(
//         setSocketData({
//           method: "POST",
//           uri: "/classroom/sendImage",
//           groupId: groupId || "",
//           clientId: user.clientId,
//           type: params.notificationKind,
//           data: params.payload || "",
//         })
//       );
//       // return createSystemNotification({
//       //   state: "UNREAD",
//       //   notificationType: "COMMAND",
//       //   fromClientId: user.clientId,
//       //   toClientId: teacherClientId,
//       //   ...params,
//       // });
//     },
//   });

//   const { mutateAsync: onReadMessage } = useMutation({
//     mutationFn: ({ systemNotificationId }) =>
//       updateSystemNotification({
//         state: "READ",
//         systemNotificationId,
//       }),
//     onSuccess: (_, { systemNotificationId }) => {
//       queryClient.setQueryData(["system-notification"], ({ data }) => {
//         return {
//           ...data,
//           data: data?.systemNotifications?.map((item) => ({
//             ...item,
//             state:
//               item.systemNotificationId === systemNotificationId
//                 ? "READ"
//                 : item.state,
//           })),
//         };
//       });
//     },
//     onError: (error, { systemNotificationId, notificationKind }) => {
//       postSystemNotificationError({
//         systemNotificationId,
//         notificationKind,
//         userEnv: "client-web",
//         errorMessage: error?.response?.data ?? error?.message,
//         errorStatus: error?.response?.status ?? error?.code,
//       });
//     },
//   });

//   useEffect(() => {
//     if (
//       messages?.length !== 0 ||
//       !enabled ||
//       !isRefetching ||
//       !user?.clientId
//     ) {
//       return;
//     }

//     messages.forEach((message) => {
//       const payload = message.payload ? JSON.parse(message.payload) : {};

//       if (
//         message.toClientId === user.clientId &&
//         moment(message.createdAt).isAfter(moment().subtract(10, "minute"))
//       ) {
//         switch (message.notificationKind) {
//           case notificationKind.CLASS_START:
//             dispatch(setTeacherClientId(message.fromClientId));
//             dispatch(
//               getParticipationPromise({
//                 classroomId: payload?.classroomId,
//                 clientId: user.clientId,
//               })
//             ).then((participation) => {
//               if (participation?.state === "ABSENT") {
//                 console.log("[SystemNotification]", "출석 필요!");
//                 dispatch(
//                   updateParticipationPromise({
//                     classroomId: payload?.classroomId,
//                     clientId: user.clientId,
//                     state: "ATTEND",
//                     attendedAt: moment().toISOString(),
//                   })
//                 ).then(() => {
//                   // NativeModules.ScreenModule.sendToSocket(
//                   //   serverMessage.groupId,
//                   //   '',
//                   //   'ATTEND_CLASS',
//                   // );
//                 });
//               }
//               dispatch(getActiveClassroomPromise(user.clientId));
//             });
//             break;
//           case notificationKind.QUIZSET_READY:
//             dispatch(setTeacherClientId(message.fromClientId));
//             dispatch(setSelectedClass(payload.groupId));
//             history.replace(
//               `/quizpang/${payload.groupId}/ready/${payload.quizsetId}`
//             );
//             break;
//           case notificationKind.QUIZSET_START:
//             // history.replace(`/inquizpang/ready/${payload.quizsetSessionId}`);
//             dispatch(setSelectedClass(payload.groupId));
//             history.replace(
//               `/quizpang/${payload.groupId}/session/${payload.quizsetSessionId}`
//             );
//             break;
//           case notificationKind.QUIZ_NEXT_START:
//             // history.replace(
//             //   `/inquizpang/session/${payload.quizsetSessionId}/${payload.idx}`
//             // );
//             history.replace(
//               `/quizpang/${payload.groupId}/session/${payload.quizsetSessionId}`
//             );
//             break;
//           case notificationKind.SURVEYSET_START:
//             history.replace(`/survey`);
//             break;
//           case notificationKind.QUIZSET_COMPLETED:
//             history.replace(`/quizpang/${payload.groupId}`);
//             break;
//           default:
//             break;
//         }
//         console.log(
//           `[System Notification] ${message.notificationKind}`,
//           message.fromClientId
//         );
//       }
//       onReadMessage({
//         systemNotificationId: message.systemNotificationId,
//         notificationKind: message.notificationKind,
//       });
//     });
//   }, [
//     isRefetching,
//     history,
//     messages,
//     enabled,
//     onReadMessage,
//     user?.clientId,
//     dispatch,
//   ]);

//   return {
//     onSendMessage,
//     messages,
//   };
// };
