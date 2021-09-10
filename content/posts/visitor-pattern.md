---
title: "What is the Visitor design pattern and how to implement it in TS?"
description: "Implementing the Visitor design pattern using TypeScript interfaces and classes"
date: 2021-09-04T14:08:00+05:30
draft: false
showToc: true
tags: ["design-pattern", "typescript"]
cover:
  image: "/visitor/cover.png"
  alt: "Cover Image"
  relative: false
  hidden: false
---

### Introduction

So, I was reading a chapter from this book called [Crafting Interpreters](https://craftinginterpreters.com/), which had a little section about a design pattern called **The Visitor pattern**. Now, I don't have much experience with design patterns, because I never really dwelled into Object Oriented stuff and most of my code is based on functions(i guess I can call it functional without the whole scary math stuff).

But coming face to face with this design pattern, I was actually curious about what is this visitor design pattern & what problem it is trying to solve.

This blog is my attempt at explaining about this design pattern. What is it, why do we need it and how can we implement it in TypeScript.

### The problem(why?)

Before we explore what this design pattern is, lets first explore why do we even need it?

> **Note:** There will be some OOP concepts and some types system concept like interfaces and abstract classes. Tread carefully, fellow traveller :)

Suppose we have an interface or an abstract class(told ya), and we have a bunch of different classes that implement that interface/abstract class.

**argh!, what you do mean!!?**

okay, okay, let me try to make it clear for you.

Lets take a classic example of an Animal class. As someone who has watched countless videos on Classes and Objects(OOPs) stuff, the instructor always starts with "Animal class(or a class) is a blueprint...."(i don't even remember what the whole phrase was). Thus, I took this example.

So, you have an abstract class called `Animal`, which has a bunch of abstract methods like `makeSound`, `eatFood` etc.

```ts
abstract class Animal {
  abstract makeSound(): string;
  abstract eatFood(): string;
}
```

and you have a bunch of different animals that extends or "implements" that abstract animal class. For example, `cat`, `dog`, `human`(👀), etc.

```ts
class Cat extends Animal {
  makeSound() {
    return "meow";
  }

  eatFood() {
    return "tuna";
  }
}

class Dog extends Animal {
  makeSound() {
    return "woof";
  }

  eatFood() {
    return "chicken";
  }
}

class Human extends Animal {
  makeSound() {
    return "...";
  }

  eatFood() {
    return "¯_(ツ)_/¯"; // for some reason, vscode removes the `\`
  }
}
```

At this point, we can visualize our classes in a tabular form, where each row is a different class and every column is a method on that class.

![class table](/visitor/type-method-table.png#center)

Now, here's where the problem arises.

Suppose, now we want to add another method `walk` in our abstract `animal` class, thus we have to implement this `walk` method in `cat`, `dog` and `human` class as well. This means cracking open all our classes and implementing the `walk` method. This is a tedious task because you have to go through each class and implement that method. Also, this violets the [open/closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle) which states that "software entities should be open for extension, but closed for modification", and by add new methods in our existing class is a violation of "closed for modification" rule.

It would be cool if there was a way to have these methods in a single place(thus making modification a bit easier instead of wading through each class) as well as that doesn't require us to modify the existing class definitions.

Worry not!! We are going to learn how to do this using the **Visitor design pattern**, next!

> **To summarize the problem we faced above:**
>
> We had a handful of classes and a handful of methods in them. Adding new methods in those classes was a tedious task and violated the open/closed principle.

### The Visitor pattern

We are finally here!! Let's learn what is this visitor pattern all about and how can it be used to solve the problem above.

From [wikipedia](https://en.wikipedia.org/wiki/Visitor_pattern):

> In object-oriented programming and software engineering, the visitor design pattern is a way of separating an algorithm from an object structure on which it operates.
>
> A practical result of this separation is the ability to add new operations to existing object structures without modifying the structures.
>
> It is one way to follow the open/closed principle.

This definition is quite good and literally shows the benefits of Visitor Pattern.

First of all, we see that "the visitor design pattern is a way of separating an algorithm from an object structure on which it operates". This means that using the visitor design pattern, we separate a piece of data and the operation we do on that piece. We achieve this by providing a **level of indirection** in our code. You'll see what I'm talking about after a little while.

"A practical result of this separation is the ability to add new operations to existing object structures without modifying the structures". This is the reason why we are using the visitor pattern. As I said above, cracking open every class and adding new methods in them gets tedious and violets some principles, visitor pattern negates this behavior.

The visitor pattern also allows us to define methods in a single place(no hard rule though, it depends on you), which makes adding new methods to existing classes **a lot** easier.

So, we have seen what visitor pattern does and why should we use it, but, **WHAT is this visitor pattern? Show me the code, man.**

Fear not, cause I have an example just to see this Visitor pattern in action.

### Example

We will take an example of `cars`. I chose this example just because I feel like this example or something close to this example is what we will encounter most in real life and setting up a concrete real-life example would take more code than I intend to add here :)

#### Scenario

Let's setup a scenario for our example.

Imagine we have 3 cars(though I'm too poor to afford 3 cars, but lets just _imagine_) namely BMW, Mercedes, & Bugatti(literally took those names from a google search :P).

We assume that each car has different price, different repairing costs, etc. Given our maximum amount we can spend, how would we map this price to these purchase & repair costs, and get different output based on whether the given price is more than we'd like to spend?

Well, the obvious way would be to make a `car` interface and have classes based on given cars and add methods onto them.

```js
class BMWCar {
  getPrice() {
    // ...your code
  }
  getRepairCost() {
    // ...your code
  }
}
// similar classes for Mercedes and Bugatti car as well
```

But as we saw above, this is a tedious task(imagine going through every class and adding a new method in them _especially_ if those classes are in different files), etc.

Therefore, we will use the Visitor Pattern so that adding new methods will be an easy task and won't violate a bunch of principles.

#### The Visitor Pattern way

> The code will be written in TypeScript and since the whole thing would not be good to fit into a single blog post, I made a Github repository containing all the code. Check it out [here](https://github.com/aayushmau5/visitor-pattern).

##### Directory structure

Here's how our directory structure will look like(I have omitted some files for the sake of verbosity):

```
.
├── cars
│   ├── car.ts          # the car interface
│   ├── BMWCar.ts       # BMW car class
│   ├── MercedesCar.ts  # Mercedes car class
│   └── BugattiCar.ts   # Bugatti car class
├── costs
│   ├── CostsVisitor.ts       # Visitor interface
│   ├── RepairCostVisitor.ts  # Repair cost visitor class
│   └── PurchaseVisitor.ts    # Purchase cost visitor class
└── runner.ts   # Responsible for combining the cars and their visitors
```

##### Making Car interface and corresponding classes

Let us make an `interface` for a car first(we can use an `abstract` class as well).

```ts
// car.ts
export interface Car {
  getPrice(): number;
  getRepairCost(): number;
  accept(v: any): void; // using `any` for now
}
```

Make note of the `accept(v: any)` line. We will _revisit_ it to make some changes.

Next up, we **implement** this interface into our different cars class.

```ts
// BMWCar.ts
export class BMWCar implements Car {
  getPrice() {
    return 2; // as in 2 millions :p
  }

  getRepairCost() {
    return 0.7;
  }
}

// MercedesCar.ts
export class MercedesCar implements Car {
  getPrice() {
    return 4;
  }

  getRepairCost() {
    return 0.8;
  }
}

// BugattiCar.ts
export class BugattiCar implements Car {
  getPrice() {
    return 5;
  }

  getRepairCost() {
    return 1;
  }
}
```

Notice that we don't implement the `accept` function yet. We will come back to it later.

> **What have we done at this point?**
>
> We made a `car` interface which contains all the methods that are common to all the cars that _implement_ that interface.
>
> We made 3 car classes namely `BMWCar`, `MercedesCar` & `BugattiCar`. Added common method in them **expect** the `accept` method which we will revisit later.

##### Making a `visitor` interface

Next up, we make an interface which we call as "CostsVisitor". This interface is responsible for containing the methods that will be common to different methods that our class will implement.

```ts
export interface CostsVisitor {
  visitBMWCar(v: BMWCar): void;
  visitMercedesCar(v: MercedesCar): void;
  visitBugattiCar(v: BugattiCar): void;
}
```

Aside from the weird `visit` and `Visitor` names, this interface is pretty straightforward. We have 3 functions which take a parameter called `v` which maps to their corresponding classes and they don't return anything(thus `void`).

> **What's in the name?**
>
> We might be confused by this weird names like `accept`, `visit` and `Visitor`, but that's just the conventions of naming methods and interfaces in the Visitor pattern. It helps when someone else familiar with the Visitor Pattern will read our code, they will be able to understand what these methods do.
>
> As for us, to provide some "meaning" to these _weird_ names, we can think of them as:
>
> - `accept` accepts a visitor(as a welcoming in a visitor)
> - `visit` _visits_ a particular class
> - `visitor` has a bunch of visit methods

Now, we are going to implement the Price function and Repair cost functions. These functions will check whether we can afford to buy a car as well as repair it. They all implement our `CostsVisitor` interface.

```ts
export class PurchaseVisitor implements CostsVisitor {
  maxAffordablePrice: number;
  constructor(maxPrice: number) {
    this.maxAffordablePrice = maxPrice;
  }

  visitBMWCar(v: BMWCar) {
    const cost = v.getPrice();
    if (cost > this.maxAffordablePrice) {
      console.log("Cannot buy BMW Car");
      return;
    }
    console.log("Purchased BMW");
  }

  visitMercedesCar(v: MercedesCar) {
    const cost = v.getPrice();
    if (cost > this.maxAffordablePrice) {
      console.log("Cannot buy Mercedes Car");
      return;
    }
    console.log("Purchased Mercedes");
  }

  visitBugattiCar(v: BugattiCar) {
    const cost = v.getPrice();
    if (cost > this.maxAffordablePrice) {
      console.log("Cannot buy Bugatti Car");
      return;
    }
    console.log("Purchased Bugatti");
  }
}
```

This is a pretty straightforward class. We implement the `visit` methods in them, and right now, they just check whether the car price is more than we can afford or not, and respectively console.log that message.

Next, we implement the RepairCost class.

```ts
export class RepairCostVisitor implements CostsVisitor {
  maxAffordableRepairCost: number;
  constructor(maxCost: number) {
    this.maxAffordableRepairCost = maxCost;
  }

  visitBMWCar(v: BMWCar) {
    const cost = v.getPrice();
    if (cost > this.maxAffordableRepairCost) {
      console.log("Cannot repair BMW");
      return;
    }
    console.log("Repaired BMW");
  }

  visitMercedesCar(v: MercedesCar) {
    const cost = v.getPrice();
    if (cost > this.maxAffordableRepairCost) {
      console.log("Cannot repair Mercedes");
      return;
    }
    console.log("Repaired Mercedes");
  }

  visitBugattiCar(v: BugattiCar) {
    const cost = v.getPrice();
    if (cost > this.maxAffordableRepairCost) {
      console.log("Cannot repair Bugatti");
      return;
    }
    console.log("Repaired Bugatti");
  }
}
```

This one is similar as the last one. We just check whether the repair cost is more than we can afford, and console.log that corresponding messages.

**This is what we meant by "having all your logic in one place"**. We are implementing this Price checker and Repair Cost checker for all the different classes in a single place(or in a single class).

We will see how easy it is to add a new method in our cars classes without going through each and every class.

So far, so good?

> **What have we done till this point?**
>
> - We made a new `Visitor` interface that contains a bunch of function(/methods) that different classes have to implement.
> - We made two classes based on the `Visitor` interface namely `PurchaseVisitor` which implements the logic of purchasing a car and `RepairCostVisitor` which implements the logic of repairing a car.
>
> Don't be overwhelmed by these new infos. If you kinda ignore the weird names, you can see how straightforward this all is. Also, we haven't really seen how this will all work together, so hold on for now.

##### Re-_visiting_ our previous class

Remember when I said, "We don't implement the `accept` function yet. We will come back to it later"([_Refresh your memory_](#making-car-interface-and-corresponding-classes)). Well, nows the time to revisit these cars classes.

**Fixing the car interface**

We used `any` in our `Car` interface, so now we are going to replace `any` with `CostsVisitor` interface.

```ts
// car.ts
export interface Car {
  getPrice(): number;
  getRepairCost(): number;
  accept(v: CostsVisitor): void; // change this line
}
```

**Adding the `accept` method in our classes**

Next up, we implement the `accept` method in all our cars classes.

```ts
// BMWCar.ts
export class BMWCar implements Car {
  getPrice() {
    return 2;
  }

  getRepairCost() {
    return 0.7;
  }

  accept(v: CostsVisitor) {
    // add ths method
    v.visitBMWCar(this);
  }
}

// MercedesCar.ts
export class MercedesCar implements Car {
  getPrice() {
    return 4;
  }

  getRepairCost() {
    return 0.8;
  }

  accept(v: CostsVisitor) {
    // add ths method
    v.visitMercedesCar(this);
  }
}

// BugattiCar.ts
export class BugattiCar implements Car {
  getPrice() {
    return 5;
  }

  getRepairCost() {
    return 1;
  }

  accept(v: CostsVisitor) {
    // add ths method
    v.visitBugattiCar(this);
  }
}
```

This part is little bit weird. We add the `accept` method which takes a parameter `v` having the `CostsVisitor` interface & inside every function, we are calling a function that maps to their corresponding class, and pass `this`(the object instance) as the argument. This will all make sense when we wire it all up.

##### Wiring it all up

Now's the time that we combine all these interfaces & classes, and see it in action. Here's the code for it:

```ts
// runner.ts
import { BMWCar } from "./cars/BMWCar";
import { BugattiCar } from "./cars/BugattiCar";
import { MercedesCar } from "./cars/MercedesCar";

import { RepairCostVisitor } from "./costs/RepairCostVisitor";
import { PurchaseVisitor } from "./costs/PurchaseVisitor";

const purchaseVisitor = new PurchaseVisitor(2);
const repairCostVisitor = new RepairCostVisitor(2);

const bmwCar = new BMWCar();
const bugattiCar = new BugattiCar();
const mercedesCar = new MercedesCar();

// when purchasing a car
bmwCar.accept(purchaseVisitor);
bugattiCar.accept(purchaseVisitor);
mercedesCar.accept(purchaseVisitor);

// when repairing a car
bmwCar.accept(repairCostVisitor);
bugattiCar.accept(repairCostVisitor);
mercedesCar.accept(repairCostVisitor);
```

Here's the quick rundown of what's happening here:

- We first instantiate the visitor classes as well as the car classes.
- We pass the visitor instance in the `accept` method of various car objects.

You can now go ahead, compile the TypeScript code and get it running.

**How does this work?**

The best way to know what's going on here is to visualize it. Here's a little visualization that shows how everything is working.

**For calculating the purchase code**

![purchase-cost-visitor](/visitor/purchase-visitor.png#center)

**For calculating the repair cost**

![repair-cost-visitor](/visitor/repair-cost-visitor.png#center)

As we can see, we invoke the `accept` method of our car **instance**, passing in the visitor we want our car instance(/object) to interact with. If we want to know the purchase price, we pass in the `purchaseVisitor` & if we want to know the repair cost, we pass in the `repairCostVisitor`.

If we were to make a new method, we never have to touch those classes, instead make a new visitor and just plug that in inside the `accept` function. See how easy it is to add/remove new methods!

**This is the Visitor design pattern.** Again, you can find the code for this blog [here](https://www.github.com/aayushmau5/visitor-pattern).

Good stuff!

### TL;DR

We saw the visitor design pattern, why it is used and how can one use it.

It took me longer than I anticipated to write this blog. Alright, that's it folks! Thanks for sticking till the end :)

Keep _visiting!_(bad pun, sorry not sorry :P)

### Further reading

Some other resources to understand the Visitor pattern:

- https://www.youtube.com/watch?v=TeZqKnC2gvA
- https://refactoring.guru/design-patterns/visitor
