import React from "react";

import ChartistGraph from "react-chartist";

import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import Store from "@material-ui/icons/Store";

import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";


import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";


import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";



import {
  dailySalesChart
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);



export default function Dashboard() {

  const classes = useStyles();
  return (
    <div>
      <GridContainer>

        {/* cards superiores */}
        {/* <GridItem xs={1} sm={1} md={3}>

        </GridItem> */}
        <GridItem xs={12} sm={6} md={6}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Store />
              </CardIcon>
              <p className={classes.cardCategory}>venda</p>
              <h3 className={classes.cardTitle}>R$34,24</h3>
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
              <p className={classes.cardCategory}>Pedidos</p>
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
           {/* cards meio */}
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>vendas</h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                comparado ao mes anterior
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> atualizado a 1 hora
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Pedidos</h4>
              <p className={classes.cardCategoryWhite}>
                27 de setembro de 2019
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["ID", "Nome", "Endereço", "pedido", "Conta" ]}
                tableData={[
                  ["1", "Dakota Rice", "rua brasil n12", "pizza", "R$ 43 "],
                  ["2", "Minerva Hooper", "rua brasil n13", "Hamburguer", "R$ 15 "],
                  ["3", "Sage Rodriguez", "rua brasil n14", "2 pizzas", "R$ 40 "],
                  ["4", "Philip Chaney", "aaaaaaa n154", "sushi", "R$ 50 "]
                ]}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
