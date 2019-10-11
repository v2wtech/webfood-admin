import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';

import api from "../../services/api";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};

const useStyles = makeStyles(styles);

export default function EmployeeList() {
  const classes = useStyles();

  const [employees, setEmployees] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [render, setRender] = useState(true);

  useEffect(() => {
    async function loadEmployees() {
      await api.get('/employees?name&enabled')
        .then(response => response.data)
        .then(data => parseEmployees(data))
        .catch(err => console.warn(err));
    }

    async function updateEmployee(employee, data) {
      employee.enabled = data.enabled;

      api.put(`/employees/update/${employee.id}`, employee)
        .then(res => console.log(res))
        .catch(err => console.warn(err));
    }

    function parseEmployees(employees) {
      const isEnabled = (status, employee) => {
        if (render)
          setEnabled(status);

        setRender(false);

        return (
          <Tooltip title={enabled ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabled}
              onChange={() => { toggle(employee, !enabled); }}
            />
          </Tooltip>
        );
      };

      const toggle = (employee, status) => {
        setEnabled(status);
        updateEmployee(employee, { enabled: status });
      };

      setEmployees(
        employees.map(employee =>
        [employee.id,
          employee.name,
          employee.cpf,
          employee.phone,
          employee.role,
          employee.permission ? 'Sim' : 'Não',
          employee.user,
          isEnabled(employee.enabled, employee)
        ])
      );
    }

    loadEmployees();
  }, [enabled]);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Link to="/admin/register">
          <Button color="success"> novo </Button>
        </Link>

        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Funcionários</h4>
            <p className={classes.cardCategoryWhite}>
              Lista de Funcionários
            </p>
          </CardHeader>

          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["#", "Nome", "Cpf", "Telefone", "Tipo", "Permissão", "Usuário", "Status"]}
              tableData={employees}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
