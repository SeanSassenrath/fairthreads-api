const express = require('express');
const { dashboardCtrl } = require('./dashboardController');

const dashboard = express.Router();

dashboard.use((req, res, next) => {
  next();
});

dashboard.get('/pull-products', dashboardCtrl.pullProducts);

module.exports = dashboard;
