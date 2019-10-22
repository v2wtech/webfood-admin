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
  DialogTitle
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
  groupNameDialog: {
    fontWeight: '900',
    fontFamily: "'Arial', sans-serif"
  },
  deleteDialogWarn: {
    fontSize: '12px',
    color: 'red'
  }
};

const useStyles = makeStyles(styles);

function DeleteGroup(props) {
  const classes = useStyles();

  const groupData = props['group-data'];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function deleteGroup(group) {
    api.delete('/groups/' + group.id)
      .then(res => console.log("Grupo", group.name, "removido.")) // TODO: modal
      .catch(err => console.warn(err));
  };

  const handleAcceptAction = () => {
    deleteGroup(groupData);
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
        <DialogTitle id="alert-dialog-title">Remover grupo?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Remover permanentemente o grupo <strong className={classes.groupNameDialog}>{groupData.title}</strong>?
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

export default function GroupList() {
  const classes = useStyles();

  // Post
  const [form, setForm] = useState({});

  // Status config
  const [groups, setGroups] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [enabled, setEnabled] = useState({});

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

  useEffect(() => {
    async function loadGroups() {
      await api.get('/groups', {
        params: {
          title: '',
          enabled: ''
        }
      })
        .then(response => response.data)
        .then(data => setGroupsData(data))
        .catch(err => console.warn(err));
    }

    loadGroups();
  }, []);

  useEffect(() => {
    async function updateGroup(group, data) {
      console.log(data);
      group.enabled = data.enabled;

      await api.put(`/groups/${group.id}`, { enabled: group.enabled })
        .then(res => {
          console.log(`Grupo ${group.title} ${group.enabled ? 'ativado' : 'desativado'}`); // TODO: toaster!
        })
        .catch(err => console.warn(err));
    }

    function parseGroups() {
      let enabledStatus = {};

      const isEnabled = (status, group) => {
        enabledStatus = { ...enabledStatus, [group.id]: status };

        if (Object.keys(enabledStatus).length === groupsData.length)
          setEnabled(status);

        return (
          <Tooltip title={enabledStatus[group.id] ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabledStatus[group.id]}
              onChange={() => toggle(group, !enabledStatus[group.id])}
            />
          </Tooltip>
        );
      };

      const toggle = (group, status) => {
        enabledStatus[group.id] = status;

        setEnabled(enabledStatus);
        updateGroup(group, { enabled: status });
      };

      const renderActions = (group) =>
        <DeleteGroup group-data={group} />;

      setGroups(
        groupsData.map(group =>
          [String(group.id),
          group.title,
          isEnabled(group.enabled, group),
          renderActions(group)
          ])
      );
    }

    parseGroups();
  }, [groupsData.length, Object.keys(enabled).length]);

  const handleForm = name => event => {
    setForm({ ...form, [name]: event.target.value });
  };

  async function handleSubmit(evt) {
    evt.preventDefault();

    console.log(form);

    await api.post('/groups/register', form)
      .then(response => { console.log(response); })
      .catch(err => console.warn(err));
  };

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
                          label="Grupo"
                          id="titleGroup"
                          value={form.title}
                          onChange={handleForm('title')}
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

        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Grupos</h4>
            <p className={classes.cardCategoryWhite}>
              Lista de grupos
            </p>
          </CardHeader>

          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["#", "Grupo", "Status", "Ações"]}
              tableData={groups}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
