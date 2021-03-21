const bcrypt = require("bcrypt");

const drivers = {
  approved: [
    {
      personal_details: {
        firstname: "Salman",
        lastname: "Khan",
        phoneno: "0712345678",
        email: "salmankhan@gmail.com",
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
        phoneno: "0712345679",
        email: "alisha@gmail.com",
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
        phoneno: "0712345680",
        email: "johnson@gmail.com",
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
        phoneno: "07123456781",
        email: "salmankhan@gmail.com",
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
        phoneno: "07123456782",
        email: "rodriguez@gmail.com",
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
        phoneno: "0712345698",
        email: "megan@gmail.com",
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
        phoneno: "0712345699",
        email: "laura@gmail.com",
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
        email: "eddy@gmail.com",
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
        phoneno: "07123456795",
        email: "david@gmail.com",
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
        phoneno: "0712345687",
        email: "adriane@gmail.com",
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
        phoneno: "0722345678",
        email: "valarie@gmail.com",
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
        phoneno: "072645679",
        email: "ulrich@gmail.com",
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
        phoneno: "0743845680",
        email: "rachael@gmail.com",
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
