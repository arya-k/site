+++
title = "The C++ Coding Checklist"
date = 2019-12-23
description = "Some resources on C++ programming, along with my notes."
+++

With an algorithms and data structure course in C++ imminent, it seemed like the right time to develop a gut instinct for clean, maintainable C++ code. To that end, I've gathered some resources on C++ programming:

* [(PDF)](http://www.umich.edu/~eecs381/handouts/C++_Coding_Standards.pdf) UofM EECS 381 Coding Standards
* [(PDF)](https://people.cs.clemson.edu/~dhouse/courses/405/papers/optimize.pdf) Tips for Optimizing C/C++ Code
* [(Github)](https://github.com/lefticus/cppbestpractices) C++ Best Practices
* [(PDF)](http://www.josuttis.com/libbook/algolist.pdf) List of STL algorithms

---

As I complete each project in EECS 281 (Data Structures and Algorithms), I'll work through this checklist:

- [ ] __Initialized Vectors__ When size is known, allocate vector size with `resize(n)` or `reserve(n)`.
- [ ] __No Synchronized IO__ Since we know we won't be using C-style IO, disable syncing with `std::ios_base::sync_with_stdio(false);`.
- [ ] __Buffered Output__ If outputting a lot of data, end with `"\n"` instead of `std::endl` to avoid flushing the buffer at the end of every line.
- [ ] __Single Point of Maintainance__ Unique code only appears for unique features, program constants are names as `const variables`, functions are used instead of duplicated code
- [ ] __No Unsigned Integers__ only `size_t` is used, and often cast to an `int`.
- [ ] __Double v. Float__ double used instead of float; equality is NEVER used.
- [ ] __Clear Class and Var names__  Upper case name for my own types; no `victims`. `using` used when appropriate. `_c` for constants, `_t` for typedefs. Clear variable names, without implementation details
- [ ] __Class Structure__ Not mixing _plain old data_ and _modifying classes_ (eg. Circle is POD, Geometry class manipulates it).
- [ ] __String Literal Constants__ string constants are defined as `const char * const`
- [ ] __Using nullptr__ Use `nullptr`, and `if (!ptr)`.
- [ ] __std::string__ Use `+=` whenever possible. Use standard overloaded operators, not `strcmp`. 
- [ ] __pre-increments__ Use pre-increments in for loops with iterators: ` for(list<Thing>::iterator it = things.begin(); it != things.end(); ++it)`
- [ ] __Catching exceptions__ Avoid catching `std::exception` as a blanket error. Always catch errors by reference: `catch (Error& x)`.

- [ ] __Using functions__ Freely use functions, with clear names. Inline small functions for performance. Avoid swiss-army functions or flags. 
- [ ] __Passing parameters__ If you don't want modification, pass built-in-types by copy, and other types by reference to const, or const pointers.
- [ ] __Scopes of variables__ Declare variables in the narrowest scope where it is used. Declare simple types inside loops, and complex types outside those loops. 
- [ ] __Loops, If/Else and Switch__ Use flat if/elses, or switches when possible. Minimize function calls in loops to allow compiler optimizations: `for(size_t i=0, len=list.size(); i < len; i++)`
- [ ] __File IO__ Format should be `while(infile >> x) { /* do stuff */ }; if(!infile.eof()) { /* error handling */ }`
- [ ] __Error Handling__ Explicitly design for errors. Elegantly handle user error, and use `assert` for programmer errors. No Exceptions for normal control flow.

- [ ] __Class Design__ Base class functionality should be used by _all_ derived classes. Do not share data in static member variables. Declare public, protected, then private. All member vars should be private, and const functions should be used.
- [ ] __Constructors__ Single argument constructs should use a default parameter for the default constructor, and constructors should be marked as explicit unless class is POD: `explicit Thing(int i_= 0) : i(i_) {}`. 

- [ ] __Ahmadal's Law & Premature optimizations__ make the common case fast, and the rare case correct. Code for correctness before optimizing.
- [ ] __Jumps and Branches__ Use function calls sparingly, prefer iteration over recursion, move loops inside function calls.
- [ ] __Arrays, local vars and function parameters__ Order array indices in order whenever possible to aid the CPU. Avoid local variables and function parameters so that they can be stored in registers. 
- [ ] __Default constructors and class operations__ Make default constructors cheap when possible, especially for classes manipulated frequently. Use `+=` instead of `+` for classes, and the opposite for primitive data types.
- [ ] __Equations and early terminations__ Simplify all equations on paper beore implementing them in code. Keep the most common cases in the first if statement, or make loops terminate faster in those cases.

- [ ] __Extra GCC flags__ Consider using `-Wall -Wextra -Wshadow -Wnon-virtual-dtor -Wold-style-cast -Wunused -Woverloaded-virtual -Wpedantic -Wmisleading-indentation -Wduplicated-cond -Wduplicated-branches -Wnull-dereference -Werror`
- [ ] __Default initializing__ Default initialize variables with braces: `int m_value{ 0 };`
- [ ] __Avoiding []__ Consider [] as an indication that an algorithm was not used where it could have been

I hope to slowly check items off this list as they are internalized- as a personal goal by the end of the course I would like to do all of these things before I even go through the list. At that point, I will have internalized best practices!
