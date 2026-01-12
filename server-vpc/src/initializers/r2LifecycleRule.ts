import CloudflareService from '@services/cloudflare';

/**
 * Initializer để tự động thiết lập Lifecycle Rule cho Cloudflare R2
 * Chạy khi server khởi động
 */
class R2LifecycleRuleInitializer {
  private readonly DAYS_AFTER_INITIATION = 1; // Xóa incomplete uploads sau 1 ngày

  constructor() {
    // Chạy async, không block server startup
    this.initialize().catch((error) => {
      console.error('❌ R2 Lifecycle Rule initialization error:', error);
      // Không throw error để server vẫn có thể start
    });
  }

  public async initialize(): Promise<void> {
    try {
      // Kiểm tra xem lifecycle rule đã được thiết lập chưa
      const currentRules = await CloudflareService.getLifecycleRules();
      
      if (currentRules && currentRules.Rules && currentRules.Rules.length > 0) {
        // Kiểm tra xem rule "Abort-Incomplete-Multipart-Uploads" đã tồn tại chưa
        const abortRule = currentRules.Rules.find(
          (rule: any) => 
            rule.ID === 'Abort-Incomplete-Multipart-Uploads' && 
            rule.Status === 'Enabled'
        );

        if (abortRule) {
          const days = abortRule.AbortIncompleteMultipartUpload?.DaysAfterInitiation;
          console.log(`✅ R2 Lifecycle Rule đã được thiết lập: Xóa incomplete uploads sau ${days} ngày`);
          return;
        }
      }

      // Nếu chưa có rule, thiết lập mới
      console.log('🔄 Thiết lập R2 Lifecycle Rule...');
      await CloudflareService.setupLifecycleRule(this.DAYS_AFTER_INITIATION);
      console.log(`✅ R2 Lifecycle Rule đã được thiết lập tự động: Xóa incomplete multipart uploads sau ${this.DAYS_AFTER_INITIATION} ngày`);
    } catch (error: any) {
      // Log lỗi nhưng không throw để server vẫn có thể start
      console.error('❌ Không thể thiết lập R2 Lifecycle Rule:', error.message);
      console.error('   Bạn có thể thiết lập thủ công bằng cách:');
      console.error('   1. Chạy script: npm run setup-r2-lifecycle');
      console.error('   2. Hoặc qua API: POST /api/a/r2-lifecycle/setup');
    }
  }
}

// Export instance để tự động chạy khi import
export default new R2LifecycleRuleInitializer();

