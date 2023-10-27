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

    .label {
      font-size: 14px;
      font-weight: 800;
      color: var(--black);
    }

    .formItem {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      &:first-of-type {
        margin-right: 20px;
      }
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

export const tableStyles = css`
  display: flex;
  flex-direction: column;
  margin-top: 80px;

  .betCard {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    margin-bottom: 12px;
    border-radius: 4px;
    padding: 18px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.08);
  }

  .eligibleUsers {
    display: flex;
    flex-direction: column;
  }
`;
