const bcrypt = require("bcrypt");

const drivers = {
  approved: [
    {
      personal_details: {
        firstname: "Salman",
        lastname: "Khan",
        phoneno: "712345678",
        username: "salmankhan",
        rating: 5.0,
      },
      driving_details: {
        truckno: "KDB 125 Q",
        dlno: "WLX234",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "Alisha",
        lastname: "Keys",
        phoneno: "712345679",
        username: "alisha",
        rating: 4.3,
      },
      driving_details: {
        truckno: "KDC 126 R",
        dlno: "BLX235",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "Dwayne",
        lastname: "Johnson",
        phoneno: "712345680",
        username: "dwayneJ",
        rating: 4.2,
      },
      driving_details: {
        truckno: "KDE 127 S",
        dlno: "ALX235",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "Paul",
        lastname: "Walker",
        phoneno: "7123456781",
        username: "paulwalker",
        rating: 4.0,
      },
      driving_details: {
        truckno: "KDF 130 U",
        dlno: "BLX240",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "Michelle",
        lastname: "Rodriguez",
        phoneno: "7123456782",
        username: "rodriguez",
        rating: 4.5,
      },
      driving_details: {
        truckno: "KDG 512 X",
        dlno: "CLX267",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
  ],
  declined: [
    {
      personal_details: {
        firstname: "Megan",
        lastname: "Boone",
        phoneno: "712345698",
        username: "megan",
      },
      driving_details: {
        truckno: "KCZ 335 A",
        dlno: "VCM123",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "Laura",
        lastname: "Sohn",
        phoneno: "712345699",
        username: "laura",
      },
      driving_details: {
        truckno: "KDM 226 R",
        dlno: "BLX245",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "Eddy",
        lastname: "Gathengi",
        phoneno: "0712345691",
        username: "eddy",
      },
      driving_details: {
        truckno: "KBE 227 S",
        dlno: "ALX289",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "David",
        lastname: "Strathairn",
        phoneno: "7123456795",
        username: "david",
      },
      driving_details: {
        truckno: "KAG 215 U",
        dlno: "WNL247",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "Adriane",
        lastname: "Lenox",
        phoneno: "712345687",
        username: "adriane",
      },
      driving_details: {
        truckno: "KMD 512 J",
        dlno: "CLC268",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
  ],
  pending: [
    {
      personal_details: {
        firstname: "Valarie",
        lastname: "Pettford",
        phoneno: "722345678",
        username: "valarie",
      },
      driving_details: {
        truckno: "KMX 125 S",
        dlno: "WLX212",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "Ulrich",
        lastname: "Thomsen",
        phoneno: "72645679",
        username: "ulrich",
      },
      driving_details: {
        truckno: "KDC 876 W",
        dlno: "BLX819",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
    {
      personal_details: {
        firstname: "Rachael",
        lastname: "Brosnahan",
        phoneno: "743845680",
        username: "rachael",
      },
      driving_details: {
        truckno: "KED 721 K",
        dlno: "ALX532",
        address: {
          place_name: "Nairobi Kenya",
          place_id: "1234567812345678",
        },
      },
    },
  ],
};

const set_password = (driver) => {
  return {
    personal_details: {
      ...driver.personal_details,
      password: bcrypt.hashSync("123Asd", 10),
      phoneno: "254" + driver.personal_details.phoneno,
      verification: {
        status: true,
        code: 10801080,
      },
    },
    driving_details: {
      ...driver.driving_details,
    },
  };
};

module.exports = {
  approved: drivers.approved.map(set_password),
  declined: drivers.declined.map(set_password),
  pending: drivers.pending.map(set_password),
};
