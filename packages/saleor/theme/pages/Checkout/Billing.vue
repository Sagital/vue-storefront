<template>

  <ValidationObserver v-slot="{ handleSubmit }">
    <SfHeading
      :level="3"
      :title="$t('Billing')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <form @submit.prevent="handleSubmit(() => handleFormSubmit(billingDetails))">

      <UserBillingAddresses
        v-if="isAuthenticated "
        v-model="setAsDefault"
        :currentAddressId="currentAddressId || NOT_SELECTED_ADDRESS"
        @setCurrentAddress="handleSetCurrentAddress"
      />

      <SfCheckbox
        :selected="sameAsShipping"
        @change="handleCheckSameAddress"
        label="Copy address data from shipping"
        name="copyShippingAddress"
        class="form__element"
      />

      <div class="form" >
        <ValidationProvider
          name="firstName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="billingDetails.firstName"
            label="First name"
            name="firstName"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="lastName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="billingDetails.lastName"
            label="Last name"
            name="lastName"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>

        <ValidationProvider
          name="phone"
          rules="required|digits:10"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="billingDetails.phone"
            label="Phone number"
            name="phone"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>

        <div class="sf-input form__element form__element--half form__element--half-even">&nbsp;</div>

        <ValidationProvider
          name="streetName"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="billingDetails.streetAddress1"
            label="Street address 1"
            name="streetAddress1"
            class="form__element form__element--half"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="apartment"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="billingDetails.streetAddress2"
            label="Street Address 2"
            name="streetAddress2"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>

        <ValidationProvider
          name="state"
          rules="required"
          v-slot="{ errors }"
          slim
        >

          <SfSelect
            v-model="billingDetails.countryArea"
            label="State"
            name="state"
            class="form__element form__element--half form__select sf-select--underlined"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
            <SfSelectOption
              v-for="stateOption in getCountryStates()"
              :key="stateOption.code"
              :value="stateOption.code"
            >
              {{ stateOption.name }}
            </SfSelectOption>
          </SfSelect>

        </ValidationProvider>

        <ValidationProvider
          name="city"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="billingDetails.city"
            label="City"
            name="city"
            class="form__element form__element--half form__element--half-even"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider
          name="country"
          rules="required|min:2"
          v-slot="{ errors }"
          slim
        >
          <SfSelect
            v-model="billingDetails.country"
            label="Country"
            name="country"
            class="form__element form__element--half form__select sf-select--underlined"
            required
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          >
            <SfSelectOption
              v-for="countryOption in getCountries()"
              :key="countryOption.code"
              :value="countryOption.code"
            >
              {{ countryOption.name }}
            </SfSelectOption>
          </SfSelect>
        </ValidationProvider>
        <ValidationProvider
          name="zipCode"
          rules="min:2"
          v-slot="{ errors }"
          slim
        >
          <SfInput
            v-model="billingDetails.postalCode"
            label="Zip-code"
            name="zipCode"
            class="form__element form__element--half form__element--half-even"
            :valid="!errors[0]"
            :errorMessage="errors[0]"
          />
        </ValidationProvider>
      </div>
      <div class="form">
        <div class="form__action">
          <SfButton
            class="sf-button color-secondary form__back-button"
            type="button"
            @click="$router.push('/checkout/shipping')"
          >
            {{ $t('Go back') }}
          </SfButton>
          <SfButton
            class="form__action-button"
            type="submit"
          >
            {{ $t('Continue to payment') }}
          </SfButton>
        </div>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import {
  SfHeading,
  SfInput,
  SfButton,
  SfSelect,
  SfRadio,
  SfCheckbox
} from '@storefront-ui/vue';
import {onMounted, ref} from '@vue/composition-api';
import {onSSR} from '@vue-storefront/core';
import {
  useBilling,
  userBillingGetters,
  useUser,
  useUserBilling
} from '@vue-storefront/saleor';
import {required, min, digits} from 'vee-validate/dist/rules';
import {ValidationProvider, ValidationObserver, extend} from 'vee-validate';

import {countries} from '../../config';
import convertAddressToAddressInput from '@vue-storefront/saleor/src/helpers/internals/convertAddressToAddressInput';

extend('required', {
  ...required,
  message: 'This field is required'
});
extend('min', {
  ...min,
  message: 'The field should have at least {length} characters'
});
extend('digits', {
  ...digits,
  message: 'Please provide a valid phone number'
});

export default {
  name: 'Billing',
  components: {
    SfHeading,
    SfInput,
    SfButton,
    SfSelect,
    SfRadio,
    SfCheckbox,
    ValidationProvider,
    ValidationObserver,
    UserBillingAddresses: () => import('@/components/Checkout/UserBillingAddresses')
  },
  setup(props, context) {
    const {billingDetails, copyFromShipping, saveBillingDetails} = useBilling();

    const {isAuthenticated} = useUser();

    const setAsDefault = ref(false);
    const {billing: userBilling, load: loadUserBilling} = useUserBilling();

    const NOT_SELECTED_ADDRESS = '';
    const currentAddressId = ref(NOT_SELECTED_ADDRESS);

    const canAddNewAddress = ref(true);

    const handleSetCurrentAddress = address => {

      billingDetails.value = convertAddressToAddressInput(address);

      currentAddressId.value = address.id;
      canAddNewAddress.value = false;
    };

    const sameAsShipping = ref(false);

    const getCountryStates = () => {
      const code = billingDetails.value.country;

      const country = countries.find(c => c.code === code);

      if (!country || !country.states) {
        return [];
      }

      return Object.keys(country.states).map(key => ({code: key, name: country.states[key]}));
    };

    const getCountries = () => {
      return countries.map(c => ({code: c.code, name: c.name}));

    };

    const handleCheckSameAddress = () => {
      sameAsShipping.value = !sameAsShipping.value;
      if (sameAsShipping.value) {
        copyFromShipping();
      }

    };

    const handleFormSubmit = async (aa) => {

      console.log('in handle form submit');
      console.log(billingDetails);
      console.log(aa);

      await saveBillingDetails(aa);
      context.root.$router.push('/checkout/payment');
    };

    onSSR(async () => {

      if (isAuthenticated.value) {
        await loadUserBilling();
      }

    });

    const selectDefaultAddress = () => {

      const defaultAddress = userBillingGetters.getAddresses(userBilling.value, {isDefault: true});
      if (defaultAddress && defaultAddress.length) {
        handleSetCurrentAddress(defaultAddress[0]);
      }

    };

    onMounted(async () => {
      if (!userBilling.value?.addresses && isAuthenticated.value) {
        await loadUserBilling();
      }
      const billingAddresses = userBillingGetters.getAddresses(userBilling.value);
      if (!billingAddresses || !billingAddresses.length) {
        return;
      }
      const hasEmptyBillingDetails = !billingDetails.value || Object.keys(billingDetails.value).length === 0;
      if (hasEmptyBillingDetails) {
        selectDefaultAddress();
        return;
      }

      canAddNewAddress.value = false;
    });

    return {
      NOT_SELECTED_ADDRESS,
      setAsDefault,
      canAddNewAddress,
      billingDetails,
      handleSetCurrentAddress,
      currentAddressId,
      countries,
      sameAsShipping,
      isAuthenticated,
      getCountries,
      getCountryStates,
      handleCheckSameAddress,
      handleFormSubmit
    };
  }
};
</script>
<style lang="scss" scoped>
  .title {
    margin: var(--spacer-xl) 0 var(--spacer-base) 0;
  }

  .form {
    &__select {
      display: flex;
      align-items: center;
      --select-option-font-size: var(--font-size--lg);

      ::v-deep .sf-select__dropdown {
        font-size: var(--font-size--lg);
        margin: 0;
        color: var(--c-text);
        font-family: var(--font-family--secondary);
        font-weight: var(--font-weight--normal);
      }
    }

    @include for-desktop {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }

    &__element {
      margin: 0 0 var(--spacer-xl) 0;
      @include for-desktop {
        flex: 0 0 100%;
      }

      &--half {
        @include for-desktop {
          flex: 1 1 50%;
        }

        &-even {
          @include for-desktop {
            padding: 0 0 0 var(--spacer-xl);
          }
        }
      }
    }

    &__group {
      display: flex;
      align-items: center;
    }

    &__action {
      @include for-desktop {
        flex: 0 0 100%;
        display: flex;
      }
    }

    &__action-button, &__back-button {
      --button-width: 100%;
      @include for-desktop {
        --button-width: auto;
      }
    }

    &__action-button {
      &--secondary {
        @include for-desktop {
          order: -1;
          --button-margin: 0;
          text-align: left;
        }
      }

      &--add-address {
        width: 100%;
        margin: 0;
        @include for-desktop {
          margin: 0 0 var(--spacer-lg) 0;
          width: auto;
        }
      }
    }

    &__back-button {
      margin: var(--spacer-xl) 0 var(--spacer-sm);

      &:hover {
        color: white;
      }

      @include for-desktop {
        margin: 0 var(--spacer-xl) 0 0;
      }
    }

    &__back-button {
      margin: 0 0 var(--spacer-sm) 0;
      @include for-desktop {
        margin: 0 var(--spacer-xl) 0 0;
      }
    }
  }

  .payment-methods {
    @include for-desktop {
      display: flex;
      padding: var(--spacer-lg) 0;
      border: 1px solid var(--c-light);
      border-width: 1px 0;
    }
  }

  .payment-method {
    --radio-container-align-items: center;
    --ratio-content-margin: 0 0 0 var(--spacer-base);
    --radio-label-font-size: var(--font-base);
    --radio-background: transparent;
    white-space: nowrap;
    border: 1px solid var(--c-light);
    border-width: 1px 0 0 0;

    &:last-child {
      border-width: 1px 0;
    }

    --radio-background: transparent;
    @include for-desktop {
      border: 0;
      --radio-border-radius: 4px;
    }
  }
</style>
