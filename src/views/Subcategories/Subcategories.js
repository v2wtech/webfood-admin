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
  subcategoryNameDialog: {
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

  const subcategoryData = props['subcategory-data'];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function deleteCategory(subcategory) {
    api.delete('/subcategories/' + subcategory.id)
      .then(res => console.log("Subcategoria", subcategory.name, "removida.")) // TODO: modal
      .catch(err => console.warn(err));
  };

  const handleAcceptAction = () => {
    deleteCategory(subcategoryData);
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
        <DialogTitle id="alert-dialog-title">Remover subcategoria?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Remover permanentemente o subcategoria <strong className={classes.subcategoryNameDialog}>{subcategoryData.title}</strong>?
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

  const [categories, setCategories] = useState([]);

  // Post
  const [form, setForm] = useState({});

  // Status config
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesData, setSubcategoriesData] = useState([]);
  const [enabled, setEnabled] = useState({});

  const [search, setSearch] = useState({
    title: '',
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

  useEffect(() => {
    async function loadCategories() {
      await api.get('/categories', {
        params: {
          title: '',
          enabled: ''
        }
      })
        .then(response => response.data)
        .then(data => setCategories(data))
        .catch(err => console.warn(err));
    }

    loadCategories();
  }, []);

  async function loadSubcategories() {
    await api.get('/subcategories', {
      params: {
        title: search.title,
        enabled: search.enabled
      }
    })
      .then(response => response.data)
      .then(data => setSubcategoriesData(data))
      .catch(err => console.warn(err));
  }

  useEffect(() => {
    loadSubcategories();
  }, [search]);

  useEffect(() => {
    async function updateSubcategory(subcategory, data) {
      console.log(data);
      subcategory.enabled = data.enabled;

      api.put(`/subcategories/${subcategory.id}`, { enabled: subcategory.enabled })
        .then(res => {
          console.log(`Categoria ${subcategory.title} ${subcategory.enabled ? 'ativado' : 'desativado'}`); // TODO: toaster!
        })
        .catch(err => console.warn(err));
    }

    function parseSubsubcategories() {
      let enabledStatus = {};

      const isEnabled = (status, subcategory) => {
        enabledStatus = { ...enabledStatus, [subcategory.id]: status };

        if (Object.keys(enabledStatus).length === subcategoriesData.length)
          setEnabled(status);

        return (
          <Tooltip title={enabledStatus[subcategory.id] ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabledStatus[subcategory.id]}
              onChange={() => toggle(subcategory, !enabledStatus[subcategory.id])}
            />
          </Tooltip>
        );
      };

      const toggle = (subcategory, status) => {
        enabledStatus[subcategory.id] = status;

        setEnabled(enabledStatus);
        updateSubcategory(subcategory, { enabled: status });
      };

      const renderActions = (subcategory) =>
        <DeleteCategory subcategory-data={subcategory} />;

      setSubcategories(
        subcategoriesData.map(subcategory =>
          [String(subcategory.id),
          subcategory.title,
          isEnabled(subcategory.enabled, subcategory),
          renderActions(subcategory)
          ])
      );
    }

    parseSubsubcategories();
  }, [subcategoriesData.length, Object.keys(enabled).length]);

  const handleForm = name => event => {
    setForm({ ...form, [name]: event.target.value });
  };
  const handleSearch = name => event => {
    setSearch({ ...search, [name]: event.target.value });
  };

  async function handleSubmit(evt) {
    evt.preventDefault();

    console.log(form);

    await api.post('/subcategories/register', form)
      .then(response => { console.log(response); })
      .catch(err => console.warn(err));

      setOpen(false);
      loadSubcategories();
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
            id="searchSubcategories"
            value={search.title}
            onChange={handleSearch('title')}
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
                      <FormControl className={classes.formControl} style={{ width: "50%" }}>
                        <InputLabel htmlFor="age-native-simple">Categoria</InputLabel>
                        <Select
                          native
                          value={form.categoryId}
                          onChange={handleForm('categoryId')}
                        >
                          <option value="" />
                          {categories.map(category => <option value={category.id}>{category.title}</option>)}
                        </Select>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <TextField
                        label="Subcategoria"
                        id="titleSubcategory"
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

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Subcategorias</h4>
              <p className={classes.cardCategoryWhite}>
                Lista de subcategorias
            </p>
            </CardHeader>

            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["#", "Subcategoria", "Status", "Ações"]}
                tableData={subcategories}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer >
    </>
  );
}
