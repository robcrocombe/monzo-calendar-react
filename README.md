# Monzo Calendar (React)

A calendar for your [Monzo](https://monzo.com) money. [Originally written in Vue](https://github.com/robcrocombe/monzo-calendar), I wanted to try again in React. You can:

* View this month's transactions in a calendar view.
* View your current balance.
* Plan transactions you know you're going to make in the future, and see how they will affect your balance.

[Try a live demo here](https://robcrocombe.github.io/monzo-calendar-react/)

## Getting Started

This web app is written in [React.js](https://reactjs.org) with [Parcel](https://parceljs.org).

* Clone this repo.
* Run [Yarn](https://yarnpkg.com) to install dependencies.
* Add your [Monzo Client ID and Secret](https://developers.monzo.com)
  * Run `yarn create-env` and add them to the local `.env` file.
  * Alternatively at runtime, by clicking the `Login` button.
* Run `yarn start`
* Visit the site in your favourite browser.

## To Do
- Support changing months.
- Edit/delete planned transactions.
- Notify user (outside of dev console) when API requests fail.
- More features.
