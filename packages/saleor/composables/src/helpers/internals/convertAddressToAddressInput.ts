import { Address, AddressInput } from '@vue-storefront/saleor-api';
import parsePhoneNumber from 'libphonenumber-js';

export default (address: Address): AddressInput => {
  if (!address) {
    return {};
  }

  let phone = null;
  let country = null;

  if (address.country) {
    country = address.country.code;
  }

  if (address.phone) {
    // phone number is stored in national format e.g. +19047105785. We need to convert it in natonal format

    const phoneNumber = parsePhoneNumber(address.phone, country);
    phone = phoneNumber.formatNational().replace(/\D+/g, '');
  }

  return {
    firstName: address.firstName,
    lastName: address.lastName,
    companyName: address.companyName,
    countryArea: address.countryArea,
    streetAddress1: address.streetAddress1,
    streetAddress2: address.streetAddress2,
    city: address.city,
    postalCode: address.postalCode,
    phone: phone,
    country: country
  } as AddressInput;
};
