const times = require('lodash/times');
const faker = require('faker');
const fakePost = () => ({
  title: faker.lorem.slug(),
  content: faker.lorem.sentence()
});

class Collection {
  constructor(data) {
    this.data = data;
    this._limit = this.data.length;
  }

  limit(num) {
    this._limit = num;
    return this;
  }

  exec() {
    return Promise.resolve(this.data.slice(0, this._limit));
  }
}

class DBMap {
  constructor(data) {
    this.data = data;
  }

  exec() {
    return Promise.resolve(this.data);
  }
}

class DummyDB {
  constructor() {
    this.db = {
      posts: new Collection(times(20, fakePost)),
      about: new DBMap({content: faker.lorem.sentence()})
    };
  }

  fetch(key) {
    return this.db[key];
  }
}

module.exports = DummyDB;
