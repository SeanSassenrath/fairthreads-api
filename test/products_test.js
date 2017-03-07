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
        })
    })
  })
})
