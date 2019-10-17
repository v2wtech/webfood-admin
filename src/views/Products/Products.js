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

import api from '../../services/api';

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

export default function ProdutosPage() {

  const [products, setProducts] = useState([]);
  const [enabled, setEnabled] = useState(false);
  const [render, setRender] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      await api.get('/products?title&enabled')
        .then(response => response.data)
        .then(data => parseProducts(data))
        .catch(err => console.warn(err))
    }

    async function updateProduct(product, data) {
      product.enabled = data.enabled;

      await api.put(`/products/${product.id}`, { product })
        .then(res => console.log(res))
        .then(console.log(product.id))
        .catch(err => console.warn(err))
    }

    function parseProducts(products) {
      const isEnabled = (status, product) => {
        if (render)
          setEnabled(status);

        setRender(false);

        return (
          <Tooltip title={enabled ? 'Desativar' : 'Ativar'}>
            <Switch
              checked={enabled}
              onChange={() => { toggle(product, !enabled); }}
            />
          </Tooltip>
        );
      };

      const toggle = (product, status) => {
        setEnabled(status);
        updateProduct(product, { enabled: status });
      };

      setProducts(
        products.map(product =>
        [product.id,
          product.title,
          product.description,
          product.valuePaid,
          product.priceSell,
          product.Group.title,
          product.Category.title,
          product.Subcategory.title,
          isEnabled(product.enabled, product)
          ])
      );
    }

    loadProducts();
  }, [enabled])

  const classes = useStyles();

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>

        <Link to="/admin/register">
          <Button color="success"> novo </Button>
        </Link>

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
              tableHead={["#", "Produto", "Descrição", "Valor", "Preço", "Grupo", "Categoria", "Subcategoria", "Status"]}
              tableData={products}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
