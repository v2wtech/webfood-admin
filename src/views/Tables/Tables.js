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
  Select,
  InputLabel,
  FormControl
} from '@material-ui/core';

import api from "../../services/api";
import { cardHeader } from "assets/jss/material-dashboard-react";

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
  tableNameDialog: {
    fontWeight: '900',
    fontFamily: "'Arial', sans-serif"
  },
  deleteDialogWarn: {
    fontSize: '12px',
    color: 'red'
  }
};

const useStyles = makeStyles(styles);

function DeleteTable(props) {
  const classes = useStyles();

  const tableData = props['table-data'];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function deleteTable(table) {
    api.delete('/tables/' + table.id)
      .then(res => console.log("Mesa", table.name, "removido.")) // TODO: modal
      .catch(err => console.warn(err));
  };

  const handleAcceptAction = () => {
    deleteTable(tableData);
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
        <DialogTitle id="alert-dialog-title">Remover mesa?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Remover permanentemente o mesa <strong className={classes.tableNameDialog}>{tableData.title}</strong>?
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

export default function TableList() {
  const classes = useStyles();

  // Post
  const [form, setForm] = useState({});

  // Status config
  const [tables, setTables] = useState([]);
  const [tablesData, setTablesData] = useState([]);
  const [enabled, setEnabled] = useState({});

  const [search, setSearch] = useState({
    description: '',
    enabled: ''
  });


  // Modal config
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState();

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

  async function loadTables() {
    await api.get('/tables', {
      params: {
        description: search.description,
        enabled: search.enabled
      }
    })
      .then(response => response.data)
      .then(data => setTablesData(data))
      .catch(err => console.warn(err));
  }

  useEffect(() => {
    loadTables();
  }, [search]);

  useEffect(() => {
    async function updateTable(table, data) {
      console.log(data);
      table.enabled = data.enabled;

      await api.put(`/tables/${table.id}`, { enabled: table.enabled })
        .then(res => {
          console.log(`Mesa ${table.description} ${table.enabled ? 'ativado' : 'desativado'}`); // TODO: toaster!
        })
        .catch(err => console.warn(err));
    }

    function parseTables() {
      let enabledStatus = {};

      const isEnabled = (status, table) => {
        enabledStatus = { ...enabledStatus, [table.id]: status };

        if (Object.keys(enabledStatus).length === tablesData.length)
          setEnabled(status);

        return (
          <Tooltip title={enabledStatus[table.id] ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabledStatus[table.id]}
              onChange={() => toggle(table, !enabledStatus[table.id])}
            />
          </Tooltip>
        );
      };

      const toggle = (table, status) => {
        enabledStatus[table.id] = status;

        setEnabled(enabledStatus);
        updateTable(table, { enabled: status });
      };

      const renderActions = (table) =>
        <DeleteTable table-data={table} />;

      setTables(
        tablesData.map(table =>
          [String(table.id),
          table.description,
          isEnabled(table.enabled, table),
          renderActions(table)
          ])
      );
    }

    parseTables();
  }, [tablesData.length, Object.keys(enabled).length]);

  const handleForm = name => event => {
    setForm({ ...form, [name]: event.target.value });
  };

  const handleSearch = name => event => {
    setSearch({ ...search, [name]: event.target.value });
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    console.log(form);

    await api.post('/tables/register', form)
      .then(response => { console.log(response); })
      .catch(err => console.warn(err));

    setOpen(false);
    loadTables();
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
            id="searchTable"
            value={search.description}
            onChange={handleSearch('description')}
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
                        label="Mesa"
                        id="descriptionTable"
                        value={form.description}
                        onChange={handleForm('description')}
                        style={{ width: "93%" }}
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
              <h4 className={classes.cardTitleWhite}>Mesas</h4>
              <p className={classes.cardCategoryWhite}>
                Lista de mesas
            </p>
            </CardHeader>

            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["#", "Mesa", "Status", "Ações"]}
                tableData={tables}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer >
    </>
  );
}
