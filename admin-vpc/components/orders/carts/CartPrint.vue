<template>
    <div class="invoice-5 invoice-content" style="margin: 0 auto; display: flex; justify-content:center">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="invoice-inner clearfix">
                        <div id="invoice_wrapper" class="invoice-info clearfix">
                            <div class="invoice-contant">
                                <div class="invoice-headar">
                                    <div class="row">
                                        <div class="col-md-8 col-sm-6" style="">
                                            <div class="invoice-logo">
                                                <!-- logo started -->
                                                <div class="logo">
                                                    <img src="/images/logo.png" alt="logo">
                                                </div>
                                                <!-- logo ended -->
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-6">
                                            <div class="invoice-number-inner">
                                                <h2 class="name">
                                                    Invoice No: #{{ data.code }}
                                                </h2>
                                                <p class="mb-0">
                                                    Invoice Date: <span>{{ data.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="invoice-top">
                                    <div class="row">
                                        <div class="col-md-4 col-sm-6 mb-30">
                                            <div class="invoice-number">
                                                <h4 class="inv-title-1">
                                                    Invoice To
                                                </h4>
                                                <h2 class="name mb-10">
                                                    {{ data.customer?.fullname }}
                                                </h2>
                                                <p class="invo-addr-1 mb-0">
                                                    {{ data.customer?.email }} <br>
                                                    {{ data.customer?.address }} <br>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-6 mb-30">
                                            <div class="invoice-number">
                                                <div class="invoice-number-inner">
                                                    <h4 class="inv-title-1">
                                                        Invoice From
                                                    </h4>
                                                    <h2 class="name mb-10">
                                                        {{ $auth.user.firstname }} {{ $auth.user.lastname }}
                                                    </h2>
                                                    <p class="invo-addr-1 mb-0">
                                                        {{ $auth.user.email }}<br>
                                                        {{ $auth.user.address }} <br>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4 col-sm-6 mb-30 invoice-contact-us">
                                            <h4 class="inv-title-1">
                                                Get In Touch
                                            </h4>
                                            <h2 class="name mb-10">
                                                Contact Us
                                            </h2>
                                            <ul class="link">
                                                <li>
                                                    <i class="fa fa-map-marker" /> {{ $auth.user.address }}
                                                </li>
                                                <li>
                                                    <i class="fa fa-envelope" /> <a href="mailto:sales@hotelempire.com">{{ $auth.user.email }}</a>
                                                </li>
                                                <li>
                                                    <i class="fa fa-phone" /> <a href="tel:+55-417-634-7071">{{ $auth.user.phone }}</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="invoice-center">
                                    <div class="order-summary">
                                        <div class="table-outer">
                                            <table class="default-table invoice-table">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody v-if="data.items">
                                                    <tr v-for="product in data.items" :key="product._id">
                                                        <td class="text-center">
                                                            {{ product?.name }}
                                                        </td>
                                                        <td class="text-center">
                                                            {{ product?.price.toLocaleString('de-DE') }} VNĐ
                                                        </td>
                                                        <td class="text-center">
                                                            {{ product.number.toLocaleString('de-DE') }}
                                                        </td>
                                                        <td class="text-center">
                                                            {{ (Number(product?.price) * Number(product.number)).toLocaleString('de-DE') }} VNĐ
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="text-center">
                                                            <strong>Total Due</strong>
                                                        </td>
                                                        <td class="text-center" />
                                                        <td class="text-center" />
                                                        <td class="text-center">
                                                            <strong>{{ totalPrice(data.items).toLocaleString('de-DE') }} VNĐ</strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div class="invoice-bottom">
                                    <div class="row">
                                        <div class="col-lg-6 col-md-7 col-sm-7">
                                            <div class="terms-conditions mb-30">
                                                <h3 class="inv-title-1 mb-10">
                                                    Terms &amp; Conditions
                                                </h3>
                                                Please read these terms and conditions of use carefully before accessing, using or obtaining any materials, information, products or services.
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-5 col-sm-5">
                                            <div class="payment-method mb-30">
                                                <h3 class="inv-title-1 mb-10">
                                                    Payment
                                                </h3>
                                                <ul class="payment-method-list-1 text-14">
                                                    <li><strong>Method:</strong> Cash</li>
                                                    <li><strong>Account Name:</strong> {{ data.customer?.fullname }} </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        components: {
        },

        props: {
            data: {
                type: Object,
                default: () => {},
            },
        },

        data() {
            return {
            };
        },

        methods: {
            totalPrice(data) {
                return data?.reduce((accumulator, product) => accumulator + (product.price * product.number), 0);
            },

            totalBill(data) {
                const transportPrice = data?.transportFee ? Number(data?.transportFee.price) : 0;
                const productTotal = Number(this.totalPrice(data.products));

                if (data.discount) {
                    if (data.discount.type === 'percentage') {
                        const discountPercentage = Number(data.discount.price) / 100;
                        return productTotal * (1 - discountPercentage) + transportPrice;
                    } if (data.discount.type === 'amount') {
                        return productTotal - Number(data.discount.price) + transportPrice;
                    }
                }

                return productTotal + transportPrice;
            },
        },
    };
</script>
<style lang="scss">.invoice-info {
    background: #fff;
    position: relative;
    padding: 15px;
    z-index: 0;
}
.invoice-contant {
    background: #fff;
}
.inv-title-1 {
    color: #ff1f1f;
    font-weight: 400;
    margin-bottom: 5px;
}
.name {
    font-size: 18px;
    margin-bottom: 5px;
    font-weight: 500;
    text-transform: uppercase;
    color: #262525;
}
.m-0 {
    margin: 0 !important;
}
.invoice-headar {
    padding: 30px;
    border-bottom: solid 1px #ebeaea;
}
.invoice-top {
    padding: 30px 30px 0;
    border-bottom: solid 1px #ebeaea;
}
.order-summary {
    padding: 30px;
    border-bottom: solid 1px #ebeaea;
}
.table-outer {
    overflow-y: hidden;
    overflow-x: auto;
}
.default-table {
    position: relative;
    background: #ffffff;
    border: 0;
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
    min-width: 550px;
}
.default-table thead th {
    font-size: 15px;
    font-weight: 500;
    line-height: 30px;
    white-space: nowrap;
    color: #fff;
    height: 60px;
    width: 25%;
    text-align: center;
    padding-bottom: 20px;
}
.default-table thead td {
    text-align: center;
}
.default-table thead {
    background-color: #53c66e;
}
.mb-30 {
    margin-bottom: 30px;
}
.mb-10 {
    margin-bottom: 0px;
}
.col-md-4 {
    flex: 0 0 auto;
    width: 33.33333333%;
}
.default-table tr td {
    position: relative;
    padding: 21px 30px;
    font-size: 14px;
    color: #000;
    font-weight: 400;
}
.invoice-bottom {
    padding: 0 30px 0;
}
.row {
    display: flex;
}
.col-lg-6 {
    flex: 0 0 auto;
    width: 50%;
    padding: 20px;
}

.invoice-content {
font-family: 'Poppins', sans-serif;
color: #000;
font-size: 14px;
}
.container {
max-width: 1000px;
margin: 0 auto;
}
.col-md-8 {
    flex: 0 0 auto;
    width: 66.66666667%;
}
.col-md-4 {
    flex: 0 0 auto;
    width: 33.33333333%;
}
</style>
