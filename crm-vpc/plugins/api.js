import Auth from '@/api/auth';
import Courses from '@/api/courses';
import Services from '@/api/services';
import Transactions from '@/api/transactions';
import Informations from '@/api/informations';
import Faqs from '@/api/faqs';
import Feedbacks from '@/api/feedbacks';
import Tickets from '@/api/tickets';
import Uploaders from '@/api/uploaders';

export default (context, inject) => {
    const factories = {
        auth: Auth(context.$axios),
        courses: Courses(context.$axios),
        services: Services(context.$axios),
        transactions: Transactions(context.$axios),
        informations: Informations(context.$axios),
        faqs: Faqs(context.$axios),
        feedbacks: Feedbacks(context.$axios),
        tickets: Tickets(context.$axios),
        uploader: Uploaders(context.$axios),
    };

    inject('api', factories);
};
