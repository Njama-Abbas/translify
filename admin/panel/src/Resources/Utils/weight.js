const format = {
  hm(load) {
    let unit;
    switch (load) {
      case 1:
        unit = 1;
        break;
      case 2:
        unit = 2;
        break;
      case 3:
        unit = 3;
        break;
      case 4:
        unit = 4;
        break;
      case 5:
        unit = "More than 4";
        break;
      default:
        unit = null;
        break;
    }
    return unit;
  },
  fr(load) {
    let unit;
    switch (load) {
      case 1:
        unit = "0-1";
        break;
      case 2:
        unit = "1-2";
        break;
      case 3:
        unit = "2-3";
        break;
      case 4:
        unit = "3-4";
        break;
      case 5:
        unit = "More than 4";
        break;
      default:
        unit = null;
        break;
    }
    return unit;
  },
  om(load) {
    let unit;
    switch (load) {
      case 1:
        unit = "0-2500";
        break;
      case 2:
        unit = "2500-4500";
        break;
      case 3:
        unit = "4500-7000";
        break;
      case 4:
        unit = "7000-10000";
        break;
      case 5:
        unit = "Above 10000";
        break;
      default:
        unit = null;
        break;
    }
    return unit;
  },
};

export default function formatWeight(load, moveType) {
  let weight;
  switch (moveType) {
    case "hm":
      weight = format.hm(load) + " bedroom(s)";
      break;
    case "om":
      weight = format.om(load) + " sqaure/feet";
      break;
    case "fr":
    default:
      weight = format.fr(load) + " Tone(s)";
      break;
  }
  return weight;
}
