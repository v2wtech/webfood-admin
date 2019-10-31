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
  clientNameDialog: {
    fontWeight: '900',
    fontFamily: "'Arial', sans-serif"
  },
  deleteDialogWarn: {
    fontSize: '12px',
    color: 'red'
  }
};

const useStyles = makeStyles(styles);

function DeleteClient(props) {
  const classes = useStyles();

  const clientData = props['client-data'];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function deleteClient(client) {
    api.delete('/clients/' + client.id)
      .then(res => console.log("Cliente", client.name, "removido.")) // TODO: modal
      .catch(err => console.warn(err));
  };

  const handleAcceptAction = () => {
    deleteClient(clientData);
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
        <DialogTitle id="alert-dialog-title">Remover cliente?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Remover permanentemente o cliente <strong className={classes.clientNameDialog}>{clientData.title}</strong>?
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

export default function ClientList() {
  const classes = useStyles();

  // Post
  const [form, setForm] = useState({});

  // Status config
  const [clients, setClients] = useState([]);
  const [clientsData, setClientsData] = useState([]);
  const [enabled, setEnabled] = useState({});

  const [search, setSearch] = useState({
    phone: '',
    enabled: ''
  });

  async function loadClients() {
    await api.get('/clients', {
      params: {
        phone: search.phone,
        enabled: search.enabled
      }
    })
      .then(response => response.data)
      .then(data => setClientsData(data))
      .catch(err => console.warn(err));
  }

  useEffect(() => {
    loadClients();
  }, [search]);

  useEffect(() => {
    async function updateClient(client, data) {
      console.log(data);
      client.enabled = data.enabled;

      await api.put(`/clients/${client.id}`, { enabled: client.enabled })
        .then(res => {
          console.log(`Cliente ${client.name} ${client.enabled ? 'ativado' : 'desativado'}`); // TODO: toaster!
        })
        .catch(err => console.warn(err));
    }

    function parseClients() {
      let enabledStatus = {};

      const isEnabled = (status, client) => {
        enabledStatus = { ...enabledStatus, [client.id]: status };

        if (Object.keys(enabledStatus).length === clientsData.length)
          setEnabled(status);

        return (
          <Tooltip title={enabledStatus[client.id] ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabledStatus[client.id]}
              onChange={() => toggle(client, !enabledStatus[client.id])}
            />
          </Tooltip>
        );
      };

      const toggle = (client, status) => {
        enabledStatus[client.id] = status;

        setEnabled(enabledStatus);
        updateClient(client, { enabled: status });
      };

      const renderActions = (client) =>
        <DeleteClient client-data={client} />;

      setClients(
        clientsData.map(client =>
          [String(client.id),
          client.name,
          client.phone,
          client.address,
          isEnabled(client.enabled, client),
          renderActions(client)
          ])
      );
    }

    parseClients();
  }, [clientsData.length, Object.keys(enabled).length]);

  const handleSearch = name => event => {
    setSearch({ ...search, [name]: event.target.value });
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    console.log(form);

    await api.post('/clients/register', form)
      .then(response => { console.log(response); })
      .catch(err => console.warn(err));

    loadClients();
  };

  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={12} md={5}>
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
            id="searchClient"
            value={search.phone}
            onChange={handleSearch('phone')}
            style={{ width: "100%" }}
          />
        </GridItem>

      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Clientes</h4>
              <p className={classes.cardCategoryWhite}>
                Lista de clientes
            </p>
            </CardHeader>

            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["#", "Cliente", "Telefone", "Endereço", "Status", "Ações"]}
                tableData={clients}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer >
    </>
  );
}
