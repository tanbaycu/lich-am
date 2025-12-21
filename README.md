# Lịch Âm New Tab Extension

Cảm ơn bạn đã quan tâm đến dự án **Lịch Âm New Tab**! 🎉

Đây là một Chrome Extension giúp thay thế trang New Tab mặc định bằng một giao diện hiện đại, đậm chất Việt Nam.

![Screenshot](screenshot.png)

## Tính năng nổi bật

- 🌕 **Lịch Âm Dương**: Xem ngày giờ dương lịch và âm lịch chi tiết ngay trên màn hình chính.
- 🌤️ **Thời tiết**: Cập nhật thông tin thời tiết địa phương theo thời gian thực (Nhiệt độ, độ ẩm, sức gió...).
- 🧘 **Zen Mode**: Chế độ tập trung, ẩn bớt các thành phần không cần thiết.
- 🔗 **Lối tắt**: Truy cập nhanh các trang web phổ biến (Facebook, Youtube, Gmail...).
- 🖼️ **Hình nền đẹp**: Tự động hiển thị hình nền chất lượng cao từ Unsplash.

## 🚀 Prodomo Focus System (New v2.0)

Hệ thống tập trung **Prodomo** đã được nâng cấp toàn diện giúp bạn quản lý năng lượng và công việc hiệu quả hơn:

### 📸 Giao diện Prodomo

| Timer                                  | Stats                                  |
| -------------------------------------- | -------------------------------------- |
| ![Timer](public/screenshots/timer.png) | ![Stats](public/screenshots/stats.png) |

| Tasks                                  | Studio                                   |
| -------------------------------------- | ---------------------------------------- |
| ![Tasks](public/screenshots/tasks.png) | ![Studio](public/screenshots/studio.png) |

### ✨ Tính năng chính

- ⏱️ **Focus Timer**: Đồng hồ Pomodoro tùy chỉnh, giao diện Minimalist.
- 🎨 **Studio**: Tùy chỉnh không gian làm việc với âm thanh (Soundscapes) và hình nền động (Visual Theme).
- 📊 **Analytics**: Theo dõi biểu đồ tập trung, streak hàng ngày và lịch sử làm việc.
- ✅ **Task Master**: Quản lý Todolist tích hợp ngay trong phiên làm việc.

### 🌟 Credits

- **Backgrounds**: Hiệu ứng nền tuyệt đẹp được cung cấp bởi [ReactBits](https://reactbits.dev/).
- **Icons**: Lucide React.

## Hướng dẫn cài đặt (Developer Mode)

1. Clone repo này về máy: `git clone https://github.com/tanbaycu/lich-am.git`
2. Tạo file `.env` từ file mẫu:
   - Copy file `.env.example` thành `.env`.
   - Điền API Key OpenWeatherMap của bạn vào dòng `VITE_OPENWEATHER_API_KEY=...`.
3. Cài đặt thư viện: `npm install`
4. Build dự án: `npm run build`
5. Cài vào Chrome:
   - Mở `chrome://extensions`.
   - Bật **Developer mode** (Góc phải trên).
   - Chọn **Load unpacked** -> trỏ tới thư mục `dist` vừa build.

## Tech Stack

- **Core**: React 18, TypeScript, Vite.
- **Styling**: TailwindCSS.
- **Libs**: `lunar-date-vn` (Lịch âm), `date-fns`, `axios`.

---

_Dự án được phát triển bởi [tanbaycu](https://github.com/tanbaycu)._

### Special Thanks

- [codoidieu](https://github.com/codoidieu) - Contributor
