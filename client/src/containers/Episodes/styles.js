import { css } from "@emotion/css";

export const styles = css`
  width: 100%;
  padding-top: 180px;
  padding-bottom: 80px;
  width: 90%;
  margin: 0 auto;

  .folder {
    background-color: var(--manilla);
    border-radius: 0 4px 4px 0;
    min-height: 900px;
    display: flex;
    margin-top: 24px;

    .tabs {
      width: 40px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      background: rgb(250, 247, 242);
      .tab {
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px 0 0 4px;
        cursor: pointer;
        margin-bottom: -4px;
        transition: 0.2s all;
      }

      .inactive {
        background-color: var(--manilla-dark);
        min-height: 70px;
      }

      .active {
        background-color: var(--manilla);
        z-index: 2;
        min-height: 110px;
      }
    }
    .main {
      width: calc(100% - 90px);
      margin: 30px;
      background: white;
      padding: 24px;

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
    }
  }
`;
