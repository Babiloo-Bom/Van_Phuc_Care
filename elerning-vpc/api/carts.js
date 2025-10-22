export default (axios) => ({
    getItems: (itemsId) => axios.post('/a/carts', itemsId).then((_) => _.data),
    update: (cartId, data) => axios.patch(`/a/carts/${cartId}`, data).then((_) => _.data),
    delete: (cartId) => axios.delete(`/a/carts/${cartId}`).then((_) => _.data),
});
