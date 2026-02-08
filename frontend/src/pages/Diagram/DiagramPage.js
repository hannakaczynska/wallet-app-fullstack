import MobileNavigation from "../../components/Navigation/MobileNavigation";
import MainPanel from "../../components/MainPanel/MainPanel";
import Diagram from "../../components/Diagram/Diagram";
import css from "./DiagramPage.module.css";

const DiagramPage = () => {
  return (
    <div className={css.page}>
      <MobileNavigation />
      <MainPanel>
        <Diagram />
      </MainPanel>
    </div>
  );
};

export default DiagramPage;
