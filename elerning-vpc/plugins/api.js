import Auth from '@/api/auth';
import Feedbacks from '@/api/feedbacks';
import Contacts from '@/api/contacts';
import Courses from '@/api/courses';
import Medias from '@/api/medias';
import Surveys from '@/api/surveys';
import Faqs from '@/api/faqs';
import Carts from '@/api/carts';
import Consultations from '@/api/consultations';
import Posts from '@/api/posts';
import PostCategories from '@/api/posts/categories';
import Recruitments from '@/api/recruitments';
import Analystics from '@/api/analystics';
import RecruitmentCategories from '@/api/recruitments/categories';
import RecruitmentApplications from '@/api/recruitments/applications';
import Uploaders from '@/api/uploaders';
import Payment from '@/api/payments';
import Exercise from '@/api/exercises';
import Transactions from '@/api/transactions';

export default (context, inject) => {
    const factories = {
        auth: Auth(context.$axios),
        uploaders: Uploaders(context.$axios),
        feedbacks: Feedbacks(context.$axios),
        contacts: Contacts(context.$axios),
        courses: Courses(context.$axios),
        medias: Medias(context.$axios),
        surveys: Surveys(context.$axios),
        faqs: Faqs(context.$axios),
        carts: Carts(context.$axios),
        consultations: Consultations(context.$axios),
        posts: Posts(context.$axios),
        analystics: Analystics(context.$axios),
        recruitments: Recruitments(context.$axios),
        postCategories: PostCategories(context.$axios),
        recruitmentCategories: RecruitmentCategories(context.$axios),
        recruitmentApplications: RecruitmentApplications(context.$axios),
        uploader: Uploaders(context.$axios),
        payment: Payment(context.$axios),
        exercises: Exercise(context.$axios),
        transactions: Transactions(context.$axios),
    };

    inject('api', factories);
};
