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
  Select,
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
  categoryNameDialog: {
    fontWeight: '900',
    fontFamily: "'Arial', sans-serif"
  },
  deleteDialogWarn: {
    fontSize: '12px',
    color: 'red'
  }
};

const useStyles = makeStyles(styles);

function DeleteCategory(props) {
  const classes = useStyles();

  const categoryData = props['category-data'];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function deleteCategory(category) {
    api.delete('/categories/' + category.id)
      .then(res => console.log("Categoria", category.title, "removida.")) // TODO: modal
      .catch(err => console.warn(err));
  };

  const handleAcceptAction = () => {
    deleteCategory(categoryData);
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
        <DialogTitle id="alert-dialog-title">Remover categoria?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Remover permanentemente o categoria <strong className={classes.categoryNameDialog}>{categoryData.title}</strong>?
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

export default function CategoryList() {
  const classes = useStyles();

  const [groups, setGroups] = useState([]);

  // Post
  const [form, setForm] = useState({});

  // Status config
  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
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
        .then(data => setGroups(data))
        .catch(err => console.warn(err));
    }

    loadGroups();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      await api.get('/categories', {
        params: {
          title: '',
          enabled: ''
        }
      })
        .then(response => response.data)
        .then(data => setCategoriesData(data))
        .catch(err => console.warn(err));
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function updateCategory(category, data) {
      console.log(data);
      category.enabled = data.enabled;

      api.put(`/categories/${category.id}`, { enabled: category.enabled })
        .then(res => {
          console.log(`Categoria ${category.title} ${category.enabled ? 'ativado' : 'desativado'}`); // TODO: toaster!
        })
        .catch(err => console.warn(err));
    }

    function parseCategories() {
      let enabledStatus = {};

      const isEnabled = (status, category) => {
        enabledStatus = { ...enabledStatus, [category.id]: status };

        if (Object.keys(enabledStatus).length === categoriesData.length)
          setEnabled(status);

        return (
          <Tooltip title={enabledStatus[category.id] ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabledStatus[category.id]}
              onChange={() => toggle(category, !enabledStatus[category.id])}
            />
          </Tooltip>
        );
      };

      const toggle = (category, status) => {
        enabledStatus[category.id] = status;

        setEnabled(enabledStatus);
        updateCategory(category, { enabled: status });
      };

      const renderActions = (category) =>
        <DeleteCategory category-data={category} />;

      setCategories(
        categoriesData.map(category =>
          [String(category.id),
          category.title,
          isEnabled(category.enabled, category),
          renderActions(category)
          ])
      );
    }

    parseCategories();
  }, [categoriesData.length, Object.keys(enabled).length]);

  const handleForm = name => event => {
    setForm({ ...form, [name]: event.target.value });
  };

  async function handleSubmit(evt) {
    evt.preventDefault();

    console.log(form);

    await api.post('/categories/register', form)
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
                        <FormControl className={classes.formControl} style={{ width: "50%" }}>
                          <InputLabel htmlFor="age-native-simple">Grupo</InputLabel>
                          <Select
                            native
                            value={form.groupId}
                            onChange={handleForm('groupId')}
                          >
                            <option value="" />
                            {groups.map(group => <option value={group.id}>{group.title}</option>)}
                          </Select>
                        </FormControl>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={12}>
                        <TextField
                          label="Categoria"
                          id="titleCategory"
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
            <h4 className={classes.cardTitleWhite}>Categorias</h4>
            <p className={classes.cardCategoryWhite}>
              Lista de categorias
            </p>
          </CardHeader>

          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["#", "Categoria", "Status", "Ações"]}
              tableData={categories}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
