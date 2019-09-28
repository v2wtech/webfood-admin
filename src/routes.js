
import Dashboard from "@material-ui/icons/Dashboard";
import Notifications from "@material-ui/icons/Notifications";
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";
import TableList from "views/TableList/TableList.js";
import Employees from "views/UserProfile/Employees.js";


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
    path: "/Employees",
    name: "Funcionarios",
    icon: "people_alt",
    component: Employees,
    layout: "/admin"
  },
   {
      path: "/cadastrar",
      name: "Cadastrar",
      icon: "people_alt",
      component: UserProfile,
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
    path: "/notifications",
    name: "Notifications",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin"
  },
  {
    path: "/produtos",
    name: "Produtos",
    icon: "fastfood",
    component: NotificationsPage,
    layout: "/admin"
  }
];

export default dashboardRoutes;
