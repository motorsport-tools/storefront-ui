const getPaymentProviderComponentName = (providerCode: string) => {
  switch (providerCode) {
    case "adyen":
      return "ProviderAdyen";
    case "paypal":
      return "ProviderPayPal";
    case "klarna":
      return "ProviderKlarna";
    case "rvvup":
      return "ProviderRvvup"
    case "stripe":
      return "ProviderStripe"
    default:
      return "UnknownPaymentProvider";
  }
};

export { getPaymentProviderComponentName };
