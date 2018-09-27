export default {
  'action': function (el, binding, vnode, oldVnode) {
    const s = JSON.stringify;
    if (s(binding.value) &&
      (vnode &&
        vnode.context &&
        vnode.context.$store.state &&
        vnode.context.$store.state.buttons &&
        !vnode.context.$store.state.buttons[binding.value])) {
      if (el && el.parentNode && el.parentNode.contains(el)) {
        el.parentNode.removeChild(el)
      }
    }
  }
};
