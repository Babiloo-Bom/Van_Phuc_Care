import Auth from '@/api/auth';
import Automations from '@/api/marketings/automations';
import Analystics from '@/api/analystics';
import BusinessAreasConfirms from '@/api/businessAreas/confirm';
import Contacts from '@/api/contacts';
import Courses from '@/api/courses';
import Consultations from '@/api/consultations';
import Contracts from '@/api/contracts';
import Customers from '@/api/customers/index';
import CustomerSegments from '@/api/customers/segments';
import Comments from '@/api/comments';
import Documents from '@/api/documents';
import Feedbacks from '@/api/feedbacks';
import Menus from '@/api/menus';
import Pages from '@/api/pages';
import Transactions from '@/api/transactions';
import AccessPermissions from '@/api/access-permissions';
import Medias from '@/api/medias';
import Specialists from '@/api/specialists';
import Rules from '@/api/rules';
import Surveys from '@/api/surveys';
import Faqs from '@/api/faqs';
import Services from '@/api/services';
import Registers from '@/api/registers';
import Schedules from '@/api/schedules';
import HealthBooks from '@/api/health-books';
import Posts from '@/api/posts';
import PostCategories from '@/api/posts/categories';
import Notifications from '@/api/notifications';
import Uploaders from '@/api/uploaders';
import Emails from '@/api/marketings/emails';
import Tickets from '@/api/tickets';
import Settings from '@/api/settings/index';
import SettingContacts from '@/api/settings/contacts';
import SettingPayments from '@/api/settings/payments';
import SettingMembers from '@/api/settings/members';

export default (context, inject) => {
    const factories = {
        auth: Auth(context.$axios),
        uploaders: Uploaders(context.$axios),
        feedbacks: Feedbacks(context.$axios),
        contacts: Contacts(context.$axios),
        courses: Courses(context.$axios),
        contracts: Contracts(context.$axios),
        comments: Comments(context.$axios),
        menus: Menus(context.$axios),
        pages: Pages(context.$axios),
        businessAreaConfirms: BusinessAreasConfirms(context.$axios),
        transactions: Transactions(context.$axios),
        accessPermissions: AccessPermissions(context.$axios),
        medias: Medias(context.$axios),
        specialists: Specialists(context.$axios),
        rules: Rules(context.$axios),
        surveys: Surveys(context.$axios),
        faqs: Faqs(context.$axios),
        tickets: Tickets(context.$axios),
        services: Services(context.$axios),
        registers: Registers(context.$axios),
        schedules: Schedules(context.$axios),
        healthBooks: HealthBooks(context.$axios),
        consultations: Consultations(context.$axios),
        posts: Posts(context.$axios),
        notifications: Notifications(context.$axios),
        analystics: Analystics(context.$axios),
        customers: Customers(context.$axios),
        customerSegments: CustomerSegments(context.$axios),
        documents: Documents(context.$axios),
        automations: Automations(context.$axios),
        emails: Emails(context.$axios),
        postCategories: PostCategories(context.$axios),
        uploader: Uploaders(context.$axios),
        settings: Settings(context.$axios),
        settingContacts: SettingContacts(context.$axios),
        settingPayments: SettingPayments(context.$axios),
        settingMembers: SettingMembers(context.$axios),
    };

    inject('api', factories);
};
