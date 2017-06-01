/* eslint-disable */
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Category = require('../models/category');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

const testCategory = new Category({
  "details": {
    "name": "Tops"
  }
});

describe('Categories', () => {
  beforeEach((done) => {
    Category.remove({}, (err) => {
      done();
    });
  });

  describe('GET categories', () => {
    it('it should GET all categories', (done) => {
      chai.request(server)
      .get('/api/v1/categories')
      .end((err, res) => {
        if (err) console.log('ERROR', err);
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(0);
        done();
      });
    });
  })

  describe('GET categories/:id', () => {
    it('it should GET a category by id', (done) => {
      testCategory.save((err, category) => {
        chai.request(server)
        .get('/api/v1/categories/' + category.id)
        .send(category)
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

  describe('POST categories', () => {
    it('it should not POST a category without name field', (done) => {
      chai.request(server)
        .post('/api/v1/categories')
        .send(testCategory)
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.category.should.have.property('details').property('name');
          res.body.should.have.property('message').eql('Category added');
        done();
      });
    });
  }),

  describe('PUT categories/:id', () => {
    it('it should UPDATE a categories name by id', (done) => {
      const testCategory = new Category({
        "details": {
          "name": "Tops"
        } 
      })
      testCategory.save((err, category) => {
        chai.request(server)
        .put('/api/v1/categories/' + category.id)
        .send({
          "details": {
            "name": "Bottoms"
          }
        })
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('message').eql('Category updated');
          res.body.category.should.have.property('details').property('name').eql("Bottoms");
        done();
        });
      });
    });
  }),

  describe('DELETE categories/:id', () => {
    it('it should DELETE a category given the id', (done) => {
      testCategory.save((err, category) => {
        chai.request(server)
        .delete('/api/v1/categories/' + category.id)
        .end((err, res) => {
          if (err) console.log('ERROR', err);
          res.should.have.status(200)
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Category deleted');
        done();
        });
      });
    });
  });
});
