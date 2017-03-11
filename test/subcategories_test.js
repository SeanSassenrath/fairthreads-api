/* eslint-disable */
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Subcategory = require('../models/subcategory');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

const testSubcategory = new Subcategory({
  "details": {
    "name": "Tops"
  }
});

describe('Subcategories', () => {
  beforeEach((done) => {
    Subcategory.remove({}, (err) => {
      done();
    });
  });

  describe('GET subcategories', () => {
    it('it should GET all subcategories', (done) => {
      chai.request(server)
      .get('/api/v1/subcategories')
      .end((err, res) => {
        if (err) console.log('ERROR', err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  })

  describe('GET subcategories/:id', () => {
    it('it should GET a subcategory by id', (done) => {
      testSubcategory.save((err, subcategory) => {
        chai.request(server)
        .get('/api/v1/subcategories/' + subcategory.id)
        .send(subcategory)
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

  describe('POST subcategories', () => {
    it('it should not POST a subcategory without name field', (done) => {
      chai.request(server)
        .post('/api/v1/subcategories')
        .send(testSubcategory)
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.subcategory.should.have.property('details').property('name');
          res.body.should.have.property('message').eql('Subcategory added');
        done();
      });
    });
  }),

  describe('PUT subcategories/:id', () => {
    it('it should UPDATE a subcategories name by id', (done) => {
      const testSubcategory = new Subcategory({
        "details": {
          "name": "Tops"
        } 
      })
      testSubcategory.save((err, subcategory) => {
        chai.request(server)
        .put('/api/v1/subcategories/' + subcategory.id)
        .send({
          "details": {
            "name": "Bottoms"
          }
        })
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('message').eql('Subcategory updated');
          res.body.subcategory.should.have.property('details').property('name').eql("Bottoms");
        done();
        });
      });
    });
  }),

  describe('DELETE subcategories/:id', () => {
    it('it should DELETE a subcategory given the id', (done) => {
      testSubcategory.save((err, subcategory) => {
        chai.request(server)
        .delete('/api/v1/subcategories/' + subcategory.id)
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200)
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Subcategory deleted');
        done();
        });
      });
    });
  });
});
