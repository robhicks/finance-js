node-finance
=========

node-finance is a Node module that provides basic finance methods. node-finance is implemented
where it can be used synchronously or asynchronously. To use it asynchronously, pass in a callback
at the end of a function.

FUNCTIONS
=========

 PVofLumpSum
 -----------
 Calculates the present value of a lump sum received in the future. Arguments include:
 * rate (required) - the interest rate per period
 * NPER (required) - total number of periods
 * FV (optional) - the future value or lump sum to be received

PV
 --
 Calculates the present value of an investment resulting from a series of regular payments. Arguments include:
 * rate (required) - the interest rate per period
 * NPER (required) - total number of payment periods
 * PMT (required)  the regular payment made each period
 * type (optional) - wether payments made 0 - at the end of each period or 1 - at the start of each period (including a payment at the start of the term)

 PVofPerpetuity
 --------------
 Calculates the present value of an investment with an unlimited number of regular payments. Arguments include:
 * rate (required) - the interest rate per period
 * NPER (required) - total number of payment periods
 * PMT (required)  the regular payment made each period

CUMIPMT
-------
Calculate the total interest paid on a loan in specified periodic payments. Arguments include:
* rate (required) - interest rate specified as a percentage, e.g., 10.5
* periods (required) - the total number of payment periods in the term
* pv (required) - the initial sum borrowed
* start (optional) - the first period to include. Periods are numbered beginning with 1
* end (optional) - the last period to include
* type (optional) - when payments are made:
    - 0 - at the end of each period
    - 1 - at the start of each period (including a payment at the start of the term)
* callback (optional) - callback for asynchronous processing using Node's CommonJS format

FV
--
Calculates future value of an investment based on equal periodic payments. Arugments include:
* rate (required) - the periodic interest rate
* NPER (required) - the number of periods
* PMT (required) - the equal periodic payments
* type (optional) - whether the payment is due at the beginning (1) or the end (0) of a period

NPER
----
Caculates the number of periods for an investment based on periodic, constant payments
and a constant interest rate. Arguments include:
* rate (required) - the periodic interest rate
* PMT (required) - the constant payment paid in each period
* FV (required) - the future value of the last period
* type (optional) - whether the payment is due at the beginning (1) or the end (0) of a period

PMT
---
Calculates the payment for a loan with the following parameters.
* PV is loan amount
* NPER is the number of periods
* rate is the rate per period
* type (optional) - whether the payment is due at the beginning (1) or the end (0) of a period

GenAmortizationSchedule
-----------------------
This function generates an amortization schedule. The schedule is returned as a Javascript object.

The function accepts the following arguments:
* amount (required): the starting principal amount of the loan
* months (required): the number of whole months over which the loan extends
* rate (required): the annual interest rate of the loan expressed as a percentage, e.g., 10.5
* firstPaymentDate (optional): the date the first payment will be made
* frequency (optional): the payment frequency, which can be any of the following:
    semimonthly - twice a month
    monthly - once each month
    bimonthly - every two months
    quarterly - every quarter
    semiannually - ever 6 months
    annually - ever 12 months
    none or one - only one payment at the end of the loan - typically don't mix this with balloonDate
* balloonDate (optional): the date a balloon payment will be made. This date will be forced to earliest
corresponding payment date. This date will be ignored if it is greater than the term (months) of the
loan.

The return object contains an array, with each array element containing the following fields:
* paymentNumber - the number for a payment
* principle: the principal balance remaining at the end of the period
* accumulatedInterest: the interest accumulate from all previous periods through this period
* payment: the periodic payment the borrower is required to pay
* paymentToPrinciple: the amount of the payment allocated to paying down the principal
* paymentToInterest: the amount of the payment allocated to paying interest
* date: the date of the payment for the period

payments
--------
Calculates the number of payments for a loan. This is different than NPER.
NPER calculates the number of periods used in an annuity or loan from
a financial perspective. This function looks at how frequently a customer
chooses to make payments. This function has the following arguments:
    * NPER (required) - the number of periods used in calculating interest for a loan
    * frequency (optional): the payment frequency, which can be any of the following:
         - semimonthly - twice a month
         - monthly - once each month
         - bimonthly - every two months
         - quarterly - every quarter
         - semiannually - ever 6 months
         - annually - ever 12 months
         - none or one - only one payment at the end of the loan - typically don't mix this with balloonDate