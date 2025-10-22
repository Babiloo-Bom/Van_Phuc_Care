import Vue from 'vue';
import Card from '@/components/shared/Card.vue';
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
import CurrencyInput from '@/components/shared/CurrencyInput.vue';
import DatePicker from '@/components/shared/DatePicker.vue';
import Pagination from '@/components/shared/Pagination.vue';
import PageHeader from '@/components/shared/PageHeader.vue';
import ImageUpload from '@/components/shared/upload/Image.vue';
import FileUpload from '@/components/shared/upload/File.vue';

const components = [{
    name: 'ct-card',
    component: Card,
}, {
    name: 'ct-confirm-dialog',
    component: ConfirmDialog,
}, {
    name: 'ct-currency-input',
    component: CurrencyInput,
}, {
    name: 'ct-date-picker',
    component: DatePicker,
}, {
    name: 'ct-pagination',
    component: Pagination,
}, {
    name: 'ct-page-header',
    component: PageHeader,
}, {
    name: 'ct-image-upload',
    component: ImageUpload,
}, {
    name: 'ct-file-upload',
    component: FileUpload,
}];

components.forEach(({ name, component }) => {
    Vue.component(name, component);
});
