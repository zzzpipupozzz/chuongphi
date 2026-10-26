# Quy ước hình ảnh của dự án

- Khi thêm hình ảnh vào website, tự động lưu hoặc chuyển bản ảnh trong dự án vào thư mục `image/`. Tạo thư mục này nếu chưa có.
- Với ảnh người dùng cung cấp ở ngoài dự án, sao chép bản dùng cho website vào `image/`.
- Người dùng đã cho phép thực hiện việc sắp xếp ảnh này mà không cần hỏi lại.
- Cập nhật các đường dẫn ảnh trong HTML, CSS và JavaScript theo vị trí mới.
- Khi trùng tên, dùng tên riêng cho ảnh mới để bảo toàn ảnh hiện có.

# Cấu trúc mã nguồn

- Lưu các file JavaScript trong thư mục `js/` và các file CSS trong thư mục `css/`.
- Cập nhật đường dẫn khi thêm hoặc di chuyển file. Đường dẫn ảnh được gán cho phần tử HTML bằng JavaScript được tính từ trang HTML; đường dẫn `url(...)` trong CSS được tính từ file CSS.

- Khi tạo hoặc thêm file JavaScript/CSS mới, tự động lưu hoặc chuyển vào thư mục tương ứng js/ và css/, đồng thời cập nhật mọi đường dẫn liên quan, không cần hỏi lại người dùng. Khi trùng tên, bảo toàn file hiện có và dùng tên riêng cho bản được chuyển.
