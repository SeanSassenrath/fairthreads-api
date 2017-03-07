/* eslint-disable */
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Product = require('../models/product');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Products', () => {

  describe('/GET product', () => {
    it('it should GET all products', (done) => {
      chai.request(server)
        .get('/api/v1/products')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    })
  }),

  describe('/GET product/:id', () => {
    it('it should GET a product by id', (done) => {
      chai.request(server)
        .get('/api/v1/products/58aaa32411a17b30b6c15ec6')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    })
  }),

  describe('/PUT product/:id', () => {
    it('it should UPDATE a products name', (done) => {
      const product = {
        name: "Test Name"
      }
      chai.request(server)
        .put('/api/v1/products/58aaa32411a17b30b6c15ec6')
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.have.property('name');
          res.body.name.eql('Test Name');
          done();
        });
    })
  })
});
