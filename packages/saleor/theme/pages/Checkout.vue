<template>
  <div id="checkout">
    <div class="checkout">
      <div class="checkout__main">
        {{ currentStep }}
        <SfSteps :active="currentStep" v-if="currentStep < 4" class="checkout__steps"  @change="updateStep($event)">
          <SfStep v-for="(step, index) in STEPS" :key="step.name" :name="step.label">
            <nuxt-child
              @showReview="handleShowReview"
              @nextStep="handleNextStep(index + 1)"
            />
          </SfStep>
        </SfSteps>
        <nuxt-child v-else @changeStep="updateStep($event)"/>
      </div>
      <div class="checkout__aside desktop-only" v-if="currentStep < 4">
        <transition name="fade">
          <CartPreview v-if="showCartPreview" key="order-summary"/>
          <OrderReview v-else key="order-review"/>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>

import {SfSteps, SfButton} from '@storefront-ui/vue';
import CartPreview from '~/components/Checkout/CartPreview';
import OrderReview from '~/components/Checkout/OrderReview';
import {ref} from '@vue/composition-api';

const STEPS = [
  {
    name: 'personal-details',
    label: 'Personal Details'
  },
  {
    name: 'shipping',
    label: 'Shipping'
  },
  {
    name: 'billing',
    label: 'Billing'
  },
  {
    name: 'payment',
    label: 'Payment'
  },
  {
    name: 'thank-you',
    label: 'Thank You'
  }
];

// TODO(CHECKOUT): block pages when you haven't finished previous steps / don't have products in cart and so on.
// TODO(CHECKOUT): save data that you put in the forms - after refreshing page everything should be filled
// TODO(CHECKOUT): form validations

export default {
  name: 'Checkout',
  components: {
    SfButton,
    SfSteps,
    CartPreview,
    OrderReview
  },
  setup(props, context) {

    const currentPath = context.root.$router.currentRoute.path.split('/checkout/')[1];
    console.log(currentPath);
    const currentIndex = STEPS.findIndex(s => s.name === currentPath);

    const showCartPreview = ref(true);
    const currentStep = ref(currentIndex);

    console.log('in setup');
    console.log(currentStep);
    console.log(context.root.$router.currentRoute);

    const handleShowReview = () => {
      showCartPreview.value = false;
    };

    const updateStep = (next) => {
      console.log('updating step');
      console.log(next);
      currentStep.value = next;
      context.root.$router.push(next < 4 ? STEPS[next].name : 'thank-you');
    };

    const handleNextStep = (nextStep) => {
      console.log('handling');
      console.log(nextStep);
      currentStep.value = nextStep;
      context.root.$router.push(nextStep < 4 ? STEPS[nextStep].name : 'thank-you');
    };

    return {
      STEPS,
      handleNextStep,
      currentStep,
      updateStep,
      handleShowReview,
      showCartPreview
    };
  }
};
</script>

<style lang="scss" scoped>
  #checkout {
    box-sizing: border-box;
    @include for-desktop {
      max-width: 1240px;
      margin: 0 auto;
    }
  }

  .checkout {
    @include for-desktop {
      display: flex;
    }

    &__main {
      @include for-desktop {
        flex: 1;
        padding: var(--spacer-xl) 0 0 0;
      }
    }

    &__aside {
      @include for-desktop {
        flex: 0 0 25.5rem;
        margin: 0 0 0 4.25rem;
      }
    }

    &__steps {
      --steps-content-padding: 0 var(--spacer-base);
      @include for-desktop {
        --steps-content-padding: 0;
      }
    }
  }
</style>
