import cron from 'node-cron';
import CloudflareService from '@services/cloudflare';

/**
 * Scheduled Job để kiểm tra và đảm bảo R2 Lifecycle Rule luôn được thiết lập
 * Chạy mỗi ngày 1 lần vào lúc 2:00 AM
 */
class R2LifecycleRuleJob {
  private readonly DAYS_AFTER_INITIATION = 1; // Xóa incomplete uploads sau 1 ngày
  private cronJob: cron.ScheduledTask | null = null;

  constructor() {
    this.start();
  }

  /**
   * Khởi động scheduled job
   * Chạy mỗi ngày lúc 2:00 AM
   */
  public start(): void {
    // Cron expression: "0 2 * * *" = Mỗi ngày lúc 2:00 AM
    this.cronJob = cron.schedule('0 2 * * *', async () => {
      console.log('🔄 [R2 Lifecycle Job] Bắt đầu kiểm tra lifecycle rule...');
      await this.checkAndSetupLifecycleRule();
    }, {
      scheduled: true,
      timezone: 'Asia/Ho_Chi_Minh'
    });

    console.log('✅ [R2 Lifecycle Job] Scheduled job đã được khởi động: Kiểm tra lifecycle rule mỗi ngày lúc 2:00 AM');
  }

  /**
   * Dừng scheduled job
   */
  public stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('⏹️ [R2 Lifecycle Job] Scheduled job đã được dừng');
    }
  }

  /**
   * Kiểm tra và thiết lập lifecycle rule nếu cần
   */
  private async checkAndSetupLifecycleRule(): Promise<void> {
    try {
      // Kiểm tra lifecycle rule hiện tại
      const currentRules = await CloudflareService.getLifecycleRules();
      
      // Nếu getLifecycleRules() return null (không có quyền hoặc chưa có rules), skip
      if (!currentRules) {
        console.log('ℹ️ [R2 Lifecycle Job] Không thể kiểm tra lifecycle rules (không có quyền hoặc chưa có rules). Bỏ qua.');
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
          console.log(`✅ [R2 Lifecycle Job] Lifecycle rule đã được thiết lập: Xóa incomplete uploads sau ${days} ngày`);
          return;
        }
      }

      // Nếu chưa có rule, thử thiết lập mới (có thể sẽ fail nếu không có quyền)
      console.log('🔄 [R2 Lifecycle Job] Lifecycle rule chưa được thiết lập, đang thiết lập...');
      await CloudflareService.setupLifecycleRule(this.DAYS_AFTER_INITIATION);
      console.log(`✅ [R2 Lifecycle Job] Lifecycle rule đã được thiết lập: Xóa incomplete multipart uploads sau ${this.DAYS_AFTER_INITIATION} ngày`);
    } catch (error: any) {
      // Nếu là AccessDenied, chỉ log warning (không quan trọng)
      if (error.Code === 'AccessDenied' || error.name === 'AccessDenied' || error.message?.includes('Access Denied')) {
        console.warn('⚠️ [R2 Lifecycle Job] Access Denied - Không có quyền quản lý lifecycle rules. Có thể bỏ qua.');
        return;
      }
      
      console.warn('⚠️ [R2 Lifecycle Job] Lỗi khi kiểm tra/thiết lập lifecycle rule (non-critical):', error.message);
    }
  }
}

// Export instance để tự động chạy khi import
export default new R2LifecycleRuleJob();

