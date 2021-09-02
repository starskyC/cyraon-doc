# Cyraon Language Specification

## Syntax

Cyraon Syntax is consisted of two concepts: **Node** and **Expr**

**Node**
: Forms the general structure of the code.

**Expr**
: Fill in the details of a **node**. Technically, a **node** can contain 


### Operator Precedence (High to Low)

- 12:
  - ParenExpr `(`...`)`
- 11
  - Literal
    - Int Float Tuple List etc.
  - [Block](#block)
  - Variable
  - [Lambda](#lambda)
- 10 **Left Associative**
  - [FnCall & its variants]() 
  - [Index & its variants]()
- 9 **Right Associative** Unaries 
  - `!`...
  - `+`...
  - `-`...
  - `~`... 
- 8 **Right Associative** Power ...`**`...
- 7 **Left Associative** Higher Arithmetics 
  - ...`*`...
  - ...`/`...
  - ...`%`... 
- 6 **Left Associative** Lower Arithmetics
  - ...`+`... 
  - ...`-`...
- 5 **Left Associative** Bit Shift
  - ...`<<<`... 
  - ...`>>>`...
- 4 Order Comparison 
  - ...`<`...
  - ...`>`...
  - ...`<=`...
  - ...`>=`...
- 3 Equality Comparison
  - ...`==`...
  - ...`!=`...
- 2 **Left Associative** LogicalAnd ...`&&`...
- 1 **Left Associative** LogicalOr ...`||`...
- 0 **Left Associative** [Index & its variants](#)

---

### Block
Block is a very special syntax in **Cyraon**.
```cyraon
{
    // empty
    ;

    // evaluate an expression
    1 + 2;

    // a statement
    let x = 2;

    // export a value
    a => 7,

    // exported value can be used later
    a => a * 6,

    // export-symbol can be generated
    [ "user_$(rng())" ] => User .new(),
    // is identical to (assume rng returns 1)
    // user_1 => User .new()
}
```
Block is an expression

```cyraon
let my_block = {
    // would not execute immediately
    Console.print "Block is lazy";
    a => 23,
    x => fx a,
};
```

<!-- TODO: use another name instead of `destruct$` macro -->
Destructing a block's exports, would also execute the block if haven't yet
```cyraon
destruct$ my_block {
    a, x
};
// Block is lazy

// alias
destruct$ my_block {
    a => b, x => y
};
// second time destruct$ doen't output "Block is lazy"
```

`destruct$` is an example of macro in **Cyraon**. Another example of macro that's closely tied with the Block is `map$`.
```cyraon
let my_map = map$ {
    // map b to true
    b => true,

    // yet you can do something and doesn't map the result to anything
    rng.set_seed 0;
    a => rng(),

    // yet you can have local variables declared and used later
    let x = 5;
    y => x ** 2,
};

// my_map stores relationships of mapping
my_map["b"] // true
my_map["a"] = 2; // values can be changed later
```
<!-- TODO: add link to std::map -->
more to see [std::map]()

### Lambda
```cyraon
// (ar0, arg1, ...) -> <expr>
let add = (a, b) -> a + b;

// Single arg and we can ignore the parenthesis
let add_1 = x -> x + 1

// This is extremely useful in currying
let curried_add = a -> b -> a + b;

// and curried_add could be called as
let three = curried_add 1 2;
```

### Function Call
```cyraon
// usually, functions are just what you would normally expected
f(a, b, c);
however
```


### Variable Assignment
```html
let <variable-name> = <expr>;
```

```ebnf
AssignStmt = KW_LET Ident SYN_EQ expr SYN_SEMICOLON
```