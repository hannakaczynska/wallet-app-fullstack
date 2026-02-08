import css from "./Diagram.module.css";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";
import List from "../List/List";
import { COLORS, monthOptions, yearOptions } from "../../constants/constants";

const Diagram = () => {
  const currentDate = new Date();
  const currentMonthName = monthOptions[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear().toString(); 

  const userId = useSelector((state) => state.session.user.id);

  const [data, setData] = useState([]);
  const [expenses, setExpenses] = useState();
  const [income, setIncome] = useState();
  const [amount, setAmount] = useState();
  const [showMonthList, setShowMonthList] = useState(false);
  const [showYearList, setShowYearList] = useState(false);
  const [monthNumber, setMonthNumber] = useState();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    const numberFromMonthName = monthOptions.indexOf(month) + 1;
    setMonthNumber(numberFromMonthName);
    fetchStatistics(numberFromMonthName, selectedYear);
    setShowMonthList(false);
  };

    const handleYearSelect = (year) => {
    setSelectedYear(year);
    fetchStatistics(monthNumber, year);
    setShowYearList(false);
  };

    const handleMonthClick = () => {
    setShowMonthList(!showMonthList);
    setShowYearList(false); 
  };

    const handleYearClick = () => {
    setShowYearList(!showYearList);
    setShowMonthList(false)
  };

  const fetchStatistics = useCallback(async (month, year) => {
    try {
    const response = await api.get("/diagram", {
      params: {
        month,
        year,
        userId
      },
    });
      if (response.status !== 200) {
        throw new Error("Failed to fetch statistics");
      }
      const data = response.data;
      setData(data.data.expenses);
      const incomeData = data.data.income.length > 0 ? data.data.income[0].totalIncome : 0;
      setIncome(incomeData.toFixed(2));
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  useEffect(() => {
    const totalExpenses = data.reduce((acc, item) => acc + item.value, 0).toFixed(2);
    setExpenses(totalExpenses);
  }, [data]);

  useEffect(() => {
    const totalIncome = income ? income : 0;
    const totalExpenses = expenses ? expenses : 0;
    const balance = (totalIncome - totalExpenses).toFixed(2);
    setAmount(balance);
  }, [income, expenses]);

  return (
    <div className={css.statistics}>
        <div>
        <h2 className={css.title}>Statistics</h2>
      <div className={css.diagram}>
        <div className={css.balance}>
          ₴ <span className={css.amount}>{amount}</span>
        </div>
        <ResponsiveContainer width="100%" height="100%" aspect={1}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={630}
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={0}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      </div>
      <div>
        <div className={css.buttons}>
            <button className={css.button} onClick={handleMonthClick}>
            {selectedMonth}
            <img src="/arrow-down.svg" alt="" className={css.arrow} />
            {showMonthList && (
              <div className={css.listContainer}>
                <List data={monthOptions} onItemClick={handleMonthSelect} />
              </div>
            )}
          </button>
          <button className={css.button} onClick={handleYearClick}>
            {selectedYear}
            <img src="/arrow-down.svg" alt="" className={css.arrow} />
            {showYearList && (
              <div className={css.listContainer}>
              <List data={yearOptions} onItemClick={handleYearSelect} />
            </div>
            )}
          </button>
        </div>
        <ul className={css.list}>
            <div className={css.listHeader}>
                <div>Category</div>
                <div>Sum</div>
            </div>
            {data.slice().reverse().map((item, index) => (
                <li className={css.listItem} key={item.name}>
                    <div className={css.color} style={{ backgroundColor: COLORS[(data.length - 1 - index) % COLORS.length] }}></div>
                    <div className={css.name}>{item.name}</div>
                    <div className={css.value}>{item.value >= 0
                      ? `${item.value.toFixed(2)}`
                      : `${Math.abs(item.value).toFixed(2)}`}</div>
                </li>
            ))}
        </ul>
        <div className={css.cashflowContainer}>
            <div className={css.cashflow}>
                Expenses:
                <div className={css.expenses}>{expenses}</div>
            </div>
            <div className={css.cashflow}>
                Income:
                <div className={css.income}>{income}</div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Diagram;
