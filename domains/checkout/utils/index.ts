const getPaymentProviderComponentName = (providerCode: string) => {
  console.log('Provider Code', providerCode)
  switch (providerCode) {
    case "adyen":
      return "ProviderAdyen";
    case "paypal":
      return "ProviderPayPal";
    case "klarna":
      return "ProviderKarna";
    case "rvvup":
      return "ProviderRvvup"
    default:
      return "UnknownPaymentProvider";
  }
};

export { getPaymentProviderComponentName };
