FinanceJs
=========

FinanceJs is a Node module that provides basic finance methods and is based upon the work of:

- Author: [Trent Richardson](http://trentrichardson.com)
- Twitter: [@practicalweb](http://twitter.com/practicalweb)

Node Module Version 0.0.1

This module does not include the formatting functions from Trent's library. I didn't port them
because most templating libraries come with their own formatting functionality.

FUNCTIONS
=========

Calculate the Financed Payment Amount
-------------------------------------

Three parameters: amount, months, interest rate (percent)

```javascript
finance.calculatePayment(25000, 60, 5.25);
```

Calculate the Financed Amount
-----------------------------

Three parameters: months, interest rate (percent), payment

```javascript
finance.calculateAmount(60, 5.25, 474.65);
```

Calculate the Months Financed
-----------------------------

Three parameters: amount, interest rate (percent), payment

```javascript
finance.calculateMonths(25000, 5.25, 474.65);
```

Calculate the Financed Interest Rate
------------------------------------

Three parameters: amount, months, payment

```javascript
finance.calculateInterest(25000, 60, 474.65);
```

Calculate the Accrued Interest
------------------------------

If your money is in a bank account accruing interest, how much does it earn over x months?
Three parameters: principle amount, months, interest rate (percent)

```javascript
finance.calculateAccruedInterest(25000, 60, 5.25);
```

Create Amortization Schedule
----------------------------

Create an amortization schedule. The result will be a JSON document that includes an array, the
length of which is the number of months. Each entry is an object.
Four parameters: principle amount, months, interest rate (percent), start date (optional Date object)

```javascript
finance.calculateAmortization(25000, 60, 5.25, new Date(2011,11,20) );
```

Copyright 2012 Trent Richardson

You may use this project under MIT or GPL licenses.

http://trentrichardson.com/Impromptu/GPL-LICENSE.txt

http://trentrichardson.com/Impromptu/MIT-LICENSE.txt


