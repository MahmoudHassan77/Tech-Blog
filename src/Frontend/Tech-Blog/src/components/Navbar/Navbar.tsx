import React from "react";
import style from "./Navbar.module.scss";
interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  return <div className={style.navbar}>Navbar</div>;
};

export default Navbar;
