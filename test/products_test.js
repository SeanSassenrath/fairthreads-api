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
  beforeEach((done) => {
    Product.remove({}, (err) => {
      done();
    });
  });

  describe('/GET/ products/', () => {
    it('it should GET all products', (done) => {
      chai.request(server)
      .get('/api/v1/products')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  }),

  describe('/GET/:id product', () => {
    it('it should GET a product by id', (done) => {
      const testProduct = new Product({
        name: "White shirt",
        category: "Tops",
        price: 20
      });
      testProduct.save((err, product) => {
        chai.request(server)
        .get('/api/v1/products/' + product.id)
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
        done();
        });
      });
    });
  }),

  describe('/POST product', () => {
    it('it should not POST a product without name field', (done) => {
      const product = {
        name: "Blue Jeans",
        category: "Bottoms",
        price: 200
      }
      chai.request(server)
        .post('/api/v1/products')
        .send(product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('product');
          res.body.product.should.have.property('name');
          res.body.should.have.property('message').eql('Product added');
        done();
      });
    });
  }),

  describe('/PUT products/:id', () => {
    it('it should UPDATE a products name by id', (done) => {
      const testProduct = new Product({
        name: "Red Dress", 
        category: "Dress", 
        price: 100 
      })
      testProduct.save((err, product) => {
        chai.request(server)
        .put('/api/v1/products/' + product.id)
        .send({name: "Blue Dress", category: "Dress", price: 100})
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('message').eql('Product updated');
          res.body.product.should.have.property('name').eql("Blue Dress");
        done();
        });
      });
    });
  }),

  describe('/DELETE/:id product', () => {
    it('it should DELETE a product given the id', (done) => {
      const testProduct = new Product({
        name: "Camisa Negra",
        category: "Tops",
        price: 1000
      })
      testProduct.save((err, product) => {
        chai.request(server)
        .delete('/api/v1/products/' + product.id)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Product deleted');
        done();
        });
      });
    });
  });
});
