# Auto Submit CodePTIT

Ứng dụng tự động submit code lên hệ thống PTIT.

[![GitHub](https://img.shields.io/github/license/dinhviethuy/Auto-Submit-CodePTIT)](https://github.com/dinhviethuy/Auto-Submit-CodePTIT/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/dinhviethuy/Auto-Submit-CodePTIT)](https://github.com/dinhviethuy/Auto-Submit-CodePTIT/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/dinhviethuy/Auto-Submit-CodePTIT)](https://github.com/dinhviethuy/Auto-Submit-CodePTIT/network/members)

## Yêu cầu hệ thống

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn

## Cài đặt

1. Clone repository:

```bash
git clone https://github.com/dinhviethuy/Auto-Submit-CodePTIT.git
cd Auto-Submit-CodePTIT
```

2. Cài đặt dependencies:

```bash
npm install
# hoặc
yarn install
```

3. Tạo file môi trường:

```bash
cp .env.example .env
```

4. Cấu hình các biến môi trường trong file `.env`:

```env
MA_SV=your_ma_sv        # Ví dụ: 1234567890
PASSWORD=your_password  # Ví dụ: 1234567890
COURSE_ID=your_course_id # Ví dụ: 1234567890
COMPILER=your_compiler   # Ví dụ: 2
```

## Cấu trúc file code

1. Tạo file code trong thư mục `src` với định dạng:

```
<MÃ_BÀI> - <TÊN_BÀI>.<ĐUÔI_FILE>
```

Ví dụ:

- `123 - JQK.c`
- `123 - ABC.cpp`
- `456 - XYZ.java`
- `789 - DEF.py`

Các định dạng file được hỗ trợ:

- `.c` - C #COMPILER: 1
- `.cpp` - C++ #COMPILER: 2
- `.java` - Java #COMPILER: 3
- `.py` - Python #COMPILER: 4

## Sử dụng

### Chạy ở môi trường development

```bash
npm run dev
# hoặc
yarn dev
```

### Build và chạy ở môi trường production

```bash
# Build
npm run build
# hoặc
yarn build

# Chạy
npm start
# hoặc
yarn start
```

### Các lệnh khác

- Kiểm tra lỗi code:

```bash
npm run lint
# hoặc
yarn lint
```

- Tự động sửa lỗi code:

```bash
npm run lint:fix
# hoặc
yarn lint:fix
```

- Kiểm tra định dạng code:

```bash
npm run prettier
# hoặc
yarn prettier
```

- Tự động định dạng code:

```bash
npm run prettier:fix
# hoặc
yarn prettier:fix
```

## Cấu trúc thư mục

```
.
├── src/
│   ├── config/                # Cấu hình ứng dụng (biến môi trường, config chung)
│   │   └── envConfig.ts
│   ├── constants/             # Các hằng số dùng chung
│   │   └── index.ts
│   ├── data/                  # Dữ liệu về bài tập đã/đang/chưa làm (json)
│   │   ├── solved_questions_*.json
│   │   ├── unsolved_questions_*.json
│   │   └── studying.json
│   ├── resource/              # (Tùy mục đích, có thể chứa file mẫu, test case, ...)
│   ├── services/              # Các service gọi API, xử lý HTTP
│   │   ├── api.ts
│   │   └── http.ts
│   └── utils/                 # Các hàm tiện ích dùng chung
│       ├── index.ts
│       └── type.d.ts
├── .env.example               # File mẫu cấu hình môi trường
├── .env                       # File cấu hình môi trường (tự tạo)
├── .editorconfig              # Quy chuẩn editor
├── .gitignore                 # Các file/thư mục bị git bỏ qua
├── .prettierrc                # Quy chuẩn định dạng code
├── .prettierignore            # Các file/thư mục bị prettier bỏ qua
├── eslint.config.mjs          # Cấu hình ESLint
├── nodemon.json               # Cấu hình nodemon cho dev
├── package.json               # Thông tin project & dependencies
├── package-lock.json          # Khóa version dependencies
├── tsconfig.json              # Cấu hình TypeScript
└── README.md                  # Hướng dẫn sử dụng
```

**Giải thích một số thư mục chính:**

- `src/config/`: Quản lý các cấu hình liên quan đến môi trường, biến toàn cục.
- `src/constants/`: Định nghĩa các hằng số dùng chung toàn app.
- `src/data/`: Lưu trữ trạng thái các bài tập (đã làm, chưa làm, đang học).
- `src/resource/`: (Nếu có) chứa các tài nguyên bổ sung như file mẫu, test case, ...
- `src/services/`: Chứa các hàm/service làm việc với API, HTTP.
- `src/utils/`: Các hàm tiện ích, kiểu dữ liệu dùng chung.

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request để đóng góp.

## Thông tin giấy phép

Dự án này sử dụng giấy phép [ISC](./LICENSE):

> Copyright (c) 2025, dinhviethuy
>
> Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
>
> THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

**Ý nghĩa:**

- Bạn được phép sử dụng, sao chép, chỉnh sửa, phân phối dự án cho bất kỳ mục đích nào, miễn là giữ nguyên thông báo bản quyền và giấy phép này.
- Tác giả không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng phần mềm.

## Liên kết

- [GitHub Repository](https://github.com/dinhviethuy/Auto-Submit-CodePTIT)

## Hướng dẫn lấy COURSE_ID

Khi chạy ứng dụng lần đầu tiên (sau khi đã cấu hình tài khoản trong file `.env`), ứng dụng sẽ tự động sinh ra file `src/data/studying.json` chứa danh sách các lớp học mà tài khoản của bạn đang tham gia.

Ví dụ nội dung file `src/data/studying.json`:

```json
[
  {
    "id": 861,
    "name": "Cấu trúc dữ liệu và giải thuật",
    "code": "INT1306"
  },
  {
    "id": 950,
    "name": "Toán rời rạc 2",
    "code": "INT1359"
  }
]
```

**Cách lấy COURSE_ID:**

1. Chạy app lần đầu với lệnh:
   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```
2. Mở file `src/data/studying.json` vừa được tạo ra.
3. Xác định lớp học bạn muốn submit code (dựa vào trường `"name"` hoặc `"code"`).
4. Lấy giá trị `"id"` của lớp đó, ví dụ:
   - `"id": 861` cho lớp "Cấu trúc dữ liệu và giải thuật"
   - `"id": 950` cho lớp "Toán rời rạc 2"
5. Dán giá trị này vào biến `COURSE_ID` trong file `.env`:
   ```env
   COURSE_ID=861
   ```
6. Đặt file code của bạn vào thư mục `src` theo đúng định dạng tên file như hướng dẫn.
