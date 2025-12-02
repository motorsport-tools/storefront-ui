import GetAddressesQuery from './GetAddressesQuery';
import GetCategoriesQuery from './GetCategoriesQuery';
import GetCategoryQuery from './GetCategoryQuery';
import GetCountriesQuery from './GetCountriesQuery';
import GetStatesQuery from './GetStatesQuery';
import GetDeliveryMethodsQuery from './GetDeliveryMethodsQuery';
import GetPaymentConfirmation from './GetPaymentConfirmation';
import GetPaymentMethodsQuery from './GetPaymentMethodsQuery';
import GetProductTemplateListQuery from './GetProductTemplateListQuery';
import GetProductTemplateQuery from './GetProductTemplateQuery';
import GetProductVariantQuery from './GetProductVariantQuery';
import GetOrdersQuery from './GetOrdersQuery';
import GetOrderQuery from './GetOrderQuery';
import GetGuestOrderQuery from './GetGuestOrderQuery';
import GetInvoiceQuery from './GetInvoiceQuery';
import LoadCartQuery from './LoadCartQuery';
import LoadUserQuery from './LoadUserQuery';
import StockLotsQuery from './StockLotsQuery';
import WishlistLoadQuery from './WishlistLoadQuery';
import GetWebsiteHomepageQuery from './GetWebsiteHomepageQuery';
import GetEasyShipRatesQuery from './GetEasyShipRatesQuery';
import GetProductTemplateListQueryForRecentViews from './GetProductTemplateListQueryForRecentViews'
import AccessQuery from './AccessQuery';

enum QueryName {
  GetProductVariantQuery = 'GetProductVariantQuery',
  LoadUserQuery = 'LoadUserQuery',
  StockLotsQuery = 'StockLotsQuery',
  GetCategoriesQuery = 'GetCategoriesQuery',
  GetCategoryQuery = 'GetCategoryQuery',
  GetProductTemplateListQuery = 'GetProductTemplateListQuery',
  GetProductTemplateQuery = 'GetProductTemplateQuery',
  //GetWishlist = 'GetWishlist',
  LoadCartQuery = 'LoadCartQuery',
  GetAddressesQuery = 'GetAddressesQuery',
  WishlistLoadQuery = 'WishlistLoadQuery',
  GetCountriesQuery = 'GetCountriesQuery',
  GetStates = 'GetStatesQuery',
  GetDeliveryMethodsQuery = 'GetDeliveryMethodsQuery',
  GetPaymentMethodsQuery = 'GetPaymentMethodsQuery',
  GetPaymentConfirmation = 'GetPaymentConfirmation',
  GetOrdersQuery = 'GetOrdersQuery',
  GetOrderQuery = 'GetOrderQuery',
  GetGuestOrderQuery = 'GetGuestOrderQuery',
  GetProductTemplateListQueryForRecentViews = 'GetProductTemplateListQueryForRecentViews',
  GetWebsiteHomepageQuery = 'GetWebsiteHomepageQuery',
  GetInvoiceQuery = 'GetInvoiceQuery',
  GetEasyShipRatesQuery = 'GetEasyShipRatesQuery',
  AccessQuery = 'AccessQuery',
}

const Queries: Record<QueryName, string> = {
  GetProductVariantQuery,
  LoadUserQuery,
  StockLotsQuery,
  GetCategoriesQuery,
  GetCategoryQuery,
  GetProductTemplateListQuery,
  GetProductTemplateQuery,
  WishlistLoadQuery,
  LoadCartQuery,
  GetAddressesQuery,
  GetCountriesQuery,
  GetDeliveryMethodsQuery,
  GetPaymentMethodsQuery,
  GetPaymentConfirmation,
  GetProductTemplateListQueryForRecentViews,
  GetOrdersQuery,
  GetOrderQuery,
  GetGuestOrderQuery,
  GetInvoiceQuery,
  GetStatesQuery,
  GetWebsiteHomepageQuery,
  GetEasyShipRatesQuery,
  AccessQuery,
};

const QueriesToByPassCache: string[] = [
  QueryName.LoadUserQuery,
  QueryName.WishlistLoadQuery,
  QueryName.LoadCartQuery,
];

export { Queries, QueryName, QueriesToByPassCache };
