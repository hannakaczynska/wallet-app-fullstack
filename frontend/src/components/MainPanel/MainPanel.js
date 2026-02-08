import DesktopNavigation from "../Navigation/DesktopNavigation";
import Balance from "../Balance/Balance";
import Current from "../Current/Current";
import css from "./MainPanel.module.css";
import MediaQuery from "react-responsive";

const MainPanel = ({ children }) => {
  return (
    <>
      <MediaQuery minWidth={768}>
        <div className={css.shellPanel}>
          <div className={css.container}>
            <DesktopNavigation />
            <Balance />
          </div>
          <div className={css.current}>
            <Current />
          </div>
        </div>
        <div className={css.separator}></div>
        <img src="/ellipse2.svg" alt="Ellipse" className={css.ellipseTwo} />
        <img src="/ellipse1.svg" alt="Ellipse" className={css.ellipseOne} />
      </MediaQuery>
      {children}
    </>
  );
};

export default MainPanel;
