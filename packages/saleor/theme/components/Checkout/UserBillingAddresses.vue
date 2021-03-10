<template>
  <div>
    <SfAddressPicker
      :selected="String(currentAddressId)"
      @change="setCurrentAddress($event)"
      class="billing__addresses"
    >
      <SfAddress
        v-for="billingAddress in billingAddresses"
        :key="userBillingGetters.getId(billingAddress)"
        :name="String(userBillingGetters.getId(billingAddress))"
      >
        <span
          >{{ userBillingGetters.getFirstName(billingAddress) }} {{ userBillingGetters.getLastName(billingAddress) }}</span
        >
        <span
          >{{ userBillingGetters.getStreetName(billingAddress) }}
          {{ userBillingGetters.getApartmentNumber(billingAddress) }}</span
        >
        <span>{{ userBillingGetters.getPostCode(billingAddress) }}</span>
        <span
          >{{ userBillingGetters.getCity(billingAddress)
          }}{{ userBillingGetters.getProvince(billingAddress) ? `, ${userBillingGetters.getProvince(billingAddress)}` : '' }}</span
        >
        <span>{{ userBillingGetters.getCountry(billingAddress)}}</span>
        <span>{{ userBillingGetters.getPhone(billingAddress) }}</span>
      </SfAddress>
    </SfAddressPicker>
    <SfCheckbox
      data-cy="billing-details-checkbox_isDefault"
      :selected="value"
      @change="$emit('input', $event)"
      name="setAsDefault"
      label="Use this address as my default one."
      class="billing-address-setAsDefault"
    />
  </div>
</template>

<script>
import {
  SfCheckbox,
  SfAddressPicker
} from '@storefront-ui/vue';
import { useUserBilling, userBillingGetters } from '@vue-storefront/saleor';
export default {
  name: 'UserBillingAddresses',
  props: {
    currentAddressId: {
      type: String | Number,
      required: true
    },
    value: {
      type: Boolean,
      required: true
    }
  },
  components: {
    SfCheckbox,
    SfAddressPicker
  },
  setup (_, { emit }) {
    const { billing: userBilling } = useUserBilling();
    const setCurrentAddress = async addressId => {
      console.log('setting current address in userBillingAddresed');
      console.log(addressId);
      console.log(userBilling.value);

      const selectedAddress = userBilling.value.addresses.find(obj => {
        return obj.id === Number(addressId);
      });

      console.log(selectedAddress);

      if (!selectedAddress) {
        return;
      }
      emit('setCurrentAddress', selectedAddress);
    };
    return {
      billingAddresses: userBillingGetters.getAddresses(userBilling.value),
      setCurrentAddress,
      userBillingGetters
    };
  }
};
</script>

<style>
  .billing__addresses {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: var(--spacer-xl);
  }
  .billing-address-setAsDefault, .form__action-button--margin-bottom {
    margin-bottom: var(--spacer-xl);
  }
</style>
