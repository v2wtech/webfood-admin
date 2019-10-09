import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import Store from "@material-ui/icons/Store";

import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";


import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import api from "../../services/api"

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function loadGroups() {
      const response = await api.get('/groups?title&enabled');
      setGroups(response.data);
    }

    loadGroups();
  }, []);


  const classes = useStyles();
  return (
    <>
      <GridContainer>
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>Pedidos (Mesas)</p>
              <h3 className={classes.cardTitle}>27</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Ultimas 24 horas
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>assignment</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Pedidos (Entrega)</p>
              <h3 className={classes.cardTitle}>15</h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <LocalOffer />
                ultimas 24 horas
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
      <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="success">
              <h4 className={classes.cardTitleWhite}>Mesas</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="success"
                tableHead={["#", "Título", "Status"]}
                tableData={groups.map(group => 
                  [`${group.id}`, `${group.title}`, (`${group.enabled}`) ? "Ativo" : "Inativo"]
                )}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Entrega</h4>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["#", "Título", "Status"]}
                tableData={groups.map(group => 
                  [`${group.id}`, `${group.title}`, (`${group.enabled}`) ? "Ativo" : "Inativo"]
                )}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}
