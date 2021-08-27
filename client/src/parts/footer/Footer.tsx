import OrderDisplay from "./orderDisplay/OrderDisplay";
import OrderForm from "./orderForm/OrderForm";
import UserForm from "./userForm/UserForm";

const Footer = () => {
  return (
    <footer>
      <UserForm />
      <OrderForm />
      <OrderDisplay />
    </footer>
  );
};

export default Footer;
