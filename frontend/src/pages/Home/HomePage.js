import Balance from "../../components/Balance/Balance";
import CashflowList from "../../components/CashflowList/CashflowList";
import MobileNavigation from "../../components/Navigation/MobileNavigation";
import MainPanel from "../../components/MainPanel/MainPanel";
import TransactionForm from "../../components/Transaction/Transaction";
import css from "./HomePage.module.css";
import MediaQuery from "react-responsive";
import { useState } from "react";

const HomePage = () => {
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  return (
    <div className={css.page}>
      <MobileNavigation />
      <MediaQuery maxWidth={767.5}>
        <Balance />
      </MediaQuery>
      <MainPanel>
        <CashflowList  />
        <img
          src="/add.svg"
          alt="Add"
          className={css.addIcon}
          onClick={() => setShowAddTransaction(true)}
        />
        {showAddTransaction && (
          <div className={css.transactionForm}>
            <TransactionForm onItemClick={() => setShowAddTransaction(false)} />
          </div>
        )}
      </MainPanel>
    </div>
  );
};

export default HomePage;
