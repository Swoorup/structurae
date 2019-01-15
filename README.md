# Structurae

[![npm](https://img.shields.io/npm/v/structurae.svg?style=flat-square)](https://www.npmjs.com/package/structurae)
[![Travis branch](https://img.shields.io/travis/zandaqo/structurae.svg?style=flat-square)](https://travis-ci.org/zandaqo/structurae)
[![Codecov](https://img.shields.io/codecov/c/github/zandaqo/structurae.svg?style=flat-square)](https://codecov.io/github/zandaqo/structurae)

A collection of data structures for performance-sensitive modern JavaScript applications that includes:

- Grid - extends built-in indexed collections to handle 2 dimensional data (e.g. nested arrays).
- PackedInt - stores and operates on data in Numbers and BigInts treating them as bitfields.
- SortedArray - extends built-in Array to efficiently handle sorted data.

## Installation
```
npm i structurae 
```

## Usage
Import structures as needed:
```javascript
import { Grid, PackedInt, SortedArray } from 'structurae';

// or
const { Grid, PackedInt, SortedArray } = require('structurae');
```

### Grid
Grid extends a provided indexed collection class (Array or TypedArrays) to efficiently handle 2 dimensional data without creating
nested arrays. Grid "unrolls" nested arrays into a single array and pads its "columns" to the nearest power of 2 in order to employ
quick lookups with bitwise operations.

```javascript
const ArrayGrid = Grid(Array);

// create a grid of 5 rows and 4 columns filled with 0
const grid = new ArrayGrid({rows: 5, columns: 4 });
grid.length
//=> 20
grid[0]
//=> 0

// only invoking the constructor with the options object will result in special behavior
// otherwise all parameters are passed to the base class as they are:
const arrayGrid = new ArrayGrid(1,2,3);
arrayGrid.length
//=> 3

// to instantiate a grid with data simply invoke constructor with the data and set its columns size later:
const  dataGrid = new ArrayGrid(1, 2, 3, 4, 5, 6, 7, 8);
dataGrid.setColumns(4);
```

You can get and set elements using their row and column indexes:
```javascript
grid
//=> ArrayGrid [1, 2, 3, 4, 5, 6, 7, 8]
grid.get(0, 1);
//=> 2
grid.set(0, 1, 10);
grid.get(0, 1);
//=> 10

// use `getCoordinates` method to find out row and column indexes of a given element by its array index:
grid.getCoordinates(0);
//=> [0, 0]
grid.getCoordinates(1);
//=> [0, 1]
```

A grid be turned to and from an array of nested arrays using respectively `Grid#fromArrays` and `Grid#toArrays` methods:
```javascript
const grid = ArrayGrid.fromArrays([[1,2], [3, 4]]);
//=> ArrayGrid [ 1, 2, 3, 4 ]
grid.get(1, 1);
//=> 4

// if arrays are not the same size or their size is not equal to a power two, Grid will pad them with 0 by default
// the value for padding can be specified as the second argument
const grid = ArrayGrid.fromArrays([[1, 2], [3, 4, 5]]);
//=> ArrayGrid [ 1, 2, 0, 0, 3, 4, 5, 0 ]
grid.get(1, 1);
//=> 4

grid.toArrays();
//=> [ [1, 2], [3, 4, 5] ]

// you can choose to keep the padding values
grid.toArrays(true);
//=> [ [1, 2, 0, 0], [3, 4, 5, 0] ]
```

### PackedInt
PackedInt uses JavaScript Numbers and BigInts as bitfields to store and operate on data using bitwise operations.
By default, PackedInt operates on 31 bit long bitfield where bits are indexed from least significant to most:
```javascript
const bitfield = new PackedInt(29); // 29 === 0b11101
bitfield.get(0);
//=> 1
bitfield.get(1);
//=> 0
bitfield.has(2, 3, 4);
//=> true
```

You can extend PackedInt and use your own schema by specifying field names and their respective sizes in bits:
```javascript
class Person extends PackedInt {}
Person.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
];
const person = new Person([20, 1]);
person.get('age');
//=> 20
person.get('gender');
//=> 1
person.set('age', 18);
person.value
//=> 41
person.toObject();
//=> { age: 20, gender: 1 }
```

You can forgo specifying sizes if your field size is 1 bit:
```javascript
class Privileges extends PackedInt {}
Privileges.fields = ['user', 'moderator', 'administrator'];

const privileges = new Privileges(0);
privileges.set('user').set('moderator');
privileges.has('user', 'moderator');
//=> true
privileges.set('moderator', 0).has('moderator');
//=> false
```

If the total size of your fields exceeds 31 bits, PackedInt will internally use a BigInt to represent the resulting number,
however, you can still use normal numbers to set each field and get their value as a number as well:
```javascript
class LargeField extends PackedInt {}
LargeField.fields = [
  { name: 'width', size: 20 },
  { name: 'height', size: 20 },
];

const largeField = new LargeField([1048576, 1048576]);
largeField.value
//=> 1099512676352n
largeField.set('width', 1000).get('width')
//=> 1000
```

If you have to add more fields to your schema later on, you do not have to re-encode your existing values, just add new fields 
at the end of your new schema:

```javascript
class OldPerson extends PackedInt {}
OldPerson.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
];

const oldPerson = OldPerson.encode([20, 1]);
//=> oldPerson === 41

class Person extends PackedInt {}
Person.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
  { name: 'weight', size: 8 },
];
const newPerson = new Person(oldPerson);
newPerson.get('age');
//=> 20
newPerson.get('weight');
//=> 0
newPerson.set('weight', 100).get('weight');
//=> 100
```

If you only want to encode or decode a set of field values without creating an instance, you can do so by use static methods
`PackedInt.encode` and `PackedInt.decode` respectively:
```javascript
class Person extends PackedInt {}
Person.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
];

Person.encode([20, 1]);
//=> 41

Person.decode(41);
//=> { age: 20, gender: 1 }
```

If you don't know beforehand how many bits you need for your field, you can call `PackedInt.getMinSize` with the maximum
possible value of your field to find out:
```javascript
PackedInt.getMinSize(100);
//=> 7

class Person extends PackedInt {}
Person.fields = [
  { name: 'age', size: PackedInt.getMinSize(100) },
  { name: 'gender', size: 1 },
];
```

For performance sake, PackedInt doesn't check the size of values being set and setting values that exceed the specified
field size will lead to undefined behavior. If you want to check whether values fit their respective fields, you can use `PackedInt.isValid`:
```javascript
class Person extends PackedInt {}
Person.fields = [
  { name: 'age', size: 7 },
  { name: 'gender', size: 1 },
];

Person.isValid({age: 100});
//=> true
Person.isValid({age: 100, gender: 3});
//=> false
Person.isValid([100, 1]);
//=> true
Person.isValid([100, 3]);
//=> false
```

`PackedInt#match` (and its static variation `PackedInt.match`) can be used to check values of multiple fields at once:
```javascript
const person = new Person([20, 1]);
person.match({ age: 20 });
//=> true
person.match({ gender: 1, age: 20 });
//=> true
person.match({ gender: 1, age: 19 });
//=> false
Person.match(person.toValue(), { gender: 1, age: 20 });
//=> true
```

If you have to check multiple PackedInts for the same values, create a special matcher with `PackedInt.getMatcher`
and use it in the match method, that way each check will require only one bitwise operation and a comparison:
```javascript
const matcher = Person.getMatcher({ gender: 1, age: 20 });
Person.match(new Person([20, 1]).toValue(), matcher);
//=> true
Person.match(new Person([19, 1]).toValue(), matcher);
//=> false
```

### SortedArray
SortedArray extends built-in Array to efficiently handle sorted data.

To create a SortedArray from unsorted array-like objects or items use `SortedArray.from` and `SortedArray.of` respectively:
```js
SortedArray.from(unsorted);
//=> SortedArray [ 2, 3, 4, 5, 9 ]
SortedArray.of(8, 5, 6);
//=> SortedArray [ 5, 6, 8 ]
```

`new SortedArray` behaves the same way as `new Array` and should be used with already sorted elements:
```js
new SortedArray(...first);
//=> SortedArray [ 1, 2, 3, 4, 8 ];
new SortedArray(2,3,4);
//=> SortedArray [ 2, 3, 4 ];
```

A custom comparison function can be specified on the array instance to be used for sorting:
```js
sortedArray.compare = (a, b) => (a > b ? -1 : a < b ? 1 : 0);
sortedArray.sort();
//=> [ 9, 5, 4, 3, 2 ]
```

SortedArray supports all methods of Array. The methods that change the contents of an array do so while preserving the sorted order:
```js
sortedArray.push(1);
//=> SortedArray [ 1, 2, 3, 4, 5, 9 ]
sortedArray.unshift(8);
//=> SortedArray [ 1, 2, 3, 4, 5, 8, 9 ]
sortedArray.splice(0, 2, 6);
//=> SortedArray [ 3, 4, 5, 6, 8, 9 ]
```

`indexOf` and `includes` use binary search that increasingly outperforms the built-in methods as the size of the array grows.

In addition to the Array instance methods, SortedArray provides `isSorted` method to check if the array is sorted, and `range` method to get elements of the array whose values are between the specified range:
```js
sortedArray.range(3, 5);
// => [ 3, 4, 5 ]
sortedArray.range(undefined, 4);
// => [ 2, 3, 4 ]
sortedArray.range(4);
// => [ 4, 5, 8 ]
```

`uniquify` can be used to remove duplicating elements from the array:
```js
const a = SortedArray.from([ 1, 1, 2, 2, 3, 4 ]);
a.uniquify();
//=> SortedArray [ 1, 2, 3, 4 ]
```

If the instance property `unique` of an array is set to `true`, the array will behave as a set and avoid duplicating elements:
```js
const a = new SortedArray();
a.unique = true;
a.push(1);
//=> 1
a.push(2);
//=> 2
a.push(1);
//=> 2
a
//=> SortedArray [ 1, 2 ]
```

SortedArray also provides a set of functions to perform common set operations and find statistics of any sorted array-like objects without converting them to SortedArrays. Check [API documentation](https://github.com/zandaqo/structurae/blob/master/doc/API.md) for more information.

## Documentation
- [API documentation](https://github.com/zandaqo/structurae/blob/master/doc/API.md)

## License
MIT © [Maga D. Zandaqo](http://maga.name)