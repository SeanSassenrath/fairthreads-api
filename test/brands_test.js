/* eslint-disable */
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Brand = require('../models/brand');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

const testBrand = new Brand({
  "details": {
    "name": "Everlane"
  }
});

describe('Brands', () => {
  beforeEach((done) => {
    Brand.remove({}, (err) => {
      done();
    });
  });

  describe('GET brands', () => {
    it('it should GET all brands', (done) => {
      chai.request(server)
      .get('/api/v1/brands')
      .end((err, res) => {
        if (err) console.log('ERROR', err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  })

  describe('GET brands/:id', () => {
    it('it should GET a brand by id', (done) => {
      testBrand.save((err, brand) => {
        chai.request(server)
        .get('/api/v1/brands/' + brand.id)
        .send(brand)
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('details').property('name');
        done();
        });
      });
    });
  }),

  describe('POST brands', () => {
    it('it should not POST a brand without name field', (done) => {
      chai.request(server)
        .post('/api/v1/brands')
        .send(testBrand)
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.brand.should.have.property('details').property('name');
          res.body.should.have.property('message').eql('Brand added');
        done();
      });
    });
  }),

  describe('PUT brands/:id', () => {
    it('it should UPDATE a brands name by id', (done) => {
      const testBrand = new Brand({
        "details": {
          "name": "Everlane"
        } 
      })
      testBrand.save((err, brand) => {
        chai.request(server)
        .put('/api/v1/brands/' + brand.id)
        .send({
          "details": {
            "name": "Amour Vert"
          }
        })
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('message').eql('Brand updated');
          res.body.brand.should.have.property('details').property('name').eql("Amour Vert");
        done();
        });
      });
    });
  }),

  describe('DELETE brands/:id', () => {
    it('it should DELETE a brand given the id', (done) => {
      testBrand.save((err, brand) => {
        chai.request(server)
        .delete('/api/v1/brands/' + brand.id)
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200)
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Brand deleted');
        done();
        });
      });
    });
  });
});
