// import React, { useEffect, useState } from "react";

// import { v4 as uuidv4 } from "uuid";
// import { useSelector, useDispatch } from "react-redux";
// import { sessionSelector } from "store";
// import { fetchUsers, usersSelector } from "store/usersSlice";

// import ChatWindow from "components/ChatWidget/ChatWindow";

// import * as S from "./styles";

// const ChatWidget = ({ socket }) => {
//   const dispatch = useDispatch();
//   const session = useSelector(sessionSelector);

//   const users = useSelector(usersSelector);
//   const [rooms, setRooms] = useState([]);

//   const [expanded, setExpanded] = useState(false);
//   const [chatPartner, setChatPartner] = useState(false);
//   const [chatExpanded, setChatExpanded] = useState(false);

//   const createNewRoom = ({ sender, receiver }) => {
//     const roomId = uuidv4();
//     socket.emit("new-room-created", { roomId: `${sender}-${receiver}` });
//     setRooms([...rooms, roomId]);
//   };

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

//   const handleExpand = () => {
//     setExpanded((prev) => !prev);
//   };

//   const handleChatExpanded = () => {
//     setChatExpanded((prev) => !prev);
//   };

//   const handleChatStart = (user) => {
//     setChatPartner(user);
//     setChatExpanded(true);
//     createNewRoom({ sender: me, receiver: user._id });
//   };

//   const handleClose = () => {
//     setChatExpanded(false);
//     setChatPartner(null);
//   };

//   const me = "Ben";

//   return (
//     <S.Container>
//       {chatPartner && (
//         <S.Window expanded={!!chatExpanded}>
//           <S.WidgetHeader onClick={handleChatExpanded}>
//             {chatPartner.firstName} {!!chatExpanded && chatPartner.lastName}
//             <S.Close onClick={handleClose}>x</S.Close>
//           </S.WidgetHeader>
//           <ChatWindow socket={socket} visible={chatExpanded} />
//         </S.Window>
//       )}

//       {/* {session.sessionToken && (
//         <S.Widget expanded={expanded}>
//           <S.WidgetHeader onClick={handleExpand}>Messaging</S.WidgetHeader>
//           <S.Box>
//             {users?.map((user) => (
//               <S.Card onClick={() => handleChatStart(user)} key={user._id}>
//                 <S.Circle>x</S.Circle>
//                 {user.firstName} {user.lastName}
//               </S.Card>
//             ))}
//           </S.Box>
//         </S.Widget>
//       )} */}
//     </S.Container>
//   );
// };

// export default ChatWidget;

export {};
