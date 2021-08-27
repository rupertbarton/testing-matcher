import skyline1 from "./skyline1.jpg";
import skyline2 from "./skyline2.jpg";

const Header = () => {
  return (
    <header>
      <div>
        <img src={skyline1} alt="New York Skyline" />
      </div>
      <div>
        <h1>Bugsy's</h1>
        <h2>Bitcoin exchange</h2>
      </div>
      <div>
        <img src={skyline2} alt="New York Skyline" />
      </div>
    </header>
  );
};

export default Header;
