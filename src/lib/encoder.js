export default {
  personName: (val) => {
    return val ? val.slice(0, 1) + '*' : val
  },
  companyName: (val) => {
    return val ? val.slice(0, 4) + '***' : val
  },
  ident: (val) => {
    return val ? val.replace(/.{6}$/, '******') : val
  },
  mobile: (val) => {
    return val ? val.slice(0, 3) + '******' + val.slice(9) : val
  },
  card: (val) => {
    return val ? val.slice(0, 4) + '*******' + val.slice(-4) : val
  }
}
