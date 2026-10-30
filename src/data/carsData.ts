import type { CarModel } from '../types/car';
import { EVENTS_DATA } from './eventsData';

export const CARS_DATA: CarModel[] = [
  {
    id: 'vw-viloran',
    name: 'Volkswagen Viloran',
    slug: 'volkswagen-viloran',
    tagline: 'MPV hạng sang đích thực - Đỉnh cao phong thái thương gia',
    category: 'mpv',
    categoryLabel: 'MPV Thương Gia',
    priceText: 'Giá từ 2 tỷ 088 triệu',
    priceNumber: 2088000000,
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/COVER-1-2-1024x576.webp',
    gallery: [
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/COVER-1-2-1024x576.webp',
      'https://volkswagengolden.vn/wp-content/uploads/2026/06/Phong-cach-thiet-ke-V-line--1024x728.jpg',
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/05_DSCF9306-1024x742.jpg'
    ],
    badge: 'Bán chạy nhất',
    highlights: [
      'Hàng ghế thương gia tích hợp massage 3 chế độ, đệm bắp chân chỉnh điện & sưởi/làm mát',
      'Cửa trượt điện chống kẹt 2 bên tiện nghi & kính cách âm 2 lớp cao cấp',
      'Hệ thống an toàn hỗ trợ lái thông minh IQ.Drive thế hệ mới',
      'Cửa sổ trời toàn cảnh Panorama diện tích lên tới 1.18 m²'
    ],
    specs: {
      engine: '2.0L TSI Turbo tăng áp',
      maxPower: '220 Hp @ 4.900 - 6.700 rpm',
      torque: '350 Nm @ 1.600 - 4.300 rpm',
      transmission: 'Tự động 7 cấp ly hợp kép DSG',
      drivetrain: 'Cầu trước (FWD)',
      seats: 7,
      dimensions: '5.346 x 1.976 x 1.781 mm',
      wheelbase: '3.180 mm',
      fuelConsumption: '8.2L / 100km',
      acceleration: '9.3s (0-100 km/h)',
      topSpeed: '200 km/h'
    },
    features: [
      'Đèn LED Matrix IQ.Light thích ứng tự động',
      'Điều hòa tự động 3 vùng Climatronic với lọc bụi mịn PM2.5',
      'Hệ thống âm thanh Dynaudio cao cấp',
      'Sạc không dây cho cả 2 hàng ghế',
      'Cốp sau đóng mở điện thông minh rảnh tay'
    ],
    colors: [
      { name: 'Trắng Glacier', hex: '#f8fafc' },
      { name: 'Đen Deep Black', hex: '#0f172a' },
      { name: 'Đỏ Crimson Red', hex: '#991b1b' },
      { name: 'Vàng Amber', hex: '#b45309' }
    ]
  },
  {
    id: 'vw-teramont-x',
    name: 'Volkswagen Teramont X',
    slug: 'volkswagen-teramont-x',
    tagline: 'SUV Coupe thời thượng - Bứt phá mọi giới hạn phong cách',
    category: 'suv',
    categoryLabel: 'SUV Thể Thao Coupe',
    priceText: 'Giá từ 1 tỷ 998 triệu',
    priceNumber: 1998000000,
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-X-1024x683.webp',
    gallery: [
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-X-1024x683.webp',
      'https://volkswagengolden.vn/wp-content/uploads/2026/06/z7899233077807_907095f633765124737c122bcedd9135.jpg'
    ],
    badge: 'Mới ra mắt',
    highlights: [
      'Kiểu dáng SUV Coupe vuốt xuôi thể thao cá tính, gói thể thao R-Line độc quyền',
      'Dẫn động 4 bánh toàn thời gian 4MOTION biến thiên linh hoạt',
      'Màn hình giải trí 12 inch kết hợp đồng hồ kỹ thuật số Digital Cockpit Pro 10.25 inch',
      'Hệ thống âm thanh Harman Kardon 12 loa công suất 700W'
    ],
    specs: {
      engine: '2.0L TSI Turbo tăng áp',
      maxPower: '220 Hp @ 4.500 - 6.200 rpm',
      torque: '350 Nm @ 1.500 - 4.400 rpm',
      transmission: 'Tự động 7 cấp ly hợp kép DSG',
      drivetrain: '4 bánh toàn thời gian (4MOTION)',
      seats: 5,
      dimensions: '4.917 x 1.989 x 1.729 mm',
      wheelbase: '2.980 mm',
      fuelConsumption: '8.8L / 100km',
      acceleration: '8.5s (0-100 km/h)',
      topSpeed: '210 km/h'
    },
    features: [
      'Hệ thống đèn LED ma trận 2 tầng với tính năng cua thông minh',
      'Ghế thể thao bọc da phối 2 tông màu nổi bật với chỉ khâu tương phản',
      'Mâm hợp kim 21 inch đen bóng thể thao',
      'Camera 360 độ toàn cảnh Area View 3D',
      'Hiển thị thông tin trên kính lái HUD (Head-Up Display)'
    ],
    colors: [
      { name: 'Xám Mangan Grey', hex: '#475569' },
      { name: 'Trắng Oryx White', hex: '#ffffff' },
      { name: 'Đỏ Kings Red', hex: '#b91c1c' },
      { name: 'Đen Deep Black', hex: '#0a0a0a' }
    ]
  },
  {
    id: 'vw-teramont-pro',
    name: 'Volkswagen Teramont Pro',
    slug: 'volkswagen-teramont-pro',
    tagline: 'Đỉnh cao SUV 7 chỗ full-size - Công nghệ thông minh vượt bậc',
    category: 'suv',
    categoryLabel: 'SUV 7 Chỗ Full-Size',
    priceText: 'Giá từ 2 tỷ 799 triệu',
    priceNumber: 2799000000,
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-Pro-1-1024x684.jpg',
    gallery: [
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-Pro-1-1024x684.jpg',
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-President-1024x525.jpg'
    ],
    badge: 'Flagship SUV',
    highlights: [
      'Kích thước vượt trội dài hơn 5.15 mét, khoang nội thất 7 chỗ rộng rãi nhất phân khúc',
      'Hệ thống 3 màn hình cảm ứng liên hoàn trải dài táp-lô tích hợp AI thông minh',
      'Động cơ thế hệ mới công suất 268 Hp mạnh mẽ hàng đầu',
      'Gói hỗ trợ lái tự động bán tự động cấp độ 2 Travel Assist cao cấp'
    ],
    specs: {
      engine: '2.0L TSI Turbo thế hệ thứ 4',
      maxPower: '268 Hp @ 5.000 - 6.500 rpm',
      torque: '380 Nm @ 1.800 - 4.500 rpm',
      transmission: 'Tự động 7 cấp DSG chuyển số tức thì',
      drivetrain: '4MOTION thông minh 7 chế độ địa hình',
      seats: 7,
      dimensions: '5.158 x 1.991 x 1.788 mm',
      wheelbase: '2.980 mm',
      fuelConsumption: '9.2L / 100km',
      acceleration: '7.8s (0-100 km/h)',
      topSpeed: '220 km/h'
    },
    features: [
      'Màn hình giải trí trung tâm 15 inch độ phân giải 2K',
      'Màn hình phụ dành riêng cho ghế phụ lái',
      'Hệ thống nước hoa nội thất 3 mùi hương và ion hóa không khí',
      'Hệ thống treo thích ứng Dynamic Chassis Control (DCC)',
      'Hỗ trợ đỗ xe tự động Park Assist Plus tích hợp nhớ vị trí đỗ'
    ],
    colors: [
      { name: 'Xanh Tourmaline Blue', hex: '#1e3a8a' },
      { name: 'Trắng Pure White', hex: '#f8fafc' },
      { name: 'Bạc Pyrite Silver', hex: '#cbd5e1' },
      { name: 'Đen Phù Thủy', hex: '#18181b' }
    ]
  },
  {
    id: 'vw-teramont-president',
    name: 'Volkswagen Teramont President',
    slug: 'volkswagen-teramont-president',
    tagline: 'Phiên bản Chủ tịch - Đẳng cấp doanh nhân thành đạt',
    category: 'suv',
    categoryLabel: 'SUV Thương Gia',
    priceText: 'Giá từ 2 tỷ 488 triệu',
    priceNumber: 2488000000,
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-President-1024x525.jpg',
    gallery: [
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-President-1024x525.jpg',
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-1024x576.webp'
    ],
    badge: 'Phiên bản đặc biệt',
    highlights: [
      'Cấu hình 6 chỗ với hàng ghế thứ hai Captain Chairs bọc da Nappa thủ công',
      'Logo President mạ vàng sang trọng và ốp gỗ sồi tự nhiên Open-pore',
      'Tủ lạnh mini tích hợp bệ tỳ tay trung tâm làm lạnh sâu',
      'Bộ mâm hợp kim 21 inch đa chấu phay kim cương độc quyền'
    ],
    specs: {
      engine: '2.0L TSI Turbo tăng áp',
      maxPower: '220 Hp @ 4.500 - 6.200 rpm',
      torque: '350 Nm @ 1.500 - 4.400 rpm',
      transmission: 'Tự động 7 cấp ly hợp kép DSG',
      drivetrain: '4MOTION 4 bánh toàn thời gian',
      seats: 6,
      dimensions: '5.097 x 1.990 x 1.777 mm',
      wheelbase: '2.980 mm',
      fuelConsumption: '9.5L / 100km',
      acceleration: '8.9s (0-100 km/h)',
      topSpeed: '210 km/h'
    },
    features: [
      'Hàng ghế VIP chỉnh điện 12 hướng có nhớ vị trí và massage',
      'Bàn làm việc gấp gọn bọc da cao cấp cho chủ nhân',
      'Rèm che nắng kính sau chỉnh điện',
      'Kính cách âm chống tia cực tím 99%',
      'Hệ thống âm thanh vòm 14 loa Fender công suất lớn'
    ],
    colors: [
      { name: 'Xanh Emerald Green', hex: '#064e3b' },
      { name: 'Đen Obsidian Black', hex: '#09090b' },
      { name: 'Trắng Ánh Kim', hex: '#fafafa' }
    ]
  },
  {
    id: 'vw-teramont',
    name: 'Volkswagen Teramont',
    slug: 'volkswagen-teramont',
    tagline: 'SUV 7 chỗ cỡ lớn nhập khẩu Mỹ - Không gian cho mọi hành trình',
    category: 'suv',
    categoryLabel: 'SUV 7 Chỗ Nhập Mỹ',
    priceText: 'Giá từ 1 tỷ 788 triệu',
    priceNumber: 1788000000,
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-1024x576.webp',
    gallery: [
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-1024x576.webp',
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/COVER-1-2-1024x576.webp'
    ],
    badge: 'Nhập khẩu Mỹ',
    highlights: [
      'Nhập khẩu nguyên chiếc từ nhà máy Chattanooga (Tennessee, Hoa Kỳ)',
      'Khoang hành lý siêu rộng tới 2.741 lít khi gập các hàng ghế',
      'Đạt chứng nhận an toàn 5 sao NHTSA và Top Safety Pick của IIHS',
      'Khung gầm liền khối chắc chắn, cách âm chuẩn Châu Âu'
    ],
    specs: {
      engine: '2.0L TSI Turbo tăng áp',
      maxPower: '220 Hp @ 4.500 - 6.200 rpm',
      torque: '350 Nm @ 1.600 - 4.400 rpm',
      transmission: 'Tự động 8 cấp Tiptronic',
      drivetrain: '4MOTION 4 bánh toàn thời gian',
      seats: 7,
      dimensions: '5.097 x 1.990 x 1.777 mm',
      wheelbase: '2.980 mm',
      fuelConsumption: '9.8L / 100km',
      acceleration: '8.9s (0-100 km/h)',
      topSpeed: '200 km/h'
    },
    features: [
      '17 hộc đựng đồ bố trí tiện ích khắp khoang xe',
      'Cửa sổ trời toàn cảnh trượt điện 2 mảnh',
      'Gói trang bị an toàn chủ động Front Assist & Blind Spot',
      'Hàng ghế thứ 3 đủ chỗ ngồi thoải mái cho 2 người lớn cao 1m8'
    ],
    colors: [
      { name: 'Xám Mangan Grey', hex: '#475569' },
      { name: 'Trắng Pure White', hex: '#ffffff' },
      { name: 'Xanh Tourmaline', hex: '#1e3a8a' },
      { name: 'Đen Deep Black', hex: '#0f172a' }
    ]
  },
  {
    id: 'vw-touareg',
    name: 'Volkswagen Touareg',
    slug: 'volkswagen-touareg',
    tagline: 'Đỉnh cao SUV đầu bảng Châu Âu - Đẳng cấp thủ lĩnh tiên phong',
    category: 'suv',
    categoryLabel: 'SUV Hạng Sang Flagship',
    priceText: 'Giá từ 2 tỷ 368 triệu',
    priceNumber: 2368000000,
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Toaureg-1024x683.jpg',
    gallery: [
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Toaureg-1024x683.jpg',
      'https://volkswagengolden.vn/wp-content/uploads/2026/06/z7899233077807_907095f633765124737c122bcedd9135.jpg'
    ],
    badge: 'Flagship Đức',
    highlights: [
      'Chung khung gầm MLB Evo danh tiếng với Porsche Cayenne & Bentley Bentayga',
      'Hệ thống treo khí nén nâng hạ gầm tự động với khả năng lội nước lên tới 550mm',
      'Khoang lái kỹ thuật số Innovision Cockpit màn hình cong 15 inch ấn tượng',
      'Đèn pha ma trận IQ.Light LED Matrix thông minh với 128 bóng LED mỗi bên'
    ],
    specs: {
      engine: '2.0L TSI Turbo tăng áp',
      maxPower: '251 Hp @ 5.000 - 6.000 rpm',
      torque: '370 Nm @ 1.600 - 4.500 rpm',
      transmission: 'Tự động 8 cấp Tiptronic cao cấp',
      drivetrain: '4MOTION 4 bánh toàn thời gian với khóa vi sai Torsen',
      seats: 5,
      dimensions: '4.878 x 1.984 x 1.717 mm',
      wheelbase: '2.904 mm',
      fuelConsumption: '9.0L / 100km',
      acceleration: '6.8s (0-100 km/h)',
      topSpeed: '228 km/h'
    },
    features: [
      'Hệ thống nhìn ban đêm Night Vision nhận diện người & động vật',
      'Hệ thống đánh lái 4 bánh All-wheel steering giúp xe quay đầu cực kỳ linh hoạt',
      'Ghế bọc da Savona cao cấp với 8 chế độ massage bằng khí nén',
      'Âm thanh Dynaudio Consequence 730W với 14 loa và 1 subwoofer'
    ],
    colors: [
      { name: 'Xanh Malbec Red', hex: '#581c87' },
      { name: 'Bạc Sechura Grey', hex: '#64748b' },
      { name: 'Đen Moonlight Blue', hex: '#0f172a' },
      { name: 'Trắng Oryx White', hex: '#ffffff' }
    ]
  },
  {
    id: 'vw-tiguan',
    name: 'Volkswagen Tiguan',
    slug: 'volkswagen-tiguan',
    tagline: 'SUV Đức đa năng 5+2 chỗ - Bền bỉ, an toàn & thực dụng',
    category: 'suv',
    categoryLabel: 'SUV 5+2 Đa Dụng',
    priceText: 'Giá từ 1 tỷ 599 triệu',
    priceNumber: 1599000000,
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Tiguan-1024x683.webp',
    gallery: [
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Tiguan-1024x683.webp',
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/05_DSCF9306-1024x742.jpg'
    ],
    badge: 'Ưu đãi 100% trước bạ',
    highlights: [
      'Mẫu SUV bán chạy nhất của tập đoàn Volkswagen trên toàn cầu',
      'Khung gầm đầm chắc, khả năng cách âm và cảm giác lái đậm chất Đức',
      'Hệ thống dẫn động 4MOTION với 4 chế độ lái: On-road, Snow, Off-road, Off-road Individual',
      'Hàng ghế thứ hai trượt 18cm và gập 40:20:40 tiện lợi'
    ],
    specs: {
      engine: '2.0L TSI Turbo tăng áp',
      maxPower: '180 Hp @ 3.940 - 6.000 rpm',
      torque: '320 Nm @ 1.500 - 3.940 rpm',
      transmission: 'Tự động 7 cấp ly hợp kép DSG',
      drivetrain: '4MOTION 4 bánh toàn thời gian',
      seats: 7,
      dimensions: '4.728 x 1.839 x 1.686 mm',
      wheelbase: '2.790 mm',
      fuelConsumption: '7.8L / 100km',
      acceleration: '7.8s (0-100 km/h)',
      topSpeed: '208 km/h'
    },
    features: [
      'Đèn LED IQ.Light hỗ trợ mở rộng góc chiếu khi vào cua',
      'Màn hình kỹ thuật số Digital Cockpit 10.3 inch hiển thị đa thông tin',
      'Hệ thống kiểm soát hành trình thích ứng Cruise Control',
      'Hệ thống phanh chống bó cứng ABS, cân bằng điện tử ESC'
    ],
    colors: [
      { name: 'Trắng Pure White', hex: '#ffffff' },
      { name: 'Xám Platinum Grey', hex: '#64748b' },
      { name: 'Xanh Atlantic Blue', hex: '#1e3a8a' },
      { name: 'Đen Deep Black', hex: '#0f172a' }
    ]
  },
  {
    id: 'vw-golf',
    name: 'Volkswagen Golf',
    slug: 'volkswagen-golf',
    tagline: 'Hatchback thể thao huyền thoại Đức - Biểu tượng phong cách lái',
    category: 'hatchback',
    categoryLabel: 'Hatchback Thể Thao',
    priceText: 'Giá từ 798 triệu',
    priceNumber: 798000000,
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/volkswagen-golf-10-1200x800-1-1024x683.jpg',
    gallery: [
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/volkswagen-golf-10-1200x800-1-1024x683.jpg',
      'https://volkswagengolden.vn/wp-content/uploads/2026/05/COVER-1-2-1024x576.webp'
    ],
    badge: 'Giá tốt nhất',
    highlights: [
      'Biểu tượng văn hóa xe hơi Châu Âu với hơn 35 triệu chiếc bán ra toàn cầu',
      'Cảm giác lái cực kỳ linh hoạt, vào cua chuẩn xác nhờ hệ thống treo thể thao độc lập',
      'Thiết kế khí động học hiện đại với dải LED định vị ngang nắp capo thời thượng',
      'Tiết kiệm nhiên liệu vượt trội chỉ từ 5.6L / 100km'
    ],
    specs: {
      engine: '1.4L TSI Turbo / 2.0L TSI Turbo',
      maxPower: '150 Hp @ 5.000 rpm',
      torque: '250 Nm @ 1.500 - 3.500 rpm',
      transmission: 'Tự động 8 cấp hoặc 7 cấp DSG',
      drivetrain: 'Cầu trước (FWD)',
      seats: 5,
      dimensions: '4.284 x 1.789 x 1.456 mm',
      wheelbase: '2.636 mm',
      fuelConsumption: '5.8L / 100km',
      acceleration: '8.2s (0-100 km/h)',
      topSpeed: '215 km/h'
    },
    features: [
      'Cụm đèn chiếu sáng full LED thông minh',
      'Màn hình giải trí cảm ứng hướng về người lái',
      'Vô lăng vát đáy D-cut bọc da tích hợp lẫy chuyển số thể thao',
      'Hệ thống an toàn 6 túi khí và phanh đĩa 4 bánh'
    ],
    colors: [
      { name: 'Đỏ Kings Red', hex: '#dc2626' },
      { name: 'Xanh Lapiz Blue', hex: '#2563eb' },
      { name: 'Trắng Pure White', hex: '#ffffff' },
      { name: 'Xám Urano Grey', hex: '#4b5563' }
    ]
  }
];

export const SHOWROOM_INFO = {
  name: 'Volkswagen Thế Kiệt',
  company: 'CÔNG TY TNHH Ô TÔ VW SÀI GÒN',
  address: 'Số 922 Nguyễn Trãi, Phường Chợ Lớn, Thành Phố Hồ Chí Minh, Việt Nam',
  hotline: '0941 866 779',
  hotlineFormatted: '0941.866.779',
  email: 'info@vwsaigon.vn',
  website: 'https://volkswagengolden.vn',
  zalo: 'https://zalo.me/0789475066',
  zaloPhone: '0789 475 066',
  messenger: 'http://m.me/649644434900717',
  facebook: 'https://www.facebook.com/vw.golden/',
  tiktok: 'https://www.tiktok.com/@vw.golden.ofc',
  youtube: 'https://www.youtube.com/@VolkswagenGolden',
  openHours: 'Thứ 2 - Chủ Nhật: 08:00 - 18:00',
  notificationEmail: 'info@vwsaigon.vn',
  notificationEnabled: true
};

export const DEFAULT_SITE_CONTENT = {
  heroSlides: [
    {
      id: 1,
      badge: 'CHƯƠNG TRÌNH ĐẶC QUYỀN THÁNG NÀY',
      title: 'SỞ HỮU VOLKSWAGEN CHÍNH HÃNG VỚI ƯU ĐÃI KHỦNG',
      subtitle: 'Hỗ trợ 100% Lệ phí trước bạ • Tặng gói bảo dưỡng 3 năm • Giao xe tận nhà',
      image: 'https://volkswagengolden.vn/wp-content/uploads/2026/08/1111111.jpg',
      model: 'Volkswagen Viloran',
      ctaText: 'NHẬN ƯU ĐÃI NGAY'
    },
    {
      id: 2,
      badge: 'MPV THƯƠNG GIA ĐẲNG CẤP ĐỨC',
      title: 'VOLKSWAGEN VILORAN - ĐỈNH CAO PHONG THÁI',
      subtitle: 'Hàng ghế cơ trưởng VIP massage • Động cơ 2.0 TSI mạnh mẽ • Giá chỉ từ 2 tỷ 088 triệu',
      image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/COVER-1-2-1024x576.webp',
      model: 'Volkswagen Viloran',
      ctaText: 'BÁO GIÁ VILORAN'
    },
    {
      id: 3,
      badge: 'SUV COUPE THỂ THAO THỜI THƯỢNG',
      title: 'VOLKSWAGEN TERAMONT X - BỨT PHÁ PHONG CÁCH',
      subtitle: 'Dẫn động 4MOTION 4 bánh toàn thời gian • Âm thanh Harman Kardon • Giá từ 1 tỷ 998 triệu',
      image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-X-1024x683.webp',
      model: 'Volkswagen Teramont X',
      ctaText: 'BÁO GIÁ TERAMONT X'
    }
  ],
  bookingStrip: {
    title: 'Liên hệ ngay để nhận báo giá lăn bánh và ưu đãi hấp dẫn nhất',
    subtitle: 'Tư vấn tận tâm • Hỗ trợ thủ tục trả góp 85% nhanh chóng • Đăng ký lái thử tận nơi',
    buttonText: 'NHẬN ƯU ĐÃI'
  },
  showroomIntro: {
    badge: 'SHOWROOM TIÊU CHUẨN ĐỨC',
    title: 'Volkswagen Thế Kiệt – Tinh hoa Đức trong không gian hiện đại và khác biệt',
    description: 'Volkswagen Thế Kiệt là không gian trải nghiệm phong cách sống hiện đại, nơi khách hàng không chỉ chiêm ngưỡng những mẫu xe Đức trứ danh mà còn tận hưởng không gian tiếp đón sang trọng và riêng tư.',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/z7899233077807_907095f633765124737c122bcedd9135.jpg',
    features: [
      {
        title: 'Xe Sẵn Giao Ngay',
        desc: 'Đầy đủ màu sắc, phiên bản và hồ sơ giao xe trong ngày.'
      },
      {
        title: 'Bảo Hành 3 Năm',
        desc: 'Bảo hành chính hãng không giới hạn km toàn quốc.'
      },
      {
        title: 'Tư Vấn Tận Tâm',
        desc: 'Đội ngũ chuyên viên được đào tạo theo tiêu chuẩn Volkswagen Châu Âu.'
      },
      {
        title: 'Hỗ Trợ Trả Góp 85%',
        desc: 'Lãi suất ưu đãi từ các ngân hàng đối tác lớn, duyệt hồ sơ 24h.'
      }
    ]
  },
  carSection: {
    badge: 'BẢNG GIÁ & DÒNG XE',
    title: 'Dòng Xe Volkswagen Nổi Bật',
    subtitle: 'Khám phá những kiệt tác cơ khí đỉnh cao từ Đức. Đầy đủ các phân khúc từ SUV gia đình, MPV thương gia đến Hatchback thể thao.'
  },
  gallerySection: {
    badge: 'KHOẢNH KHẮC & SỰ KIỆN',
    title: 'Hình Ảnh Bàn Giao & Trải Nghiệm Khách Hàng',
    subtitle: 'Những khoảnh khắc trao chìa khóa trọn niềm vui và sự tin tưởng của các khách hàng đẳng cấp khi đồng hành cùng Volkswagen Thế Kiệt.',
    items: EVENTS_DATA
  },
  newsSection: {
    badge: 'TIN TỨC & SỰ KIỆN',
    title: 'Tin Tức & Hoạt Động Volkswagen',
    subtitle: 'Cập nhật những thông tin mới nhất về thị trường, các mẫu xe thế hệ mới và các ưu đãi dịch vụ độc quyền.',
    newsItems: [
      {
        id: 'news-1',
        title: 'Volkswagen Thế Kiệt – Không gian trải nghiệm chuẩn Châu Âu',
        date: 'Tháng 6, 2026',
        excerpt: 'Volkswagen Thế Kiệt mang đến không gian trải nghiệm hiện đại, nơi khách hàng trải nghiệm trọn vẹn các dòng xe Volkswagen chính hãng cùng dịch vụ tiêu chuẩn 4S.',
        image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/NTT05987-1024x683.jpg',
        category: 'Tin Showroom',
        readTime: '3 phút đọc'
      },
      {
        id: 'news-2',
        title: 'Chương trình Ưu đãi đặc biệt: Hỗ trợ 100% lệ phí trước bạ cho Volkswagen Tiguan & Viloran',
        date: 'Tháng 6, 2026',
        excerpt: 'Cơ hội sở hữu dòng xe Châu Âu mơ ước với mức tiết kiệm lên tới hàng trăm triệu đồng cùng gói bảo dưỡng miễn phí 3 năm chính hãng.',
        image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/COVER-1-2-1024x576.webp',
        category: 'Khuyến mãi',
        readTime: '2 phút đọc'
      },
      {
        id: 'news-3',
        title: 'Khám phá Volkswagen Viloran – Chiếc MPV thương gia đang làm mưa làm gió thị trường',
        date: 'Tháng 5, 2026',
        excerpt: 'Với hàng ghế VIP thương gia trang bị massage, đệm bắp chân chỉnh điện và khả năng cách âm đỉnh cao, Viloran xứng đáng là văn phòng di động cho các chủ doanh nghiệp.',
        image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/Phong-cach-thiet-ke-V-line--1024x728.jpg',
        category: 'Đánh giá xe',
        readTime: '4 phút đọc'
      },
      {
        id: 'news-4',
        title: 'Hướng dẫn quy trình bảo dưỡng xe định kỳ tại Xưởng dịch vụ Volkswagen Sài Gòn',
        date: 'Tháng 5, 2026',
        excerpt: 'Đảm bảo sự an tâm tuyệt đối trên mỗi cung đường với quy trình bảo dưỡng 32 bước tiêu chuẩn toàn cầu bằng phụ tùng nhập khẩu chính ngạch.',
        image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/DAT-LICH-HEN-1024x576.jpg',
        category: 'Dịch vụ',
        readTime: '3 phút đọc'
      }
    ],
    magazineCard: {
      title: 'Tạp chí Volkswagen',
      description: 'Khám phá lịch sử thương hiệu, công nghệ động cơ TSI và phong cách sống thượng lưu cùng những chủ nhân xe Volkswagen.',
      buttonText: 'KHÁM PHÁ ẤN PHẨM',
      image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/Volkswagen-Teramont-X-1024x683.webp'
    },
    workshopCard: {
      title: 'Đặt Hẹn Dịch Vụ & Bảo Dưỡng',
      description: 'Xưởng dịch vụ Volkswagen Sài Gòn với trang thiết bị chẩn đoán ODIS tiêu chuẩn CHLB Đức và phụ tùng chính hãng 100%.',
      buttonText: 'ĐẶT LỊCH HẸN NGAY',
      image: 'https://volkswagengolden.vn/wp-content/uploads/2026/05/DAT-LICH-HEN-1024x576.jpg'
    }
  }
};
