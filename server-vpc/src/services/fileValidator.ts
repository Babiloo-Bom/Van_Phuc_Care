/**
 * File Validator Service
 * Kiểm tra Magic Bytes (File Header) để xác định loại file thực tế
 * Ngăn chặn file độc hại đổi đuôi
 */

// Magic bytes signatures cho các loại file phổ biến
const MAGIC_BYTES: { [key: string]: Array<{ signature: number[]; offset?: number }> } = {
  // Images
  'image/jpeg': [{ signature: [0xFF, 0xD8, 0xFF] }],
  'image/png': [{ signature: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }],
  'image/gif': [
    { signature: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] }, // GIF87a
    { signature: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] }, // GIF89a
  ],
  'image/webp': [{ signature: [0x52, 0x49, 0x46, 0x46], offset: 0 }, { signature: [0x57, 0x45, 0x42, 0x50], offset: 8 }],
  'image/bmp': [{ signature: [0x42, 0x4D] }],
  'image/svg+xml': [{ signature: [0x3C, 0x3F, 0x78, 0x6D, 0x6C] }, { signature: [0x3C, 0x73, 0x76, 0x67] }],

  // Videos
  // MP4 and QuickTime (MOV) share the same ISO base media file format
  // They can have the same magic bytes (ftyp box), so we need to accept both
  'video/mp4': [
    { signature: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32] }, // MP4 variant 1
    { signature: [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D] }, // MP4 variant 2 (ISO)
    { signature: [0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32] }, // MP4 variant 3
    { signature: [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70] }, // MP4 variant 4 (generic)
    { signature: [0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20] }, // QuickTime compatible
    { signature: [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20] }, // QuickTime compatible
  ],
  'video/quicktime': [
    { signature: [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x71, 0x74, 0x20, 0x20] }, // MOV (QuickTime)
    { signature: [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32] }, // MP4 compatible
    { signature: [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D] }, // MP4 compatible (ISO)
    { signature: [0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x6D, 0x70, 0x34, 0x32] }, // MP4 compatible
    { signature: [0x00, 0x00, 0x00, 0x14, 0x66, 0x74, 0x79, 0x70] }, // Generic ISO base media
  ],
  'video/x-msvideo': [{ signature: [0x52, 0x49, 0x46, 0x46] }], // AVI
  'video/x-matroska': [{ signature: [0x1A, 0x45, 0xDF, 0xA3] }], // MKV
  'video/webm': [{ signature: [0x1A, 0x45, 0xDF, 0xA3] }], // WebM (same as MKV, check further)
  'video/mpeg': [{ signature: [0x00, 0x00, 0x01, 0xBA] }, { signature: [0x00, 0x00, 0x01, 0xB3] }], // MPEG

  // Documents
  'application/pdf': [{ signature: [0x25, 0x50, 0x44, 0x46] }], // %PDF
  'application/msword': [{ signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1] }], // DOC (old format)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    { signature: [0x50, 0x4B, 0x03, 0x04] }, // DOCX (ZIP-based)
  ],
  'application/vnd.ms-excel': [{ signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1] }], // XLS (old format)
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    { signature: [0x50, 0x4B, 0x03, 0x04] }, // XLSX (ZIP-based)
  ],
  'application/vnd.ms-powerpoint': [{ signature: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1] }], // PPT (old format)
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': [
    { signature: [0x50, 0x4B, 0x03, 0x04] }, // PPTX (ZIP-based)
  ],

  // Archives
  'application/zip': [{ signature: [0x50, 0x4B, 0x03, 0x04] }],
  'application/x-rar-compressed': [
    { signature: [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00] }, // RAR v1.5+
    { signature: [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x01, 0x00] }, // RAR v5.0+
  ],
  'application/x-7z-compressed': [{ signature: [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C] }],
  'application/gzip': [{ signature: [0x1F, 0x8B] }],

  // Audio
  'audio/mpeg': [{ signature: [0xFF, 0xFB] }, { signature: [0xFF, 0xF3] }, { signature: [0xFF, 0xF2] }],
  'audio/wav': [{ signature: [0x52, 0x49, 0x46, 0x46] }],
  'audio/ogg': [{ signature: [0x4F, 0x67, 0x67, 0x53] }],

  // Text/Code
  'text/plain': [], // Plain text không có magic bytes cố định
  'text/html': [{ signature: [0x3C, 0x21, 0x44, 0x4F, 0x43, 0x54, 0x59, 0x50, 0x45] }], // <!DOCTYPE
  'application/json': [], // JSON không có magic bytes cố định

  // HLS
  'application/vnd.apple.mpegurl': [{ signature: [0x23, 0x45, 0x58, 0x54, 0x4D, 0x33, 0x55] }], // #EXTM3U
  'video/mp2t': [{ signature: [0x47] }], // MPEG-TS (starts with 0x47)
};

/**
 * Kiểm tra magic bytes của file buffer
 * @param buffer File buffer
 * @param expectedMimeType MIME type mong đợi (từ mimetype hoặc extension)
 * @returns { isValid: boolean, detectedType?: string, error?: string }
 */
export function validateFileByMagicBytes(
  buffer: Buffer,
  expectedMimeType: string
): { isValid: boolean; detectedType?: string; error?: string } {
  if (!buffer || buffer.length === 0) {
    return { isValid: false, error: 'File buffer is empty' };
  }

  // Lấy danh sách magic bytes cho MIME type mong đợi
  const expectedSignatures = MAGIC_BYTES[expectedMimeType];
  
  // Nếu không có magic bytes định nghĩa cho loại file này, bỏ qua kiểm tra
  // (ví dụ: text/plain, application/json)
  if (!expectedSignatures || expectedSignatures.length === 0) {
    // Cho phép các file không có magic bytes cố định
    return { isValid: true, detectedType: expectedMimeType };
  }

  // Kiểm tra từng signature
  for (const sigConfig of expectedSignatures) {
    const { signature, offset = 0 } = sigConfig;
    
    // Kiểm tra buffer đủ dài
    if (buffer.length < offset + signature.length) {
      continue;
    }

    // So sánh magic bytes
    let matches = true;
    for (let i = 0; i < signature.length; i++) {
      if (buffer[offset + i] !== signature[i]) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return { isValid: true, detectedType: expectedMimeType };
    }
  }

  // Nếu không khớp với expected type, thử tìm type thực tế
  const detectedType = detectFileTypeByMagicBytes(buffer);
  
  if (detectedType) {
    // Kiểm tra nếu là video container formats tương thích
    // MP4 và QuickTime (MOV) có thể có cùng magic bytes
    const compatibleVideoTypes = [
      ['video/mp4', 'video/quicktime'],
      ['video/quicktime', 'video/mp4'],
    ];
    
    for (const [type1, type2] of compatibleVideoTypes) {
      if ((expectedMimeType === type1 && detectedType === type2) ||
          (expectedMimeType === type2 && detectedType === type1)) {
        // Cho phép vì chúng là container formats tương thích
        return { isValid: true, detectedType: expectedMimeType };
      }
    }
    
    return {
      isValid: false,
      detectedType,
      error: `File type mismatch: Expected ${expectedMimeType}, but detected ${detectedType} (possible file extension spoofing)`,
    };
  }

  // Không thể xác định loại file
  return {
    isValid: false,
    error: `File type validation failed: Cannot verify file type for ${expectedMimeType}`,
  };
}

/**
 * Phát hiện loại file dựa trên magic bytes
 * @param buffer File buffer
 * @returns MIME type được phát hiện hoặc null
 */
export function detectFileTypeByMagicBytes(buffer: Buffer): string | null {
  if (!buffer || buffer.length === 0) {
    return null;
  }

  // Duyệt qua tất cả các loại file đã định nghĩa
  for (const [mimeType, signatures] of Object.entries(MAGIC_BYTES)) {
    for (const sigConfig of signatures) {
      const { signature, offset = 0 } = sigConfig;
      
      if (buffer.length < offset + signature.length) {
        continue;
      }

      let matches = true;
      for (let i = 0; i < signature.length; i++) {
        if (buffer[offset + i] !== signature[i]) {
          matches = false;
          break;
        }
      }

      if (matches) {
        return mimeType;
      }
    }
  }

  return null;
}

/**
 * Kiểm tra file có phải là video hợp lệ không
 * @param buffer File buffer
 * @param expectedMimeType MIME type mong đợi
 */
export function validateVideoFile(
  buffer: Buffer,
  expectedMimeType: string
): { isValid: boolean; detectedType?: string; error?: string } {
  if (!expectedMimeType.startsWith('video/')) {
    return { isValid: false, error: 'Expected MIME type must be a video type' };
  }

  const result = validateFileByMagicBytes(buffer, expectedMimeType);
  
  // Nếu validation thành công, trả về kết quả
  if (result.isValid) {
    return result;
  }
  
  // Nếu validation thất bại, kiểm tra xem có phải là video container format tương thích không
  if (result.detectedType) {
    const compatibleVideoTypes = [
      ['video/mp4', 'video/quicktime'],
      ['video/quicktime', 'video/mp4'],
    ];
    
    for (const [type1, type2] of compatibleVideoTypes) {
      if ((expectedMimeType === type1 && result.detectedType === type2) ||
          (expectedMimeType === type2 && result.detectedType === type1)) {
        // Cho phép vì chúng là container formats tương thích
        console.log(`✅ [Video Validation] Allowing compatible video types: ${expectedMimeType} <-> ${result.detectedType}`);
        return { isValid: true, detectedType: expectedMimeType };
      }
    }
  }
  
  // Nếu không detect được type nhưng file có vẻ là video (có magic bytes của video nhưng không match chính xác)
  // Kiểm tra xem có phải là MP4/MOV không bằng cách tìm ftyp box
  if (buffer.length >= 12) {
    // MP4/MOV files thường bắt đầu với ftyp box
    // Check for ftyp at various offsets
    const ftypPatterns = [
      [0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], // Common MP4/MOV pattern
      [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70], // Another common pattern
      [0x00, 0x00, 0x00, 0x1C, 0x66, 0x74, 0x79, 0x70], // Another variant
    ];
    
    for (const pattern of ftypPatterns) {
      let matches = true;
      for (let i = 0; i < pattern.length; i++) {
        if (buffer[i] !== pattern[i]) {
          matches = false;
          break;
        }
      }
      
      if (matches && (expectedMimeType === 'video/mp4' || expectedMimeType === 'video/quicktime')) {
        console.log(`✅ [Video Validation] Detected MP4/MOV format by ftyp box, allowing ${expectedMimeType}`);
        return { isValid: true, detectedType: expectedMimeType };
      }
    }
  }
  
  // Nếu vẫn không match, trả về lỗi
  console.warn(`⚠️ [Video Validation] Failed to validate video file. Expected: ${expectedMimeType}, Detected: ${result.detectedType || 'unknown'}`);
  return result;
}

/**
 * Kiểm tra file có phải là image hợp lệ không
 * @param buffer File buffer
 * @param expectedMimeType MIME type mong đợi
 */
export function validateImageFile(
  buffer: Buffer,
  expectedMimeType: string
): { isValid: boolean; detectedType?: string; error?: string } {
  if (!expectedMimeType.startsWith('image/')) {
    return { isValid: false, error: 'Expected MIME type must be an image type' };
  }

  return validateFileByMagicBytes(buffer, expectedMimeType);
}

/**
 * Kiểm tra file có phải là document hợp lệ không
 * @param buffer File buffer
 * @param expectedMimeType MIME type mong đợi
 */
export function validateDocumentFile(
  buffer: Buffer,
  expectedMimeType: string
): { isValid: boolean; detectedType?: string; error?: string } {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

  if (!documentTypes.includes(expectedMimeType)) {
    return { isValid: false, error: 'Expected MIME type must be a document type' };
  }

  return validateFileByMagicBytes(buffer, expectedMimeType);
}

export default {
  validateFileByMagicBytes,
  detectFileTypeByMagicBytes,
  validateVideoFile,
  validateImageFile,
  validateDocumentFile,
};

