const SortBy = {
  date(a, b) {
    let dateOf_A = new Date(a.orderDate),
      dateOf_B = new Date(b.orderDate);
    return dateOf_A > dateOf_B ? 1 : dateOf_A < dateOf_B ? -1 : 0;
  },
  pickup(a, b) {
    let pickupOf_A = a.pickup.address;
    let pickupOf_B = b.pickup.address;
    return pickupOf_A > pickupOf_B ? 1 : pickupOf_A < pickupOf_B ? -1 : 0;
  },
  destination(a, b) {
    let destinationOf_A = a.destination.address;
    let destinationOf_B = b.destination.address;
    return destinationOf_A > destinationOf_B
      ? 1
      : destinationOf_A < destinationOf_B
      ? -1
      : 0;
  },
  charges(a, b) {
    return a.charges > b.charges ? 1 : a.charges < b.charges ? -1 : 0;
  },
};

export default function SortOrders(orders, sort_order) {
  let sorted_orders = [];
  switch (sort_order) {
    case "date":
      sorted_orders = orders.sort(SortBy.date);
      break;
    case "destination":
      sorted_orders = orders.sort(SortBy.destination);
      break;
    case "pickup":
      sorted_orders = orders.sort(SortBy.pickup);
      break;
    case "charges":
      sorted_orders = orders.sort(SortBy.charges);
      break;
    default:
      sorted_orders = orders;
      break;
  }
  return sorted_orders;
}
