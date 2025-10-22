export default function (context) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    context.store.commit('courses/GET_LOCAL', cart || []);
}
