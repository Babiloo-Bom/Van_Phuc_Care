/**
 * Script để xóa toàn bộ dữ liệu test trong MongoDB
 * Giữ lại user admin có email: admin@gmail.com
 * 
 * Cách chạy:
 * 1. Kết nối vào MongoDB container: docker exec -it vpc-mongodb mongosh
 * 2. Chuyển sang database: use vanphuccare
 * 3. Copy và paste toàn bộ script này vào mongosh
 * 
 * HOẶC chạy từ file:
 * docker exec -i vpc-mongodb mongosh < scripts/cleanup-database.js
 */

// Chuyển sang database vanphuccare
use('vanphuccare');

print('🚀 Bắt đầu cleanup database...\n');

// 1. Xóa tất cả users (trừ admin@gmail.com)
print('📝 Xóa users (giữ lại admin@gmail.com)...');
const adminUser = db.users.findOne({ email: 'admin@gmail.com' });
if (adminUser) {
  const adminId = adminUser._id;
  const deletedUsers = db.users.deleteMany({ 
    email: { $ne: 'admin@gmail.com' } 
  });
  print(`   ✅ Đã xóa ${deletedUsers.deletedCount} users (giữ lại admin)`);
} else {
  print('   ⚠️  Không tìm thấy admin@gmail.com, xóa tất cả users...');
  db.users.deleteMany({});
  print('   ✅ Đã xóa tất cả users');
}

// 2. Xóa tất cả courses
print('\n📚 Xóa tất cả courses...');
const deletedCourses = db.courses.deleteMany({});
print(`   ✅ Đã xóa ${deletedCourses.deletedCount} courses`);

// 3. Xóa tất cả chapters
print('\n📖 Xóa tất cả chapters...');
const deletedChapters = db.chapters.deleteMany({});
print(`   ✅ Đã xóa ${deletedChapters.deletedCount} chapters`);

// 4. Xóa tất cả lessons
print('\n📄 Xóa tất cả lessons...');
const deletedLessons = db.lessons.deleteMany({});
print(`   ✅ Đã xóa ${deletedLessons.deletedCount} lessons`);

// 5. Xóa tất cả quizzes
print('\n❓ Xóa tất cả quizzes...');
const deletedQuizzes = db.quizzes.deleteMany({});
print(`   ✅ Đã xóa ${deletedQuizzes.deletedCount} quizzes`);

// 6. Xóa tất cả quiz attempts
print('\n📊 Xóa tất cả quiz attempts...');
const deletedQuizAttempts = db.quizattempts.deleteMany({});
print(`   ✅ Đã xóa ${deletedQuizAttempts.deletedCount} quiz attempts`);

// 7. Xóa tất cả orders
print('\n🛒 Xóa tất cả orders...');
const deletedOrders = db.orders.deleteMany({});
print(`   ✅ Đã xóa ${deletedOrders.deletedCount} orders`);

// 8. Xóa tất cả transactions
print('\n💳 Xóa tất cả transactions...');
const deletedTransactions = db.transactions.deleteMany({});
print(`   ✅ Đã xóa ${deletedTransactions.deletedCount} transactions`);

// 9. Xóa tất cả carts
print('\n🛍️  Xóa tất cả carts...');
const deletedCarts = db.carts.deleteMany({});
print(`   ✅ Đã xóa ${deletedCarts.deletedCount} carts`);

// 10. Xóa tất cả ratings/reviews
print('\n⭐ Xóa tất cả ratings...');
const deletedRatings = db.ratings.deleteMany({});
print(`   ✅ Đã xóa ${deletedRatings.deletedCount} ratings`);

// 11. Xóa tất cả course reviews
print('\n📝 Xóa tất cả course reviews...');
const deletedCourseReviews = db.coursereviews.deleteMany({});
print(`   ✅ Đã xóa ${deletedCourseReviews.deletedCount} course reviews`);

// 12. Xóa tất cả customers
print('\n👥 Xóa tất cả customers...');
const deletedCustomers = db.customers.deleteMany({});
print(`   ✅ Đã xóa ${deletedCustomers.deletedCount} customers`);

// 13. Xóa tất cả tickets
print('\n🎫 Xóa tất cả tickets...');
const deletedTickets = db.tickets.deleteMany({});
print(`   ✅ Đã xóa ${deletedTickets.deletedCount} tickets`);

// 14. Xóa tất cả ticket comments
print('\n💬 Xóa tất cả ticket comments...');
const deletedTicketComments = db.ticketcomments.deleteMany({});
print(`   ✅ Đã xóa ${deletedTicketComments.deletedCount} ticket comments`);

// 15. Xóa tất cả service registrations
print('\n🏥 Xóa tất cả service registrations...');
const deletedServiceRegistrations = db.serviceregistrations.deleteMany({});
print(`   ✅ Đã xóa ${deletedServiceRegistrations.deletedCount} service registrations`);

// 16. Xóa tất cả health books
print('\n📋 Xóa tất cả health books...');
const deletedHealthBooks = db.healthbooks.deleteMany({});
print(`   ✅ Đã xóa ${deletedHealthBooks.deletedCount} health books`);

// 17. Xóa tất cả health records
print('\n📋 Xóa tất cả health records...');
const deletedHealthRecords = db.healthrecords.deleteMany({});
print(`   ✅ Đã xóa ${deletedHealthRecords.deletedCount} health records`);

// 18. Xóa tất cả vaccination records
print('\n💉 Xóa tất cả vaccination records...');
const deletedVaccinationRecords = db.vaccinationrecords.deleteMany({});
print(`   ✅ Đã xóa ${deletedVaccinationRecords.deletedCount} vaccination records`);

// 19. Xóa tất cả schedule vaccins
print('\n📅 Xóa tất cả schedule vaccins...');
const deletedScheduleVaccins = db.schedulevaccins.deleteMany({});
print(`   ✅ Đã xóa ${deletedScheduleVaccins.deletedCount} schedule vaccins`);

// 20. Xóa tất cả products
print('\n🛍️  Xóa tất cả products...');
const deletedProducts = db.products.deleteMany({});
print(`   ✅ Đã xóa ${deletedProducts.deletedCount} products`);

// 21. Xóa tất cả product reviews
print('\n⭐ Xóa tất cả product reviews...');
const deletedProductReviews = db.productreviews.deleteMany({});
print(`   ✅ Đã xóa ${deletedProductReviews.deletedCount} product reviews`);

// 22. Xóa tất cả product collections
print('\n📦 Xóa tất cả product collections...');
const deletedProductCollections = db.productcollections.deleteMany({});
print(`   ✅ Đã xóa ${deletedProductCollections.deletedCount} product collections`);

// 23. Xóa tất cả processings (video processing jobs)
print('\n🎬 Xóa tất cả processings...');
const deletedProcessings = db.processings.deleteMany({});
print(`   ✅ Đã xóa ${deletedProcessings.deletedCount} processings`);

// 24. Xóa tất cả documents
print('\n📄 Xóa tất cả documents...');
const deletedDocuments = db.documents.deleteMany({});
print(`   ✅ Đã xóa ${deletedDocuments.deletedCount} documents`);

// 25. Xóa tất cả medias
print('\n🎞️  Xóa tất cả medias...');
const deletedMedias = db.medias.deleteMany({});
print(`   ✅ Đã xóa ${deletedMedias.deletedCount} medias`);

// 26. Xóa tất cả banners
print('\n🖼️  Xóa tất cả banners...');
const deletedBanners = db.banners.deleteMany({});
print(`   ✅ Đã xóa ${deletedBanners.deletedCount} banners`);

// 27. Xóa tất cả FAQs
print('\n❓ Xóa tất cả FAQs...');
const deletedFAQs = db.faqs.deleteMany({});
print(`   ✅ Đã xóa ${deletedFAQs.deletedCount} FAQs`);

// 28. Xóa tất cả feedbacks
print('\n💭 Xóa tất cả feedbacks...');
const deletedFeedbacks = db.feedbacks.deleteMany({});
print(`   ✅ Đã xóa ${deletedFeedbacks.deletedCount} feedbacks`);

// 29. Xóa tất cả news
print('\n📰 Xóa tất cả news...');
const deletedNews = db.news.deleteMany({});
print(`   ✅ Đã xóa ${deletedNews.deletedCount} news`);

// 30. Xóa tất cả categories
print('\n📂 Xóa tất cả categories...');
const deletedCategories = db.categories.deleteMany({});
print(`   ✅ Đã xóa ${deletedCategories.deletedCount} categories`);

// 31. Xóa tất cả modules
print('\n📦 Xóa tất cả modules...');
const deletedModules = db.modules.deleteMany({});
print(`   ✅ Đã xóa ${deletedModules.deletedCount} modules`);

// 32. Xóa tất cả services
print('\n🏥 Xóa tất cả services...');
const deletedServices = db.services.deleteMany({});
print(`   ✅ Đã xóa ${deletedServices.deletedCount} services`);

// 33. Xóa tất cả exercises
print('\n📝 Xóa tất cả exercises...');
const deletedExercises = db.exercises.deleteMany({});
print(`   ✅ Đã xóa ${deletedExercises.deletedCount} exercises`);

// 34. Xóa tất cả admins (trừ admin@gmail.com)
print('\n👤 Xóa tất cả admins (giữ lại admin@gmail.com)...');
if (adminUser) {
  const deletedAdmins = db.admins.deleteMany({ 
    email: { $ne: 'admin@gmail.com' } 
  });
  print(`   ✅ Đã xóa ${deletedAdmins.deletedCount} admins (giữ lại admin)`);
} else {
  print('   ⚠️  Không tìm thấy admin@gmail.com trong admins collection');
}

// 35. Xóa tất cả access permissions
print('\n🔐 Xóa tất cả access permissions...');
const deletedPermissions = db.accesspermissions.deleteMany({});
print(`   ✅ Đã xóa ${deletedPermissions.deletedCount} access permissions`);

print('\n✅ Hoàn thành cleanup database!');
print('\n📊 Tóm tắt:');
print('   - Giữ lại: admin@gmail.com (users và admins)');
print('   - Đã xóa: Tất cả dữ liệu test khác');

