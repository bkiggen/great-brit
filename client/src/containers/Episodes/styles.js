import { css } from "@emotion/css";

export const styles = css`
  display: flex;
  min-height: 900px;
  width: 70%;
  background-color: var(--manilla);
  margin: 0 auto;
  margin-top: 160px;
  border-radius: 0 4px 4px 0;

  .tabs {
    width: 40px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: var(--baby-blue);

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
  }
`;
