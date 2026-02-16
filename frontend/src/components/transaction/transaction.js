import css from "./Transaction.module.css";
import calendarCss from "./TransactionCalendar.module.css";
import api from "../../api/api"; 
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  editTransaction,
} from "../../redux/transactions/transactionThunks";
import ReactDOM from "react-dom";
import List from "../List/List";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getValidationSchema } from "./Transaction.schema";
import ClipLoader from "react-spinners/ClipLoader";
import { categoryOptions } from "../../constants/constants";

const TransactionForm = ({ onItemClick, isEditing, type, transactionId }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.session.user.id);
  const [isIncome, setIsIncome] = useState(
    isEditing ? (type === "income" ? true : false) : true
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);
  const [inputDate, setInputDate] = useState("");
  const [initialValues, setInitialValues] = useState();

  const handleInputDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    setInputDate(formattedDate);
  };

  const handleModalClose = () => {
    onItemClick();
  };

  const handleSwitchButton = () => {
    setIsIncome(!isIncome);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const toggleCategoryList = () => {
    setShowCategoryList(!showCategoryList);
  };

  const handleCategorySelect = (category, setFieldValue) => {
    setFieldValue("category", category);
    setShowCategoryList(false);
  };

  const handleAmountFormat = (value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      return parsedValue.toFixed(2);
    } else {
      return "";
    }
  };

  const handleAmountBlur = (value, setFieldValue) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      const formattedValue = Number(parsedValue.toFixed(2));
      setFieldValue("amount", formattedValue);
    } else {
      setFieldValue("amount", "");
    }
  };

  const fetchTransactionById = async () => {
    try {
      const response = await api.get(`/home/${transactionId}`, {
        params: { userId },
      });
      if (response.status === 200) {
        const transaction = response.data.data.transaction;
        const formattedAmount = handleAmountFormat(transaction.amount);
        setInitialValues({
          category: transaction.category,
          amount: formattedAmount,
          date: new Date(transaction.date),
          comment: transaction.comment,
        });
        handleInputDate(new Date(transaction.date));
      } else {
        throw new Error("Failed to fetch transaction");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const transactionData = {
      type: isIncome ? "income" : "expense",
      ...values,
      userId,
    };

    try {
      if (isEditing) {
        const result = await dispatch(editTransaction({ 
          id: transactionId, 
          userId, 
          updatedTransaction: transactionData 
        }));
        if (editTransaction.fulfilled.match(result)) {
          toast.success("Transaction updated successfully!");
        } else {
          throw new Error("Failed to update transaction");
        }
      } else {
        const result = await dispatch(addTransaction(transactionData));
        if (addTransaction.fulfilled.match(result)) {
          toast.success("Transaction added successfully!");
        } else {
          throw new Error("Failed to add transaction");
        }
      }
      setTimeout(() => {
        handleModalClose();
      }, 3000);
    } catch (error) {
      toast.error(
        isEditing
          ? "Failed to update transaction."
          : "Failed to add transaction."
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      fetchTransactionById();
    } else {
      setInitialValues({
        category: "",
        amount: "",
        date: new Date(),
        comment: "",
      });
      handleInputDate(new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ReactDOM.createPortal(
    <div className={css.modalOverlay}>
      <div
        className={`${css.formWrapper} ${
          isIncome ? "" : css.expenseFormWrapper
        }`}
      >
        {initialValues ? (
          <>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <img
              src="/close.svg"
              alt="Close"
              className={css.closeIcon}
              onClick={handleModalClose}
            />
            {isEditing ? (
              <h2 className={css.formTitle}>Edit transaction</h2>
            ) : (
              <h2 className={css.formTitle}>Add transaction</h2>
            )}

            <div
              className={`${css.switchContainer} ${
                isEditing ? css.infoContainer : ""
              }`}
            >
              <div className={isIncome ? css.income : css.text}>Income</div>
              {isEditing ? (
                <img src="/slash.svg" alt="Slash" className={css.slashIcon} />
              ) : (
                <div className={css.switchButton} onClick={handleSwitchButton}>
                  {isIncome ? (
                    <img src="/add.svg" alt="Add" className={css.plusIcon} />
                  ) : (
                    <img
                      src="/minus.svg"
                      alt="Minus"
                      className={css.minusIcon}
                    />
                  )}
                </div>
              )}
              <div className={!isIncome ? css.expense : css.text}>Expense</div>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={getValidationSchema(isIncome)}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, values }) => (
                <Form className={css.form} autoComplete="off">
                  {!isIncome && (
                    <div className={css.inputGroup}>
                      <Field
                        type="text"
                        name="category"
                        className={`${css.input} ${css.categoryInput}`}
                        placeholder="Select a category"
                        value={values.category}
                        onClick={toggleCategoryList}
                        readOnly
                      />
                      <img
                        src="/arrow.svg"
                        alt="Arrow icon"
                        className={css.arrowIcon}
                        onClick={toggleCategoryList}
                      />
                      {showCategoryList && (
                        <div className={css.listContainer}>
                          <List
                            data={categoryOptions}
                            onItemClick={(category) =>
                              handleCategorySelect(category, setFieldValue)
                            }
                            isCategoryList={true}
                          />
                        </div>
                      )}
                      <ErrorMessage
                        name="category"
                        component="div"
                        className={css.error}
                      />
                    </div>
                  )}

                  <div className={css.inputGroupRow}>
                    <div className={css.inputGroup}>
                      <Field
                        type="number"
                        name="amount"
                        className={`${css.input} ${css.amountInput}`}
                        placeholder="0.00"
                        step="0.01"
                        min={0}
                        value={values.amount}
                        onBlur={(e) =>
                          handleAmountBlur(e.target.value, setFieldValue)
                        }
                      />
                      <ErrorMessage
                        name="amount"
                        component="div"
                        className={css.error}
                      />
                    </div>

                    <div className={css.inputGroup}>
                      <Field
                        type="text"
                        name="date"
                        className={`${css.input} ${css.dateInput}`}
                        value={inputDate}
                        disabled
                      />
                      <img
                        src="/calendar.svg"
                        alt="Calendar icon"
                        className={css.calendarIcon}
                        onClick={toggleCalendar}
                      />
                    </div>
                  </div>

                  <div className={css.inputGroup}>
                    <Field
                      as="textarea"
                      name="comment"
                      className={`${css.input} ${css.commentInput}`}
                      placeholder="Comment"
                    />
                    <ErrorMessage
                      name="comment"
                      component="div"
                      className={css.error}
                    />
                  </div>

                  <div className={css.buttonGroup}>
                    <button type="submit" className={css.addButton}>
                      {isEditing ? "Save" : "Add"}
                    </button>
                    <button
                      type="button"
                      className={css.cancelButton}
                      onClick={handleModalClose}
                    >
                      Cancel
                    </button>
                  </div>
                  {showCalendar && (
                    <div className={calendarCss.calendarContainer}>
                      <Calendar
                        locale="en-US"
                        onChange={(selectedDate) => {
                          setFieldValue("date", selectedDate);
                          setShowCalendar(false);
                          handleInputDate(selectedDate);
                        }}
                        value={values.date}
                        className={calendarCss.reactCalendar}
                      />
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <ClipLoader color="#4A56E2" size={100} />
        )}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default TransactionForm;
