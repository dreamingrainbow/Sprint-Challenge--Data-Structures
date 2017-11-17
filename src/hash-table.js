/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this *///
// const { LimitedArray, getIndexBelowMax } = require('./hash-table-helpers');
// A special array class that can only store the number of items specified by the `limit` argument
class LimitedArray {
  constructor(limit) {
    // You should not be directly accessing this array from your hash table methods
    // Use the getter and setter methods included in this class to manipulate data in this class
    this.storage = [];
    this.limit = limit;
  }
  checkLimit(index) {
    if (typeof index !== 'number') throw new Error('The supplied index needs to be a number');
    if (this.limit <= index) {
      throw new Error('The supplied index lies out of the array\'s bounds');
    }
  }
  get(index) {
    this.checkLimit(index);
    return this.storage[index];
  }
  get length() {
    return this.storage.length;
  }
  // Use this setter function to add elements to this class
  set(index, value) {
    this.checkLimit(index);
    this.storage[index] = value;
  }
}
/* eslint-disable no-bitwise, operator-assignment */
// This is hash function you'll be using to hash keys
// There's some bit-shifting magic going on here, but essentially, all it is doing is performing the modulo operator
// on the given `str` arg (the key) modded by the limit of the limited array
// This simply ensures that the hash function always returns an index that is within the boundaries of the limited array
const getIndexBelowMax = (str, max) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
    hash = Math.abs(hash);
  }
  return hash % max;
};

class Rocks {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  push(key, value) {
    const newNode = new Rocks(key, value);
    if (!this.head) {
      this.head = newNode;
      this.tail = this.head;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }
  shift() {
    const t = this.head.value;
    this.head = this.head.next;
    return t;
  }
  contains(v, o = this) {
    if (o.value === v) return true;
    if (o.next !== null) return this.contains(v, o.next);
    return this.contains(v, this.head) || false;
  }
  filter(cb) {
    const filteredResults = new LinkedList();
    if (cb(this.head.key)) {
      filteredResults.push(this.head.key, this.head.value);
    }
    return filteredResults;
  }
}

class HashTable {
  constructor(limit = 8) {
    this.limit = limit;
    this.storage = new LimitedArray(this.limit);
    // Do not modify anything inside of the constructor
  }

  resize() {
    this.limit *= 2;
    const oldStorage = this.storage;
    this.storage = new LimitedArray(this.limit);
    oldStorage.each((bucket) => {
      if (!bucket) return;
      bucket.forEach((pair) => {
        this.insert(pair[0], pair[1]);
      });
    });
  }

  capacityIsFull() {
    let fullCells = 0;
    this.storage.each((bucket) => {
      if (bucket !== undefined) fullCells++;
    });
    return fullCells / this.limit >= 0.75;
  }

  // Adds the given key, value pair to the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // If no bucket has been created for that index, instantiate a new bucket and add the key, value pair to that new bucket
  // If the key already exists in the bucket, the newer value should overwrite the older value associated with that key
  insert(key, value) {
    // if (this.capacityIsFull()) this.resize();
    const index = getIndexBelowMax(key.toString(), this.limit);
    let bucket = this.storage.get(index) || new LinkedList()
    bucket.push(key, value);
    this.storage.set(index, bucket);
    return bucket;
  }
  // Removes the key, value pair from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Remove the key, value pair from the bucket
  remove(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    let bucket = this.storage.get(index);

    if (bucket) {
      bucket = bucket.filter(item => item[0] !== key);
      this.storage.set(index, bucket);
    }
  }
  // Fetches the value associated with the given key from the hash table
  // Fetch the bucket associated with the given key using the getIndexBelowMax function
  // Find the key, value pair inside the bucket and return the value
  retrieve(key) {
    const index = getIndexBelowMax(key.toString(), this.limit);
    const bucket = this.storage.get(index);
    let retrieved;
    if (bucket) {
      retrieved = bucket.filter(item => item === key);
    }
    return retrieved.head.value ? retrieved.head.value : undefined;
  }
}

module.exports = HashTable;
hashTable = new HashTable();
/*
console.log(hashTable.insert('hello', 'there'));
console.log(hashTable);
console.log(hashTable.retrieve('hello'), 'there');
*/
/*
hashTable.insert('Ben', 'Nelson');
console.log(hashTable.retrieve('Ben'), 'Nelson');
hashTable.remove('Ben');
console.log(hashTable.retrieve('Ben'), undefined);
console.log(hashTable.remove('Sean'), undefined);
hashTable.insert(0, 'First Value');
hashTable.insert(1, 'Second Value');
console.log(hashTable.retrieve(0), 'First Value');
console.log(hashTable.retrieve(1), 'Second Value');
*/
/*
hashTable.insert(0, 'First Value');
hashTable.insert(0, 'Second Value');
console.log(hashTable.retrieve(0), 'Second Value');
*/
/*
hashTable.insert('B', 'First Value');
hashTable.insert('HI!', 'Second Value');
console.log(hashTable.retrieve('B'), 'First Value');
// console.log(hashTable.retrieve('HI!'), 'Second Value');
*/
/*
hashTable.insert('a', true);
hashTable.insert('b', true);
hashTable.insert('c', true);
hashTable.insert('d', true);
hashTable.insert('e', true);
hashTable.insert('f', true);
hashTable.insert('g', true);
console.log(hashTable.limit, 16);
console.log(hashTable.storage.length, 8);
*/
/*
hashTable.insert('h', true);
hashTable.insert('i', true);
hashTable.insert('j', true);
hashTable.insert('k', true);
hashTable.insert('l', true);
hashTable.insert('m', true);
hashTable.insert('n', true);
hashTable.insert('o', true);
console.log(hashTable.limit, 32);
console.log(hashTable.storage.length, 16);
*/