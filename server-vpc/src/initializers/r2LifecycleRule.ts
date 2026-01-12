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
      
      // Nếu getLifecycleRules() return null (không có quyền hoặc chưa có rules), skip
      if (!currentRules) {
        console.log('ℹ️ [R2 Lifecycle] Không thể kiểm tra lifecycle rules (không có quyền hoặc chưa có rules). Bỏ qua.');
        return;
      }
      
      if (currentRules.Rules && currentRules.Rules.length > 0) {
        // Kiểm tra xem rule "Abort-Incomplete-Multipart-Uploads" đã tồn tại chưa
        const abortRule = currentRules.Rules.find(
          (rule: any) => 
            rule.ID === 'Abort-Incomplete-Multipart-Uploads' && 
            rule.Status === 'Enabled'
        );

        if (abortRule) {
          const days = abortRule.AbortIncompleteMultipartUpload?.DaysAfterInitiation;
          console.log(`✅ [R2 Lifecycle] Lifecycle rule đã được thiết lập: Xóa incomplete uploads sau ${days} ngày`);
          return;
        }
      }

      // Nếu chưa có rule, thử thiết lập mới (có thể sẽ fail nếu không có quyền)
      console.log('🔄 [R2 Lifecycle] Thiết lập R2 Lifecycle Rule...');
      try {
        await CloudflareService.setupLifecycleRule(this.DAYS_AFTER_INITIATION);
        console.log(`✅ [R2 Lifecycle] Lifecycle rule đã được thiết lập tự động: Xóa incomplete multipart uploads sau ${this.DAYS_AFTER_INITIATION} ngày`);
      } catch (setupError: any) {
        // Nếu setup fail do AccessDenied, log hướng dẫn nhưng không crash
        if (setupError.Code === 'AccessDenied' || setupError.name === 'AccessDenied' || setupError.message?.includes('Access Denied')) {
          console.warn('⚠️ [R2 Lifecycle] Không thể thiết lập lifecycle rule do thiếu quyền.');
          console.warn('   Vui lòng tạo R2 API Token mới với quyền "Bucket Configuration Read & Write"');
          return;
        }
        throw setupError; // Re-throw nếu là lỗi khác
      }
    } catch (error: any) {
      // Nếu là AccessDenied, chỉ log warning (không quan trọng)
      if (error.Code === 'AccessDenied' || error.name === 'AccessDenied' || error.message?.includes('Access Denied')) {
        console.warn('⚠️ [R2 Lifecycle] Access Denied - Không có quyền quản lý lifecycle rules. Có thể bỏ qua.');
        return;
      }
      
      // Log lỗi nhưng không throw để server vẫn có thể start
      console.warn('⚠️ [R2 Lifecycle] Không thể thiết lập R2 Lifecycle Rule (non-critical):', error.message);
      console.warn('   Bạn có thể thiết lập thủ công bằng cách:');
      console.warn('   1. Chạy script: npm run setup-r2-lifecycle');
      console.warn('   2. Hoặc qua API: POST /api/a/r2-lifecycle/setup');
    }
  }
}

// Export instance để tự động chạy khi import
export default new R2LifecycleRuleInitializer();

