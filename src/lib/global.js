import GlobalEnum from './enum'
import GlobalComponent from './component'
import GlobalDirective from './directive'
import GlobalMethod from './method'
import GlobalRegExp from './validation'

function install(Vue) {
  /* =====全局枚举===================================== */
  Vue.prototype.$enum = GlobalEnum;

  /* =====全局校验===================================== */
  Vue.prototype.$valid = GlobalRegExp;

  /* =====全局组件===================================== */
  GlobalComponent.forEach(component => {
    Vue.component(component.name, component);
  });

  /* =====全局指令===================================== */
  for (const name in GlobalDirective) {
    Vue.directive(name, GlobalDirective[name]);
  }

  /* =====全局方法===================================== */
  for (const method in GlobalMethod) {
    Vue.prototype[method] = GlobalMethod[method]
  }

  /* =====全局过滤器=================================== */
  Vue.prototype.$filter = function(value, kind, group) {
    let res = [];
    if (group) {
      const key = `${kind}.${group}`;
      res = this.$store.state.enums[key] && this.$store.state.enums[key].filter(_ => _.value === value);
    } else {
      for (const key in this.$store.state.enums) {
        if (this.$store.state.enums.hasOwnProperty(key) &&
          key.split('.')[0] === kind) {
          res = res.concat(this.$store.state.enums[key])
        }
      }
      res = res.filter(_ => _.value === value);
    }
    return res && res[0] ? res[0].text : value;
  };
}

export default { install }
