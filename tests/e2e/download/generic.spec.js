const { testNavbar } = require('../generic/navbar');

const {test, describe} = require("@playwright/test");

testNavbar('downloads.html')
