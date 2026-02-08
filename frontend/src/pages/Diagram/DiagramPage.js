import MobileNavigation from "../../components/Navigation/MobileNavigation";
import AppShell from "../../components/AppShell/AppShell";
import Diagram from "../../components/Diagram/Diagram";
import css from "./DiagramPage.module.css";

const DiagramPage = () => {
  return (
    <div className={css.page}>
      <MobileNavigation />
      <AppShell>
        <Diagram />
      </AppShell>
    </div>
  );
};

export default DiagramPage;
