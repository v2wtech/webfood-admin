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

  useEffect(() => {
    async function loadProducts() {
      const reponse = await api.get('/products?title&enabled');

      setProducts(reponse.data);
    }

    loadProducts();
  }, [])

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
              tableData={products.map(product => 
                [`${product.id}`, `${product.title}`,`${product.description}`,`${product.valuePaid}`, `${product.priceSell}`, `${product.Group.title}`, `${product.Category.title}`, `${product.Subcategory.title}`, (`${product.enabled}`)? "Ativo":"Inativo"]  
              )}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
