import React, { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import api from "../../services/api";
// import UserProfile from "views/UserProfile/UserProfile.js";

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

export default function TableList() {
  const classes = useStyles();

  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function loadClients() {
      const reponse = await api.get('/clients?name&enabled');

      setClients(reponse.data);
    }

    loadClients();
  }, [])

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Clientes</h4>
            <p className={classes.cardCategoryWhite}>
              Lista de Clientes
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["#", "Nome", "Telefone", "Endereço", "Status"]}
              tableData={clients.map(client => 
                [`${client.id}`, `${client.name}`, `${client.phone}`, `${client.address}`, (`${client.enabled}`) ? "Ativo" : "Inativo"]  
              )}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
