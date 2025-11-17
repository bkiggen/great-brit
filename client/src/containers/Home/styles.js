import { css } from "@emotion/css";

export const bankHistoryStyles = css`
  padding-left: 32px;
  .bank-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .episode {
      font-size: 18px;
      font-weight: 600;
      margin-right: 12px;
    }

    .value {
      font-size: 16px;
    }
  }
`;
