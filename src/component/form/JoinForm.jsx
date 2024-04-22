import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import VideoCallImage from "../../images/videocallImage.png";
import {
  onChaneUid,
  onChangeChannelName,
} from "../../store/channel/channelSlice";

function JoinForm() {
  const channelName = useSelector((state) => state.channel.name);
  const uid = useSelector((state) => state.channel.uid);

  const dispatch = useDispatch();

  return (
    <JoinFormContainer>
      <InputGroup>
        <InputLabel>상담소명 :</InputLabel>
        <StyledInput
          type="text"
          placeholder="주어진 상담소 이름을 입력하세요"
          value={channelName}
          onChange={(e) => dispatch(onChangeChannelName(e.target.value))}
        />
      </InputGroup>
      <InputGroup>
        <InputLabel>이름 : </InputLabel>
        <StyledInput
          type="text"
          placeholder="당신의 이름을 입력하세요"
          value={uid}
          onChange={(e) => dispatch(onChaneUid(e.target.value))}
        />
      </InputGroup>
      <StyledImg src={VideoCallImage} />
    </JoinFormContainer>
  );
}

const JoinFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const InputLabel = styled.label`
  width: 80px; // 레이블의 너비를 고정
  text-align: right; // 텍스트를 오른쪽으로 정렬
  margin-right: 10px;
  margin-bottom: 10px;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px;
  border: 2px solid #008080; // Use the color that your Button uses
  border-radius: 4px;
  width: 200px;
  margin-right: 10px; // Only for the first input
`;

const StyledImg = styled.img`
  width: 80%;
  height: 70%;
  object-fit: contain;

  @media (max-width: 768px) {
    width: 80vw; // On smaller screens, the image will take up 80% of the viewport width
  }
`;
export default JoinForm;
