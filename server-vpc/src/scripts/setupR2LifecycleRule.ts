/**
 * Script để thiết lập Lifecycle Rule cho Cloudflare R2
 * Tự động xóa incomplete multipart uploads sau 1 ngày
 * 
 * Chạy script: npx ts-node src/scripts/setupR2LifecycleRule.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import CloudflareService from '../services/cloudflare';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function setupLifecycleRule() {
  try {
    console.log('🚀 Bắt đầu thiết lập Lifecycle Rule cho Cloudflare R2...');
    
    // Kiểm tra lifecycle rules hiện tại
    const currentRules = await CloudflareService.getLifecycleRules();
    if (currentRules && currentRules.Rules && currentRules.Rules.length > 0) {
      console.log('ℹ️ Lifecycle rules hiện tại:');
      currentRules.Rules.forEach((rule: any) => {
        console.log(`  - ${rule.ID}: ${rule.Status}`);
        if (rule.AbortIncompleteMultipartUpload) {
          console.log(`    Abort incomplete uploads sau: ${rule.AbortIncompleteMultipartUpload.DaysAfterInitiation} ngày`);
        }
      });
    } else {
      console.log('ℹ️ Chưa có lifecycle rules nào được thiết lập');
    }
    
    // Thiết lập lifecycle rule: xóa incomplete uploads sau 1 ngày
    await CloudflareService.setupLifecycleRule(1);
    
    console.log('✅ Hoàn thành! Lifecycle rule đã được thiết lập thành công.');
    console.log('📋 Rule: Tự động xóa incomplete multipart uploads sau 1 ngày');
    
  } catch (error: any) {
    console.error('❌ Lỗi khi thiết lập lifecycle rule:', error.message);
    process.exit(1);
  }
}

// Chạy script
setupLifecycleRule()
  .then(() => {
    console.log('✨ Script hoàn thành');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script thất bại:', error);
    process.exit(1);
  });

