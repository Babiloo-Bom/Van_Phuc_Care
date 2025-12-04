# UI Updates Summary - CRM Auth Pages

## ✅ Login Page (Completed)
- Logo: Updated to use logo-vanphuc-new.png (desktop) and logo-vanphuc-new-mobile.png (mobile)
- Added main-title "Đăng nhập" and subtitle "Chào mừng bạn đến với Vạn Phúc Care"
- Logo size: 149.71px x 70.48px
- Title styling: 24px/32px, font-weight 700
- Subtitle styling: 14px/24px, font-weight 500, color #4A4A4A

## 📝 Register Page (To Update)
Template changes needed:
```vue
<div class="logo-section">
  <img src="/images/logo-vanphuc-new-mobile.png" alt="Van Phuc Care" class="lg:hidden logo" />
  <img src="/images/logo-vanphuc-new.png" alt="Van Phuc Care" class="hidden lg:block logo" />
</div>

<div class="title-section">
  <h1 class="main-title">Đăng ký</h1>
  <p class="subtitle">Tạo mới tài khoản chỉ cần 30 giây!</p>
</div>
```

## 📝 Forgot Password Page (Already Updated)
- Already using correct layout with SuccessModal
- Marketing section with circles and dragon banner
- Responsive design

## 📝 Reset Password Page (To Create)
Need full template from elerning with:
- Password toggle SVG icons
- Form validation
- SuccessModal
- Marketing section

## 🖼️ Images Needed
Copy from elerning to CRM:
1. `/public/images/logo-vanphuc-new.png` (desktop logo)
2. `/public/images/logo-vanphuc-new-mobile.png` (mobile logo)

Current CRM uses: `/public/images/logo_van_phuc.png` (different logo)
