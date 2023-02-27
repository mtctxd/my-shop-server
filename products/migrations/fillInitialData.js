const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_ACCESS_KEY_ID) {
  throw new Error('No credentials provided for AWS SDK');
}

if (!process.env.TABLE_PRODUCTS || !process.env.TABLE_STOCKS) {
  throw new Error('no table names provided - TABLE_PRODUCTS / TABLE_STOCKS');
}

AWS.config.update({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  },
  region: 'us-east-1',
});

const products = require('./mocks/InitialProductsMock.json');

const docClient = new AWS.DynamoDB.DocumentClient();

const { productsDB, stocksDB } = products.reduce(
  (acc, { id, title, description, price, count }) => {
    acc.productsDB.set(id, {
      id,
      title,
      description,
      price,
    });

    acc.stocksDB.set(id, {
      product_id: id,
      count,
    });

    return acc;
  },
  { productsDB: new Map(), stocksDB: new Map() }
);

const saveItemToTable = (tableName) => async (item) => {
  await docClient
    .put({
      TableName: tableName,
      Item: item,
    })
    .promise();
};

const saveItemToProducts = saveItemToTable(process.env.TABLE_PRODUCTS);
const saveItemToStocks = saveItemToTable(process.env.TABLE_STOCKS);

(async () => {
  try {
    productsDB.forEach(saveItemToProducts);
    stocksDB.forEach(saveItemToStocks);
    console.log('Tables filled successfully');
  } catch (error) {
    console.error('Error filling tables:', error);
  }
})();
