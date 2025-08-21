const getStatusByColor = (status) => {
  switch (status) {
    case "Payment Checked":
      return "#03fc73";
    case "Card Issued":
      return "#6183E4";
    default:
      return "#FBBF24";
  }
};

export default getStatusByColor;
