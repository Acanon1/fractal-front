import React from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  return (
    <div>

      <nav>
        <div className="logo">OrderHub</div>
        <div>
          <NavLink
            to="/my-orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Orders
          </NavLink>
          <NavLink
            to="/add-order"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Add Order
          </NavLink>
        </div>
      </nav>


      <main>
        <Outlet />
      </main>
    </div>
  );
}
