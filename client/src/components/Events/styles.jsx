import { css } from "@emotion/css";

export const styles = css`
  .title {
    font-size: 24px;
    font-weight: 600;
    margin: 12px 0 0px 0;
  }

  .adminTitle {
    font-size: 24px;
    font-weight: 600;
    margin: 12px 0 36px 0;
  }

  .eventCard {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    margin-bottom: 12px;
    border-radius: 4px;
    padding: 18px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  }

  .addNew {
    display: flex;
    align-items: center;
    margin-bottom: 48px;
  }

  .formRow {
    margin-bottom: 12px;
    div {
      margin-right: 4px;
    }
  }
`;
