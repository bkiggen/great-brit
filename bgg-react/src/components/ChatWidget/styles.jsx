import Button from "@mui/material/Button";
import styled from "@emotion/styled";

export const Container = styled.div`
  position: fixed;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  bottom: 0;
  right: 12px;
  z-index: 1000;
`;

export const Widget = styled.div`
  height: ${(props) => (props.expanded ? "80vh" : "47px")};
  width: 288px;
  border-radius: 4px 4px 0 0;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
  background: white;
  overflow: hidden;
  transition: 0.2s ease-in-out all;
`;

export const WidgetHeader = styled(Button)`
  position: relative;
  width: 100%;
  height: 47px;
  cursor: pointer;
  border-bottom: 1px solid lightgrey;
  background: white;
  border-radius: 4px 4px 0 0;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const Card = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 12px;
  height: 60px;
  border-bottom: 1px solid lightgrey;
  border-radius: 0;
  cursor: pointer;
`;

export const Circle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background: orange;
  margin-right: 24px;
`;

export const Window = styled.div`
  height: ${(props) => (props.expanded ? "50vh" : "47px")};
  width: ${(props) => (props.expanded ? "388px" : "216px")};
  margin-right: 12px;
  border-radius: 4px 4px 0 0;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
  background: white;
  transition: 0.2s ease-in-out all;
  overflow: hidden;
`;

export const WindowBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: calc(100% - 47px);
`;

export const Close = styled.div`
  position: absolute;
  right: 18px;
  top: 11px;
  height: 30px;
  width: 30px;
`;
