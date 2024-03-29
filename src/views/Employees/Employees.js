import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import DeleteIcon from '@material-ui/icons/Delete';

import {
  Tooltip,
  Modal,
  Switch,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core';

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
  employeeNameDialog: {
    fontWeight: '900',
    fontFamily: "'Arial', sans-serif"
  },
  deleteDialogWarn: {
    fontSize: '12px',
    color: 'red'
  }
};

const useStyles = makeStyles(styles);

function DeleteEmployee(props) {
  const classes = useStyles();

  const employeeData = props['employee-data'];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function deleteEmployee(employee) {
    api.delete('/employees/' + employee.id)
      .then(res => console.log("Funcionário", employee.name, "removido.")) // TODO: modal
      .catch(err => console.warn(err));
  };

  const handleAcceptAction = () => {
    deleteEmployee(employeeData);
    setOpen(false);
  };

  return (
    <div>
      <IconButton aria-label="delete" onClick={handleOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Remover funcionário?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Remover permanentemente o funcionário <strong className={classes.employeeNameDialog}>{employeeData.name}</strong>?
      <p className={classes.deleteDialogWarn}>Esta ação não pode ser revertida!</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAcceptAction} color="danger">
            Sim
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Não
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function EmployeeList() {
  const classes = useStyles();

  // Post
  const [form, setForm] = useState({});

  // Status config
  const [employees, setEmployees] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [enabled, setEnabled] = useState({});

  const [search, setSearch] = useState({
    name: '',
    enabled: ''
  });

  // Modal config
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState();
  const [tooltip, setTooltip] = React.useState({})

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

  async function loadEmployees() {
    await api.get('/employees', {
      params: {
        name: search.name,
        enabled: search.enabled
      }
    })
      .then(response => response.data)
      .then(data => setEmployeesData(data))
      .catch(err => console.warn(err));
  }

  useEffect(() => {
    loadEmployees();
  }, [search]);

  useEffect(() => {
    async function updateEmployee(employee, data) {
      console.log(data);
      employee.enabled = data.enabled;

      api.put(`/employees/${employee.id}`, { enabled: employee.enabled })
        .then(res => {
          console.log(`Funcionário ${employee.name} ${employee.enabled ? 'ativado' : 'desativado'}`); // TODO: toaster!
        })
        .catch(err => console.warn(err));
    }

    function parseEmployees() {
      let enabledStatus = {};

      const isEnabled = (status, employee) => {
        enabledStatus = { ...enabledStatus, [employee.id]: status };

        if (Object.keys(enabledStatus).length === employeesData.length)
          setEnabled(status);

        return (
          <Tooltip title={enabledStatus[employee.id] ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabledStatus[employee.id]}
              onChange={() => toggle(employee, !enabledStatus[employee.id])}
            />
          </Tooltip>
        );
      };

      const toggle = (employee, status) => {
        enabledStatus[employee.id] = status;

        setEnabled(enabledStatus);
        updateEmployee(employee, { enabled: status });
      };

      const renderActions = (employee) =>
        <DeleteEmployee employee-data={employee} />;

      setEmployees(
        employeesData.map(employee =>
          [String(employee.id),
          employee.name,
          employee.cpf,
          employee.phone,
          employee.role ? 'Administrador' : 'Usuário',
          employee.permission ? 'Sim' : 'Não',
          employee.user,
          isEnabled(employee.enabled, employee),
          renderActions(employee)
          ])
      );
    }

    parseEmployees();
  }, [employeesData.length, Object.keys(enabled).length]);

  const handleForm = name => event => {
    setForm({ ...form, [name]: event.target.value });
  };

  const handleSearch = name => event => {
    setSearch({ ...search, [name]: event.target.value });
  };

  const handleTooltip = name => event => {
    setTooltip({ ...tooltip, [name]: event.target.checked });
  };

  async function handleSubmit(evt) {
    evt.preventDefault();

    setForm({ ...form, role: tooltip.role, permission: tooltip.permission });

    console.log(form);

    await api.post('/employees/register', form)
      .then(response => { console.log(response); })
      .catch(err => console.warn(err));

    setOpen(false);
    loadEmployees();
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5}>
          <Button color="success" onClick={handleOpen}> novo </Button>
        </GridItem>

        <GridItem xs={12} sm={12} md={2}>
          <FormControl className={classes.formControl} style={{ width: "100%" }}>
            <InputLabel htmlFor="">Status</InputLabel>
            <Select
              native
              value={search.enabled}
              onChange={handleSearch('enabled')}
            >
              <option value="" />
              <option value={1}>Ativos</option>
              <option value={0}>Inativos</option>
            </Select>
          </FormControl>
        </GridItem>


        <GridItem xs={12} sm={12} md={5}>
          <TextField
            label="Buscar"
            id="searchEmployees"
            value={search.name}
            onChange={handleSearch('name')}
            style={{ width: "100%" }}
          />
        </GridItem>
      </GridContainer>

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
                        style={{ width: "93%" }}
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
                      <Tooltip title={tooltip.role ? 'Sim' : 'Não'}>
                        <Switch
                          checked={tooltip.role}
                          onChange={handleTooltip('role')}
                        />
                      </Tooltip>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <label htmlFor="permissionEmployee">Acesso ao Sistema</label>
                      <Tooltip title={tooltip.permission ? 'Sim' : 'Não'}>
                        <Switch
                          checked={tooltip.permission}
                          onChange={handleTooltip('permission')}
                        />
                      </Tooltip>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <TextField
                        label="Usuário"
                        id="userEmployee"
                        value={form.user}
                        onChange={handleForm('user')}
                        style={{ width: "93%" }}
                      />
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        label="Senha"
                        type="password"
                        id="passwordEmployee"
                        value={form.password}
                        onChange={handleForm('password')}
                      />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        label="Confirmar Senha"
                        type="password"
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

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
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
                tableHead={["#", "Nome", "Cpf", "Telefone", "Tipo", "Permissão", "Usuário", "Status", "Ações"]}
                tableData={employees}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
