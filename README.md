# E‑Learning (React Native + Expo)

- تطبيق تعليم إلكتروني مختصر.
- التثبيت: `npm install`
- التشغيل: `npm run android` أو `npm run ios` أو `npm run web`
- الإعداد: عدّل `src/config.js` وضع `API_BASE_URL`؛ إن تُرك فارغاً يُستخدم Mock API.
- أهم المجلدات: `src/components`, `src/screens`, `src/store`, `src/services`.
- التوجيه مبني على **Expo Router** (مجلد `app/`). كل شاشة تمت إعادة ترتيبها إلى مجموعات واضحة (auth، drawer، tabs) مع الحفاظ على أسماء المسارات القديمة لضمان عمل جميع الأزرار والروابط.

