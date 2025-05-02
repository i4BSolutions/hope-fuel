var numeral = require("numeral");

const formatAmount = (value) => {
  return numeral(value).format("0,000.00");
};

export default formatAmount;
