export default function OrderAnalysis(orders, role) {
  const thisMonth = new Date().getMonth();

  const ordersThisMoth = orders.filter(
    (order) => new Date(order.orderDate).getMonth() === thisMonth
  );

  const ordersToday = orders.filter((order) => isToday(order.orderDate));

  const charges = ordersToday.map((order) => order.charges);

  let total = 0;
  for (let x = 0; x < charges.length; x++) {
    if (role === "driver") {
      total += charges[x] * 0.9;
    } else {
      total += charges[x];
    }
  }

  let allMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let response = [
    {
      label: `${allMonths[thisMonth]} Orders`,
      count: ordersThisMoth.length,
    },
    {
      label: `${
        role === "driver" ? "Today Earnings: Ksh" : "Todays Spend: Ksh"
      }`,
      count: Math.round(total),
    },
    {
      label: "Today's Orders",
      count: ordersToday.length,
    },
    {
      label: "All Orders",
      count: orders.length,
    },
  ];
  return response;
}
const isToday = (date) => {
  const today = new Date();
  const someDate = new Date(date);
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};
