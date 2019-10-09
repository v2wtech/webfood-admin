
import Dashboard from "@material-ui/icons/Dashboard";
import Notifications from "@material-ui/icons/Notifications";
import DashboardPage from "views/Dashboard/Dashboard.js";
import TableList from "views/TableList/TableList.js";
import Employees from "views/Employees/Employees.js";
import Clients from "views/Clients/Clients.js";
import Products from "views/Products/Products.js"


import NotificationsPage from "views/Notifications/Notifications.js";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin"
  },
  {
    path: "/orders",
    name: "Pedidos",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/products",
    name: "Produtos",
    icon: "fastfood",
    component: Products,
    layout: "/admin"
  },
  {
    path: "/table",
    name: "Table List",
    icon: "content_paste",
    component: TableList,
    layout: "/admin"
  },
  {
    path: "/employees",
    name: "Funcionários",
    icon: "people_alt",
    component: Employees,
    layout: "/admin"
  },
  {
    path: "/clients",
    name: "Clientes",
    icon: "people_alt",
    component: Clients,
    layout: "/admin"
  }
  
];

export default dashboardRoutes;
