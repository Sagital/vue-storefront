import CartItem from '@vue-storefront/core/modules/cart/types/CartItem'
import { sha3_224 } from 'js-sha3'

const replaceNumberToString = obj => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      return replaceNumberToString(obj[key]);
    }
    obj[key] = String(obj[key]);
  });
  return obj;
}

const getDataToHash = (product: CartItem): any => {
  if (!product.product_option) {
    return product.sku ? product.sku : null
  }

  const { extension_attributes } = product.product_option
  const { bundle_options, custom_options } = extension_attributes

  if (bundle_options && ((Array.isArray(bundle_options) && bundle_options.length > 0) || (typeof bundle_options === 'object' && bundle_options !== null && Object.values(bundle_options).length > 0))) {
    return Array.isArray(bundle_options) ? bundle_options : Object.values(replaceNumberToString(bundle_options))
  }
  if (custom_options && ((Array.isArray(custom_options) && custom_options.length > 0) || (typeof custom_options === 'object' && custom_options !== null && Object.values(custom_options).length > 0))) {
    return Array.isArray(custom_options) ? custom_options : Object.values(replaceNumberToString(JSON.parse(JSON.stringify(custom_options))))
  }

  return product.product_option
}

const productChecksum = (product: CartItem): string => sha3_224(JSON.stringify(getDataToHash(product)))

export default productChecksum