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

import api from '../../services/api';
import { nextTick } from "q";

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


function DeleteProduct(props) {
  const classes = useStyles();

  const productData = props['product-data'];
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function deleteProduct(product) {
    api.delete('/products/' + product.id)
      .then(res => console.log("Produto", product.name, "removido.")) // TODO: modal
      .catch(err => console.warn(err));
  };

  const handleAcceptAction = () => {
    deleteProduct(productData);
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
        <DialogTitle id="alert-dialog-title">Remover produto?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Remover permanentemente o produto <strong className={classes.productNameDialog}>{productData.title}</strong>?
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

export default function ProductList() {
  const classes = useStyles();

  // Post 
  const [form, setForm] = useState({
    SubcategoryId: null,
    description: ''
  });

  // Status config
  const [products, setProducts] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [enabled, setEnabled] = useState({});

  const [search, setSearch] = useState({
    title: '',
    enabled: ''
  });

  // Modal config
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState();

  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(async () => {
    await api.get('/groups', {
      params: {
        title: '',
        enabled: ''
      }
    })
      .then(response => response.data)
      .then(data => setGroups(data))
      .catch(err => console.warn(err));
  }, [])

  useEffect(async () => {
    await api.get('/categories', {
      params: {
        title: '',
        enabled: ''
      }
    })
      .then(response => response.data)
      .then(data => setCategories(data))
      .catch(err => console.warn(err));
  }, [])

  useEffect(async () => {
    await api.get('/subcategories', {
      params: {
        title: '',
        enabled: ''
      }
    })
      .then(response => response.data)
      .then(data => setSubcategories(data))
      .catch(err => console.warn(err));
  }, [])

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

  async function loadProducts() {
    await api.get('/products', {
      params: {
        title: search.title,
        enabled: search.enabled
      }
    })
      .then(response => response.data)
      .then(data => setProductsData(data))
      .catch(err => console.warn(err))
  }

  useEffect(() => {
    loadProducts();
  }, [search]);

  useEffect(() => {
    async function updateProduct(product, data) {
      console.log(data);
      product.enabled = data.enabled;

      await api.put(`/products/${product.id}`, { enabled: product.enabled })
        .then(res => {
          console.log(`Produto ${product.title} ${product.enabled ? 'ativado' : 'desativado'}`); // TODO: toaster!
        })
        .catch(err => console.warn(err));
    }

    function parseProducts(products) {
      let enabledStatus = {};

      const isEnabled = (status, product) => {
        enabledStatus = { ...enabledStatus, [product.id]: status };

        if (Object.keys(enabledStatus).length === productsData.length)
          setEnabled(status);

        return (
          <Tooltip title={enabledStatus[product.id] ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabledStatus[product.id]}
              onChange={() => { toggle(product, !enabledStatus[product.id]); }}
            />
          </Tooltip>
        );
      };

      const toggle = (product, status) => {
        enabledStatus[product.id] = status;

        setEnabled(enabledStatus);
        updateProduct(product, { enabled: status });
      };

      const renderActions = (product) =>
        <DeleteProduct product-data={product} />;

      setProducts(
        productsData.map(product =>
          [String(product.id),
          product.title,
          product.description,
          String(product.valuePaid),
          String(product.priceSell),
          product.Group.title,
          product.Category.title,
          (product.subcategoryId === null)? '' : product.Subcategory.title,
          isEnabled(product.enabled, product),
          renderActions(product)
          ])
      );
    }

    parseProducts();
  }, [productsData.length, Object.keys(enabled).length])

  const handleForm = name => event => {
    setForm({ ...form, [name]: event.target.value });
  };

  const handleSearch = name => event => {
    setSearch({ ...search, [name]: event.target.value });
  };

  async function handleSubmit(evt) {
    evt.preventDefault();

    console.log(form);

    await api.post('/products/register', form)
      .then(response => { console.log(response); })
      .catch(err => console.warn(err));

    setOpen(false);
    loadProducts();
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
                    <GridItem xs={12} sm={12} md={4}>
                      <FormControl className={classes.formControl} style={{ width: "100%" }}>
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

                    <GridItem xs={12} sm={12} md={4}>
                      <FormControl className={classes.formControl} style={{ width: "100%" }}>
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

                    <GridItem xs={12} sm={12} md={4}>
                      <FormControl className={classes.formControl} style={{ width: "100%" }}>
                        <InputLabel htmlFor="age-native-simple">Subcategoria</InputLabel>
                        <Select
                          native
                          value={form.subcategoryId}
                          onChange={handleForm('subcategoryId')}
                        >
                          <option value="" />
                          {subcategories.map(subcategory => <option value={subcategory.id}>{subcategory.title}</option>)}
                        </Select>
                      </FormControl>
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <TextField
                        label="Produto"
                        id="titleProduct"
                        value={form.title}
                        onChange={handleForm('title')}
                        style={{ width: "100%" }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                      <TextField
                        label="Descrição"
                        id="DescriptionProduct"
                        value={form.description}
                        onChange={handleForm('description')}
                        style={{ width: "100%" }}
                      />
                    </GridItem>
                  </GridContainer>

                  <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        label="Valor"
                        id="valuePaidProduct"
                        value={form.valuePaid}
                        onChange={handleForm('valuePaid')}
                        style={{ width: "100%" }}
                      />
                    </GridItem>

                    <GridItem xs={12} sm={12} md={6}>
                      <TextField
                        label="Preço"
                        id="priceSellProduct"
                        value={form.priceSell}
                        onChange={handleForm('priceSell')}
                        style={{ width: "100%" }}
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
              <h4 className={classes.cardTitleWhite}>Produtos</h4>
              <p className={classes.cardCategoryWhite}>
                Lista de Produtos
            </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="primary"
                tableHead={["#", "Produto", "Descrição", "Valor", "Preço", "Grupo", "Categoria", "Subcategoria", "Status", "Ações"]}
                tableData={products}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>);
}
