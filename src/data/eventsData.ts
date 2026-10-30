import type { EventItem, NewsItem } from '../types/car';

export const EVENTS_DATA: EventItem[] = [
  // Showroom
  {
    id: 'sr-1',
    title: 'Showroom Volkswagen Thế Kiệt - Không gian sang trọng chuẩn Châu Âu',
    category: 'showroom',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/NTT05987-1024x683.jpg'
  },
  {
    id: 'sr-2',
    title: 'Khu vực trưng bày các dòng xe SUV & MPV đẳng cấp Châu Âu',
    category: 'showroom',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/NTT05982-1024x683.jpg'
  },
  {
    id: 'sr-3',
    title: 'Không gian trải nghiệm Urban Store hiện đại bậc nhất Sài Gòn',
    category: 'showroom',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/z7899233077807_907095f633765124737c122bcedd9135-1024x683.jpg'
  },
  {
    id: 'sr-4',
    title: 'Lounge tiếp đón khách hàng thương gia tiện nghi và riêng tư',
    category: 'showroom',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/z7788686469240_003_8fb74ffefa4b5d72a13fe512b4ac708c-1024x683.jpg'
  },
  {
    id: 'sr-5',
    title: 'Khu vực trưng bày phụ kiện và cá nhân hóa xe chính hãng',
    category: 'showroom',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/z7788686469240_000_506adf57caf8b8f48eb81195034410d6-1024x768.jpg'
  },
  {
    id: 'sr-6',
    title: 'Đội ngũ chuyên viên tư vấn bán hàng chuyên nghiệp được đào tạo chuẩn Đức',
    category: 'showroom',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/NTT06039-1024x683.jpg'
  },

  // Khách hàng
  {
    id: 'kh-1',
    title: 'Khách hàng trải nghiệm và lái thử dòng xe Volkswagen Viloran',
    category: 'customer',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/616025183_122156117402890035_8949251017852484144_n-1024x682.jpg'
  },
  {
    id: 'kh-2',
    title: 'Tư vấn chi tiết trang bị công nghệ và tính năng an toàn IQ.Drive',
    category: 'customer',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/571102392_122142625190890035_271932905411642071_n-1024x576.jpg'
  },
  {
    id: 'kh-3',
    title: 'Khách hàng ký hợp đồng đặt mua xe Volkswagen Teramont X tại showroom',
    category: 'customer',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/547361049_122135378408890035_7487562446476883017_n-1024x653.jpg'
  },
  {
    id: 'kh-4',
    title: 'Gia đình khách hàng tham quan trải nghiệm các dòng xe cuối tuần',
    category: 'customer',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/582794050_122146090712890035_5006742179114967318_n-1024x683.jpg'
  },
  {
    id: 'kh-5',
    title: 'Sự kiện lái thử xe Driving Experience tại Volkswagen Thế Kiệt',
    category: 'customer',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/549560611_122136931124890035_4693860657767008662_n-1024x682.jpg'
  },
  {
    id: 'kh-6',
    title: 'Chuyên viên kỹ thuật giải đáp quy trình bảo dưỡng chuẩn toàn cầu',
    category: 'customer',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/615922008_122156117354890035_3514365990708295791_n-1024x682.jpg'
  },

  // Bàn giao xe
  {
    id: 'bg-1',
    title: 'Lễ bàn giao xe Volkswagen Viloran bản Luxury cho doanh nhân TP.HCM',
    category: 'handover',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/NTT05845-1024x683.jpg'
  },
  {
    id: 'bg-2',
    title: 'Bàn giao xe Volkswagen Teramont cho gia đình khách hàng may mắn',
    category: 'handover',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/619570067_122156117438890035_5183440352399956682_n-682x1024.jpg'
  },
  {
    id: 'bg-3',
    title: 'Khoảnh khắc trao chìa khóa xe Volkswagen Tiguan Allspace sang trọng',
    category: 'handover',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/582578767_122146090838890035_5875926811192801220_n-1024x683.jpg'
  },
  {
    id: 'bg-4',
    title: 'Chúc mừng Quý khách hàng nhận bàn giao siêu phẩm Volkswagen Touareg',
    category: 'handover',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/582059435_122146090772890035_6731411861742428279_n-1024x683.jpg'
  },
  {
    id: 'bg-5',
    title: 'Lễ xuất xưởng và bàn giao xe mới trao trọn niềm tin cho khách hàng',
    category: 'handover',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/550327810_122136931232890035_4313138478781937785_n-1024x682.jpg'
  },
  {
    id: 'bg-6',
    title: 'Bàn giao xe Volkswagen Golf thể thao cho bạn trẻ yêu thích phong cách lái Đức',
    category: 'handover',
    image: 'https://volkswagengolden.vn/wp-content/uploads/2026/06/547516662_122135378666890035_9047339835802051257_n-1024x817.jpg'
  }
];

export const NEWS_DATA: NewsItem[] = [
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
];
