export const topSavers = [
  {
    title: 'Bonjour Butterscotch',
    price: '$2.70',
    grams: '280g',
    image: require('../assets/Stores/ic_prod01.png'),
    id: 1
  },
  {
    title: 'Bonjour Butterscotch',
    price: '$2.70',
    grams: '280g',
    image: require('../assets/Stores/ic_prod02.png'),

    id: 1
  },
  {
    title: 'Bonjour Butterscotch',
    price: '$2.70',
    grams: '280g',
    image: require('../assets/Stores/ic_prod03.png'),

    id: 1
  },
  {
    title: 'Bonjour Butterscotch',
    price: '$2.70',
    grams: '280g',
    image: require('../assets/Stores/ic_prod04.png'),

    id: 1
  },
  {
    title: 'Bonjour Butterscotch',
    price: '$2.70',
    grams: '280g',
    image: require('../assets/Stores/ic_prod05.png'),

    id: 1
  },
  {
    title: 'Bonjour Butterscotch',
    price: '$2.70',
    grams: '280g',
    image: require('../assets/Stores/ic_prod06.png'),

    id: 1
  }
];

export const cartItems = [
  {
    title: 'Bonjour Butterscotch',
    price: '$2.70',
    grams: '280g',
    image: require('../assets/Stores/ic_prod01.png'),
    id: 1
  },
  {
    title: 'Bonjour Butterscotch',
    price: '$2.70',
    grams: '280g',
    image: require('../assets/Stores/ic_prod02.png'),

    id: 1
  }
];

export const FilterCategories = [
  'BreakFast',
  'Condiments',
  'Dairy',
  'Oil',
  'Flour',
  'Price',
  'Fresh Products',
  'Dals & Pulses'
];

export const StoreMainCategoriesList = [
  {
    title: 'Groceries',
    icon: require('../assets/Stores/ic_grocery.png'),
    isselected: true
  },
  {
    title: 'Health',
    icon: require('../assets/Stores/ic_health.png'),
    isselected: true
  },
  {
    title: 'Beauty',
    icon: require('../assets/Stores/ic_beauty.png'),
    isselected: false
  },
  {
    title: 'Organic',
    icon: require('../assets/Stores/ic_organic.png'),
    isselected: false
  },
  {
    title: 'HouseHold',
    icon: require('../assets/Stores/ic_household.png'),
    isselected: false
  },
  {
    title: 'Prayer',
    icon: require('../assets/Stores/ic_prayer.png'),
    isselected: false
  }
];

export const myOrdersList = [
  {
    orderNo: '#0001',
    status: 'IN TRANSIT',
    status_color: '#FF8960',
    estimated: '20 Sep, 2017',
    delivery: {
      name: 'Jonathan Jackson',
      address: '521 Hougang Ave 6, #11-59 Singapore 530521',
      email: 'JonathanJackson@hotmail.com',
      mobile: '+65 9123 4567'
    },
    title: '',
    data: [
      {
        name: 'LONG DRESS WITH SLITS',
        price: '$ 89.00',
        size: 'L',
        quantity: 1
      },
      {
        name: 'LONG DRESS WITH SLITS',
        price: '$ 89.00',
        size: 'L',
        quantity: 1
      }
    ]
  },
  {
    orderNo: '#0001',
    status: 'COMPLETED',
    status_color: '#52E5BB',
    estimated: '7 Sep, 2017',
    delivery: {
      name: 'Jonathan Jackson',
      address: '521 Hougang Ave 6, #11-59 Singapore 530521',
      email: 'JonathanJackson@hotmail.com',
      mobile: '+65 9123 4567'
    },
    title: '',
    data: [
      {
        name: 'LONG DRESS WITH SLITS',
        price: '$ 89.00',
        size: 'L',
        quantity: 1
      }
    ]
  }
];

export const PaymentCards = [
  {
    cardno: '****  ****  ****  7853',
    expiry: '05 / 19',
    holder_name: 'Jonathan Jackson',
    CVV: '******',
    type: 'VISA',
    selected: true,
    icon: require('../assets/Stores/ic_visa.png')
  },
  {
    cardno: '****  ****  ****  7853',
    expiry: '05 / 19',
    holder_name: 'Jonathan Jackson',
    CVV: '******',
    type: 'MASTER CARD',
    selected: false,
    icon: require('../assets/Cart/ic_mastercard.png')
  },
  {
    cardno: '****  ****  ****  7853',
    expiry: '05 / 19',
    holder_name: 'Jonathan Jackson',
    CVV: '******',
    type: 'DISCOVER',
    selected: false,
    icon: require('../assets/Cart/ic_mastercard.png')
  },
  {
    cardno: '****  ****  ****  7853',
    expiry: '05 / 19',
    holder_name: 'Jonathan Jackson',
    CVV: '******',
    type: 'PAYPAL',
    selected: false,
    icon: require('../assets/Stores/ic_visa.png')
  }
];

export const deliveryAddrList = [
  {
    name: 'John jackson',
    address: '521 HOUGANG AVE 6',
    city: '#11-59, Singapore 530521',
    mobile: '+65 9123 4567',
    primary: true
  },
  {
    name: 'John jackson',
    address: 'Suntec Tower Two, 9 Temasek Boulevard',
    city: '#11-59, Singapore 530521',
    mobile: '+65 9123 4567',
    primary: false
  }
];
