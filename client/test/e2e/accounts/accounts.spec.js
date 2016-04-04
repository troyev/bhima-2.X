/* jshint expr:true */
/* global element, by, beforeEach, inject, browser */

var chai = require('chai');
var expect = chai.expect;

var FU = require('../shared/FormUtils');
var helpers = require('../shared/helpers');
var components = require('../shared/components');

helpers.configure(chai);

describe('Accounts Module', function () {
  'use strict';

  var path = '#/accounts';

  var accountBalance = {
      label : 'Compte de Balance',
      type : 'balance',
      is_asset : 1,
      number : '4503500'
  };

  var accountIncomeExpence = {
      label : 'Compte Income Expence',
      type : 'income/expense',
      is_charge : 0,
      number : '3384012'
  };

  var defaultAccount = 11;
  var accountRank = helpers.random(defaultAccount);



  // navigate to the account module before each test
  beforeEach(function () {
    browser.get(path);
  });

  it('Successfully creates a new account type Balance', function () {

    // swtich to the create form
    FU.buttons.create();
    FU.input('AccountsCtrl.account.label', accountBalance.label);
    element(by.model('AccountsCtrl.account.type')).element(by.cssContainingText('option', accountBalance.type)).click(); 
    FU.radio('AccountsCtrl.account.is_asset', accountBalance.is_asset);
    FU.input('AccountsCtrl.account.number', accountBalance.number);

    // select a Reference
    FU.select('AccountsCtrl.account.reference_id')
      .enabled()
      .first()
      .click();

    // submit the page to the server
    FU.buttons.submit();

    // expect a nice validation message
    FU.exists(by.id('create_success'), true);
  });


  it('successfully edits an account', function () {

    element(by.id('account-upd-' + accountRank )).click();

    // modify the account name
    FU.input('AccountsCtrl.account.label', ' Updated');


    element(by.id('locked')).click();
    element(by.id('change_account')).click();

    // make sure the success message appears
    FU.exists(by.id('update_success'), true);
  });

  it('successfully unlock an account', function () {
    element(by.id('account-upd-' + accountRank )).click();
    element(by.id('locked')).click();
    element(by.id('change_account')).click();

    // make sure the success message appears
    FU.exists(by.id('update_success'), true);
  });

  it('Successfully creates a new account type Income Expence', function () {

    // swtich to the create form
    FU.buttons.create();
    FU.input('AccountsCtrl.account.label', accountIncomeExpence.label);
    element(by.model('AccountsCtrl.account.type')).element(by.cssContainingText('option', accountIncomeExpence.type)).click(); 
    FU.input('AccountsCtrl.account.number', accountIncomeExpence.number);
    FU.radio('AccountsCtrl.account.is_charge', accountIncomeExpence.is_charge);

    // select a Profit Center
    FU.select('AccountsCtrl.account.cc_id')
      .enabled()
      .first()
      .click();

    // select a Reference
    FU.select('AccountsCtrl.account.reference_id')
      .enabled()
      .first()
      .click();

    // submit the page to the server
    FU.buttons.submit();

    // expect a nice validation message
    FU.exists(by.id('create_success'), true);
  });


  it('correctly blocks invalid form submission with relevant error classes', function () {
    // switch to the create form
    FU.buttons.create();

    // Verify form has not been successfully submitted
    expect(browser.getCurrentUrl()).to.eventually.equal(browser.baseUrl + path);

    element(by.id('submit-account')).click();

    // the following fields should be required
    FU.validation.error('AccountsCtrl.account.label');
    FU.validation.error('AccountsCtrl.account.type');
    FU.validation.error('AccountsCtrl.account.number');

    // the following fields are not required
    FU.validation.ok('AccountsCtrl.account.is_title');
    FU.validation.ok('AccountsCtrl.account.parent');
  });

});