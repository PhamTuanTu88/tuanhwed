# Thiệp cưới của Tuấn Tú

1. Giải nén ZIP. Trong VS Code chọn **File → Open Folder** và mở thư mục **ThiepCuoi**.
2. Mở **config.js** để sửa tên cô dâu, tên chú rể, ngày cưới, ngày âm lịch và địa chỉ. Mục lịch thành hôn riêng dùng các trường `scheduleTime`, `scheduleWeekday`, `scheduleDate` và `scheduleLunarDate`. Bộ đếm ngược dùng `countdownDateTime`, hiện được đặt đến `2027-01-22T00:00:00+07:00`. Ngày giờ dùng định dạng như `2027-01-23T11:00:00+07:00`. Để trống `countdownDateTime` và `dateTime` sẽ ẩn bộ đếm.
3. Dùng **Live Server** trong VS Code để mở **index.html** bằng địa chỉ `http://...` nếu muốn phát nhạc. Bấm **Mở thiệp** để sang trang nội dung riêng **invitation.html**. Mở trực tiếp bằng `file://` vẫn xem được thiệp nhưng trình duyệt này không phát tệp nhạc.

Phần xác nhận tham dự hiển thị phản hồi ngay bên dưới biểu mẫu trong trang đang mở. Thiệp hiện là trang tĩnh nên phản hồi không được gửi/lưu chung để cô dâu chú rể xem từ thiết bị khác.

## Thay ảnh sau buổi chụp

- Thay ảnh trong **assets/images/ảnh cưới1.jpg** đến **assets/images/ảnh cưới10.jpg** bằng ảnh cưới mới, giữ nguyên tên tệp để thay ảnh nhanh. Thứ tự sử dụng: ảnh 1 ở phần **Ngày Chung Đôi**; ảnh 2 ảnh đôi phía trên chân dung; ảnh 3 chú rể; ảnh 4 cô dâu; ảnh 5–10 trong album.
- **assets/images/ảnh bìa.jpg** vẫn dùng làm ảnh bìa ở đầu thiệp.
- Thay **assets/images/QRchure.jpg** và **assets/images/QRcodau.jpg** bằng mã QR nhận mừng cưới tương ứng; bấm hộp Nhà trai hoặc Nhà gái để xem mã.
- **assets/images/chibi.jpg** là hình minh họa nhỏ ngăn cách phần thiệp mời với phần giới thiệu cô dâu, chú rể.
- Nếu ảnh có tên hoặc phần mở rộng khác, sửa `cover`, `storyPhoto`, `coupleHeroPhoto`, `groomPhoto`, `bridePhoto` và `gallery` trong **config.js**.
- Nếu chủ thể bị cắt, chỉnh `object-position` ở các selector `.person-card--groom .person-photo img` và `.person-card--bride .person-photo img` trong **style.css**.

## Thay nhạc

Tệp gốc là **assets/music/Lễ Đường.mp3**; bản dùng trong thiệp là **assets/music/le-duong.mp3** để đường dẫn hoạt động ổn định. Thiệp sẽ thử tự phát khi mở trang nội dung; nếu trình duyệt chặn tự phát, bấm **♫ Nhạc cưới** để phát hoặc tạm dừng. Để dùng tên tệp khác, sửa trường `music` trong **config.js**. Nhạc phát lặp.

Khi chuyển thiệp sang máy khác, chuyển cả thư mục để giữ ảnh, nhạc và CSS.
