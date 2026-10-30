# Volkswagen Golden Urban Store - Car Sales Website

Website bán xe ô tô cao cấp dành cho đại lý **Volkswagen Golden Urban Store**, được xây dựng dựa trên giao diện, tính năng và cấu trúc của [volkswagengolden.vn](https://volkswagengolden.vn/).

## 🚀 Cách chạy ứng dụng

### 1. Môi trường phát triển (Development)
```bash
cd C:\Users\tnamit\Desktop\AI\volkswagengolden
npm run dev
```
Sau đó truy cập:
- **Trang bán hàng (khách xem)**: `http://localhost:5173/` (Hoàn toàn sạch sẽ, bảo mật, không hiện bất kỳ nút bấm admin nào cho khách).
- **Trang Quản Trị Độc Quyền**: `http://localhost:5173/admin`
  - **Tài khoản**: `admin` hoặc `nam123`
  - **Mật khẩu**: `kenda123`

### 2. Biên dịch bản chính thức (Production Build)
```bash
npm run build
npm run preview
```
Thư mục `dist/` sau khi build chứa mã nguồn HTML/CSS/JS thuần tĩnh, sẵn sàng đưa lên bất kỳ hosting, VPS, Vercel, Netlify hay cPanel nào.

---

## 🌟 Các tính năng chính

1. **Header 2 tầng chuẩn Volkswagen**:
   - Logo SVG chính hãng, tên đại lý `Volkswagen Golden Urban Store`.
   - Địa chỉ showroom: `Số 922 Nguyễn Trãi, Phường Chợ Lớn, TP.HCM`.
   - Hotline 24/7: `0941 866 779`.
   - Menu điều hướng mượt mà và menu dạng ngăn kéo (Drawer) trên thiết bị di động.

2. **Hero Banner Slider & Booking Strip**:
   - Slider tự động chuyển cảnh giới thiệu các chương trình ưu đãi nổi bật.
   - Dải banner đăng ký ưu đãi ngay dưới slider.

3. **Giới thiệu Showroom chuẩn Châu Âu**:
   - Giới thiệu mô hình Urban Store hiện đại tại Golden Plaza.
   - Các điểm nhấn: Xe sẵn giao ngay, Bảo hành 3 năm chính hãng, Hỗ trợ trả góp 85%, Đội ngũ chuyên nghiệp chuẩn Đức.

4. **Bảng giá & Danh mục 8 dòng xe Volkswagen**:
   - Bộ lọc theo phân khúc: Tất cả, SUV / Crossover, MPV Thương Gia, Hatchback.
   - Đầy đủ 8 dòng xe: **Viloran**, **Teramont X**, **Teramont Pro**, **Teramont President**, **Teramont**, **Touareg**, **Tiguan**, **Golf**.
   - Thẻ thông tin xe hiển thị giá niêm yết, thông số nhanh (số chỗ, động cơ TSI, hộp số DSG, hệ dẫn động).

5. **Modal Chi Tiết Xe Toàn Diện**:
   - Bộ sưu tập ảnh & bảng chọn màu ngoại thất tương tác.
   - Bảng thông số kỹ thuật chi tiết (Kích thước, Chiều dài cơ sở, Động cơ, Công suất, Mô-men xoắn, Tiêu hao nhiên liệu, Tăng tốc 0-100 km/h).
   - Danh sách trang bị an toàn & công nghệ thông minh IQ.Drive.

6. **Công Cụ Dự Toán Lăn Bánh & Trả Góp Ngân Hàng**:
   - Tính toán chi phí lăn bánh chính xác theo khu vực: TP.HCM (10%), Hà Nội (12%), Tỉnh khác (10%).
   - Tự động tính phí biển số, bảo hiểm TNDS, phí đăng kiểm, bảo trì đường bộ, bảo hiểm vật chất.
   - Bảng tính trả góp: Lựa chọn tỷ lệ trả trước (15% - 70%), thời hạn vay (1 - 7 năm), lãi suất ước tính, tính ra tiền gốc + lãi tháng đầu và số tiền trả góp hàng tháng.

7. **Thư Viện Ảnh Sự Kiện & Lễ Bàn Giao Xe**:
   - 3 Tab chủ đề: *Giới thiệu Showroom*, *Khách hàng tại Showroom*, *Lễ Bàn Giao Xe Mới*.
   - Tích hợp tính năng Lightbox phóng to ảnh sắc nét với điều hướng Trước/Sau.

8. **Tin Tức, Tạp Chí & Ưu Đãi Mới Nhất**:
   - Các bài viết về chương trình khuyến mãi, sự kiện lái thử và tư vấn bảo dưỡng.
   - Khối đăng ký ấn phẩm Tạp chí Volkswagen và Đặt hẹn dịch vụ tại xưởng.

9. **Hệ Thống Form & Quản Lý Leads (Khách Hàng Đăng Ký)**:
   - Popup nhận báo giá tự động mở sau 4 giây (theo chuẩn website gốc).
   - Xác thực số điện thoại chuẩn 10 số di động Việt Nam.
   - Tự động lưu trữ thông tin khách hàng vào `localStorage`.
   - Tích hợp giao diện **Quản lý Leads Khách Hàng (Admin Lead Viewer)** cho phép xem, lọc, xóa và xuất danh sách khách hàng ra file Excel (CSV).

10. **Thanh Công Cụ Liên Hệ Nhanh (Floating Toolbar)**:
    - Nổi ở góc phải màn hình desktop và gắn cố định ở đáy màn hình mobile:
      - 📞 Hotline: Gọi ngay `0941 866 779`
      - 💬 Zalo: Chat trực tiếp `0789 475 066`
      - 💬 Messenger: Chat fanpage
      - 📋 Báo giá nhanh
      - ⬆️ Cuộn nhanh lên đầu trang (Back to top)

11. **Chân Trang (Footer) & Bản Đồ Google Maps**:
    - Thông tin pháp lý Công ty TNHH Ô Tô VW Sài Gòn.
    - Bản đồ Google Maps nhúng trực quan vị trí showroom tại Golden Plaza.
    - Thống kê lượt truy cập theo thời gian thực mô phỏng.
