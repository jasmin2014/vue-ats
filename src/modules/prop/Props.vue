<template>
  <div class="props"
       v-if="propList && propList.length > 0">
    <h4>
      <span>资产信息</span>
    </h4>
    <!--车辆-->
    <prop-car ref="propCarDTO"
              v-if="propList.includes('propCarDTO')"
              v-model="currentValue.propCarDTO"
              :mode="mode"></prop-car>
    <!--商铺-->
    <prop-shop ref="propShopDTO"
               v-if="propList.includes('propShopDTO')"
               v-model="currentValue.propShopDTO"
               :mode="mode"></prop-shop>
    <!--电商-->
    <prop-eshop ref="propElectronicCommerceDTO"
                v-if="propList.includes('propElectronicCommerceDTO')"
                v-model="currentValue.propElectronicCommerceDTO"
                :mode="mode"></prop-eshop>
    <!--社保/公积金-->
    <prop-gjj ref="propPublicReserveFunds"
              v-if="propList.includes('propPublicReserveFunds')"
              v-model="currentValue.propPublicReserveFunds"
              :mode="mode"></prop-gjj>
    <!--房产-->
    <prop-house ref="propHouseDTO"
                v-if="propList.includes('propHouseDTO')"
                v-model="currentValue.propHouseDTO"
                :mode="mode"></prop-house>
    <!--设备-->
    <prop-device ref="propDeviceDTO"
                 v-if="propList.includes('propDeviceDTO')"
                 v-model="currentValue.propDeviceDTO"
                 :mode="mode"></prop-device>
  </div>
</template>

<script>
  import PropCar from './Car';
  import PropShop from './Shop';
  import PropEshop from './EShop';
  import PropGjj from './GJJ';
  import PropHouse from './House'
  import PropDevice from './Device'

  export default {
    components: {
      PropCar,
      PropShop,
      PropEshop,
      PropGjj,
      PropHouse,
      PropDevice
    },
    props: {
      value: Object,
      propList: Array,
      mode: String
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value)
      }
    },
    watch: {
      value: {
        handler(val) {
          if (val) {
            this.currentValue = this.$deepcopy(val)
          }
        },
        deep: true
      }
    },
    methods: {
      save(callback) {
        let isValid = true;
        let isEmpty = true;

        this.propList.forEach(prop => {
          this.$refs[prop] && this.$refs[prop].validate((valid, empty) => {
            if (!valid) isValid = false;
            isEmpty = isEmpty && !!empty;
          })
        });

        if (isValid && !isEmpty) {
          this.$emit('input', this.$deepcopy(this.currentValue));
        }
        typeof callback === 'function' && callback(isValid, isEmpty);
      }
    }
  }
</script>
