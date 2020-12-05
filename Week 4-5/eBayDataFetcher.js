/**
 * this is just a simple seeder to fetch data from the ebay api recursively
 * it will save the results as csv in this directory, so I can later work with it
 */
const axios = require("axios");
const { parseStringPromise } = require("xml2js");
const fs = require("fs");
require("dotenv").config;

const fetchDataFromEbay = async (categoryId, postalCode, radiusInKm, page) => {
  const { data } = await axios.get(
    `https://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsAdvanced&SECURITY-APPNAME=LukasWei-Template-PRD-fca7d98ed-bae2a879&GLOBAL-ID=EBAY-DE&categoryId=${categoryId}&buyerPostalCode=${postalCode}&itemFilter(0).name=LocalSearchOnly&itemFilter(0).value=true&itemFilter(1).name=MaxDistance&itemFilter(1).value=${radiusInKm}&paginationInput.pageNumber=${page}`
  );

  const dataJson = await parseStringPromise(data, { explicitArray: false });

  const {
    findItemsAdvancedResponse: {
      searchResult: { item },
      paginationOutput: { pageNumber, totalPages },
    },
  } = dataJson;
  console.log(`${pageNumber}/${totalPages}`);
  if (pageNumber < totalPages) {
    const newItem = await fetchDataFromEbay(
      categoryId,
      postalCode,
      radiusInKm,
      Number(pageNumber) + 1
    );
    return item.concat(newItem);
  } else {
    return item;
  }
};

const init = async () => {
  const data = await fetchDataFromEbay(175672, 32427, 100, 1);
  fs.writeFile("test.json", JSON.stringify(data), () => {
    console.log("done");
  });
};

init();
