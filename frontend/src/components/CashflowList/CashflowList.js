import css from "./CashflowList.module.css";
import TransactionForm from "../Transaction/Transaction";
import DeleteModal from "../Modal/DeleteModal";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  deleteTransaction,
} from "../../redux/transactions/transactionThunks";
import {
  setCurrentPage,
  setLoading,
  setTransactionId,
  resetState,
} from "../../redux/transactions/transactionSlice";
import { format } from "date-fns";
import ClipLoader from "react-spinners/ClipLoader";

const CashflowList = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.session.user.id);
  const { transactions, loading, currentPage, hasMore, transactionId } =
    useSelector((state) => state.transaction);

  const [type, setType] = useState();
  const [showEditTransaction, setShowEditTransaction] = useState(false);

  const deleteDialogRef = useRef(null);

  const formatDate = (date) => format(new Date(date), "dd.MM.yy");

  const handleEditClick = (id, transactionType) => {
    setType(transactionType);
    dispatch(setTransactionId(id));
    setShowEditTransaction(true);
  };

  const handleCloseEdit = () => {
    setType();
    dispatch(setTransactionId(null));
    setShowEditTransaction(false);
  };

  const handleDeleteClick = (id) => {
    dispatch(setTransactionId(id));
    deleteDialogRef.current.showModal();
  };

  const handleCancelDelete = () => {
    dispatch(setTransactionId(null));
    deleteDialogRef.current.close();
  };

  const handleConfirmDelete = async () => {
    dispatch(deleteTransaction({ id: transactionId, userId }));
    deleteDialogRef.current.close();
  };

  useEffect(() => {
    dispatch(fetchTransactions({ page: 1, limit: 10, userId }));
    return () => {
      dispatch(resetState());
    };
  }, [dispatch, userId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (!loading && hasMore) {
          dispatch(setLoading(true));
          dispatch(setCurrentPage(currentPage + 1));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, currentPage, dispatch]);

  useEffect(() => {
        if (currentPage > 1) {
    dispatch(fetchTransactions({ page: currentPage, limit: 10, userId }));
        }
  }, [dispatch, currentPage, userId]);

  return (
    <div className={css.listContainer}>
      {loading && currentPage === 1 ? (
        <div className={css.spinnerContainer}>
          <ClipLoader color="#4A56E2" size={100} />
        </div>
      ) : (
        <>
          <ul className={`${css.list} ${css.mobile}`}>
            {transactions.map((item) => (
              <li key={item._id} className={`${css.item} ${css[item.type]}`}>
                <div className={css.section}>
                  <span className={css.name}>Date</span>
                  <span className={css.value}>{formatDate(item.date)}</span>
                </div>
                <div className={css.section}>
                  <span className={css.name}>Type</span>
                  <span className={css.value}>{item.type}</span>
                </div>
                <div className={css.section}>
                  <span className={css.name}>Category</span>
                  <span className={css.value}>
                    {item.type === "income" ? "Income" : item.category}
                  </span>
                </div>
                <div className={css.section}>
                  <span className={css.name}>Comment</span>
                  <span className={`${css.value} ${css.comment}`}>
                    {item.comment}
                  </span>
                </div>
                <div className={css.section}>
                  <span className={css.name}>Sum</span>
                  <span className={css.value}>
                    {item.amount >= 0
                      ? `${item.amount.toFixed(2)}`
                      : `${Math.abs(item.amount).toFixed(2)}`}
                  </span>
                </div>
                <div className={css.buttons}>
                  <button
                    className={css.deleteBtn}
                    onClick={() => handleDeleteClick(item._id)}
                  >
                    Delete
                  </button>
                  <button
                    className={css.editBtn}
                    onClick={() => handleEditClick(item._id, item.type)}
                  >
                    <img src="/edit.svg" alt="Edit" className={css.editIcon} />
                    Edit
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <ul className={`${css.list} ${css.tablet}`}>
            <div className={css.header}>
              <span>Date</span>
              <span className={css.type}>Type</span>
              <span>Category</span>
              <span className={css.comment}>Comment</span>
              <span>Sum</span>
            </div>
            {transactions.map((item) => (
              <li
                key={item._id}
                className={`${css.tabletItem} ${
                  item.type === "income" ? css.tabletIncome : css.tabletExpense
                }`}
              >
                <div className={css.dataContainer}>
                  <span className={`${css.value} ${css.date}`}>
                    {formatDate(item.date)}
                  </span>
                  <span className={`${css.value} ${css.typeValue}`}>
                    {item.type === "income" ? "+" : "-"}
                  </span>
                  <span className={`${css.value} ${css.categoryValue}`}>
                    {item.type === "income" ? "Income" : item.category}
                  </span>
                  <span className={`${css.value} ${css.commentValue}`}>
                    {item.comment}
                  </span>
                  <span className={`${css.value} ${css.sum}`}>
                    {item.amount >= 0
                      ? `${item.amount.toFixed(2)}`
                      : `${Math.abs(item.amount).toFixed(2)}`}
                  </span>
                </div>
                <div className={css.buttons}>
                  <button
                    className={css.editBtn}
                    onClick={() => handleEditClick(item._id, item.type)}
                  >
                    <img src="/edit.svg" alt="Edit" className={css.editIcon} />
                  </button>
                  <button
                    className={css.deleteBtn}
                    onClick={() => handleDeleteClick(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {loading && currentPage > 1 && (
            <div className={css.spinnerContainer}>
              <ClipLoader color="#4A56E2" size={100} />
            </div>
          )}
        </>
      )}
      {showEditTransaction && (
        <div className={css.transactionForm}>
          <TransactionForm
            onItemClick={handleCloseEdit}
            isEditing={true}
            type={type}
            transactionId={transactionId}
          />
        </div>
      )}
      <DeleteModal
        ref={deleteDialogRef}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default CashflowList;
