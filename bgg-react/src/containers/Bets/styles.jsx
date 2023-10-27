import { css } from "@emotion/css";

export const styles = css`
  width: 60%;
  margin: 0 auto;
  margin-top: 120px;
  padding: 30px;
  background: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.15);
  border-radius: 4px;

  .top {
    height: 50px;

    .title {
      color: var(--dark-blue);
      font-size: 24px;
      font-weight: 800;
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;

    .left {
      margin-right: 12px;
    }

    .center {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      flex-grow: 1;
      margin-right: 12px;
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .label {
      font-size: 14px;
      font-weight: 800;
      color: var(--black);
    }

    .formItem {
      margin-bottom: 40px;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .oddsContainer {
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }

    .usersContainer {
      width: 350px;
      padding: 0 12px;
      min-width: 350px;
    }
  }
`;
