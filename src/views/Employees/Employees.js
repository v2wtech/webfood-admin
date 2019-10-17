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
import CardFooter from "components/Card/CardFooter.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Switch from '@material-ui/core/Switch';
import Tooltip from '@material-ui/core/Tooltip';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

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
  },
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: '#FFF',
    border: 'none',
    borderRadius: '5px',
  },
};

const useStyles = makeStyles(styles);

export default function EmployeeList() {
  const classes = useStyles();
  // Post
  const [form, setForm] = useState({});

  // Status config
  const [employees, setEmployees] = useState([]);
  const [enabled, setEnabled] = useState({});
  const [shouldChange, setShouldChange] = useState(true);

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function loadEmployees() {
      await api.get('/employees', {
        params: {
          name: '',
          enabled: ''
        }})
        .then(response => response.data)
        .then(data => parseEmployees(data))
        .catch(err => console.warn(err));
    }

    const handleEnabled = (id, status) =>
          setEnabled({ [id]: status });

    async function updateEmployee(employee, data) {
      employee.enabled = data.enabled;

      api.put(`/employees/${employee.id}`, { enabled: employee.enabled })
        .then(res => {
          console.log(res);
          console.log(`Funcionário ${employee.name} ${employee.enabled ? 'ativado' : 'desativado'}`);
          // TODO: toaster!
        })
        .catch(err => console.warn(err));
    }

    function parseEmployees(employees) {
      const isEnabled = (status, employee) => {
        // console.log('id: ', employee.id, 'status: ', status);
        // console.log('setEnabled: ', { [employee.id]: status });

        if (shouldChange)
          handleEnabled(employee, status);

        console.log('enabled', employee.id, enabled[employee.id]);

        setShouldChange(false);

        return (
          <Tooltip title={enabled ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabled[employee.id]}
              onChange={() => toggle(employee, !enabled[employee.id])}
            />
          </Tooltip>
        );
      };

      const toggle = (employee, status) => {
        handleEnabled(employee.id, status);
        updateEmployee(employee, { enabled: status });
      };

      setEmployees(
        employees.map(employee =>
          [String(employee.id),
            employee.name,
            employee.cpf,
            employee.phone,
            employee.role ? 'Administrador' : 'Usuário',
            employee.permission ? 'Sim' : 'Não',
            employee.user,
            isEnabled(employee.enabled, employee)
          ])
      );
    }

    loadEmployees();
  }, [form]);

  const handleForm = name => event => {
    setForm({ ...form, role: 1, permission: 1, [name]: event.target.value });
  };

  async function handleSubmit(evt) {
    evt.preventDefault();

    console.log(form);

    await api.post('/employees/register', form)
      .then(response => {console.log(response); })
      .catch(err => console.warn(err))
  }


  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Button color="success" onClick={handleOpen}> novo </Button>

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={handleClose}
        >
          <form style={modalStyle} className={classes.paper} onSubmit={handleSubmit}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <Card>
                  <CardBody>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <TextField
                          label="Nome"
                          id="nameEmployee"
                          value={form.name}
                          onChange={handleForm('name')}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          label="CPF"
                          id="cpfEmployee"
                          value={form.cpf}
                          onChange={handleForm('cpf')}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          label="Telefone"
                          id="phoneEmployee"
                          value={form.phone}
                          onChange={handleForm('phone')}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <label htmlFor="permissionEmployee">Administrador</label>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <label htmlFor="permissionEmployee">Acesso ao Sistema</label>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <TextField
                          label="Usuário"
                          id="userEmployee"
                          value={form.user}
                          onChange={handleForm('user')}
                        />
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          label="Senha"
                          id="passwordEmployee"
                          value={form.password}
                          onChange={handleForm('password')}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        <TextField
                          label="Confirmar Senha"
                          id="verifyPassword"
                        />
                      </GridItem>
                    </GridContainer>
                  </CardBody>
                  <CardFooter>
                    <Button color="primary" type="submit">Salvar</Button>
                  </CardFooter>
                </Card>
              </GridItem>
            </GridContainer>
          </form>
        </Modal>

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
