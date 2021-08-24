import PersonalOrderBook from "./personalOB/PersonalOrderBook";
import AggregatedOrderBook from "./aggregatedOB/AggregatedOrderBook";
import OBstyle from "./OB.module.css";

const OrderBooks = () => {
  return (
    <div className={OBstyle.orderBooks}>
      <PersonalOrderBook />
      <AggregatedOrderBook />
    </div>
  );
};

export default OrderBooks;
