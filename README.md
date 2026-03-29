# OrthoSurg PJI Advisor

Công cụ hỗ trợ quyết định lâm sàng dành cho bác sĩ phẫu thuật chỉnh hình, giúp chẩn đoán và điều trị **Nhiễm trùng khớp nhân tạo (PJI)** theo hướng dẫn **ICM 2018**.

## Tính năng

- Nhập thông tin bệnh nhân, tiền sử bệnh, tiền sử phẫu thuật
- Tự động phân loại **cấp tính / mãn tính** theo ngưỡng 21 ngày (ICM 2018)
- Nhập kết quả xét nghiệm huyết học, sinh hóa, dịch khớp, cấy khuẩn
- **Chẩn đoán AI** tự động tính điểm ICM 2018 và xác suất nhiễm trùng
- Biểu đồ theo dõi WBC, Neu%, ESR, CRP theo thời gian
- Khuyến nghị phác đồ kháng sinh dựa trên tác nhân gây bệnh (RAG)
- Giao diện tiếng Việt, responsive

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Framework | React 19 + TypeScript 5.8 |
| Build | Vite 7 |
| Routing | React Router DOM 7 (HashRouter) |
| Charts | Recharts 3 |
| Styling | Tailwind CSS 3 (CDN) + Material Symbols |
| Deploy | GitHub Pages (CI/CD via GitHub Actions) |

## Cài đặt & Chạy

```bash
# Clone repo
git clone https://github.com/hoangtung386/pji-clinical-decision-support-v2.git
cd pji-clinical-decision-support

# Cài dependencies
npm install

# Chạy dev server
npm run dev

# Build production
npm run build

# Preview bản build
npm run preview
```

## Cấu trúc thư mục

```
src/
├── App.tsx                        # Router setup
├── index.tsx                      # React DOM mount
│
├── types/                         # TypeScript interfaces
│   └── index.ts
│
├── lib/                           # Business logic (không phụ thuộc React)
│   ├── enums/                     # Enums: DiagnosisStatus, CultureStatus...
│   │   └── status.ts
│   ├── constants/
│   │   ├── thresholds.ts          # Ngưỡng ICM scoring, lab alerts
│   │   ├── labels/                # Vietnamese labels, UI options
│   │   │   ├── diagnosis.ts
│   │   │   ├── clinical.ts
│   │   │   ├── treatment.ts
│   │   │   ├── navigation.ts
│   │   │   └── themes.ts
│   │   └── defaults/              # Default data theo domain
│   │       ├── demographics.ts
│   │       ├── clinical.ts
│   │       ├── lab.ts
│   │       └── treatment.ts
│   └── utils/                     # Pure functions (dễ unit test)
│       ├── bmiCalculator.ts       # Tính BMI
│       ├── dateUtils.ts           # Phân loại cấp/mãn tính
│       ├── icmScoring.ts          # Thuật toán chấm điểm ICM 2018
│       ├── testStatusChecker.ts   # So sánh kết quả vs chỉ số bình thường
│       ├── treatmentEngine.ts     # Khuyến nghị phác đồ kháng sinh
│       └── idGenerator.ts         # Tạo ID unique
│
├── store/                         # State management
│   └── PatientContext.tsx          # React Context cho toàn bộ patient data
│
├── components/                    # Reusable UI components
│   ├── common/
│   │   ├── PageHeader.tsx         # Header với progress bar
│   │   ├── PageFooter.tsx         # Footer navigation (Back/Next)
│   │   ├── SectionCard.tsx        # Card wrapper cho mỗi section
│   │   ├── TestTable.tsx          # Bảng xét nghiệm tái sử dụng
│   │   ├── TestSectionHeader.tsx  # Header màu cho từng loại xét nghiệm
│   │   └── ImageTypeModal.tsx     # Modal chọn loại hình ảnh
│   └── layout/
│       └── Layout.tsx             # Sidebar + main content
│
├── features/                      # Feature modules (mỗi module tự chứa)
│   ├── patient-intake/            # Bước 1: Thông tin bệnh nhân
│   │   ├── components/
│   │   │   └── PatientIntakePage.tsx
│   │   └── hooks/
│   │       └── usePatientForm.ts
│   │
│   ├── medical-history/           # Bước 2: Tiền sử bệnh
│   │   ├── components/
│   │   │   ├── MedicalHistoryPage.tsx
│   │   │   ├── CharacteristicsTable.tsx
│   │   │   └── SurgicalHistoryTable.tsx
│   │   └── hooks/
│   │       └── useMedicalHistoryForm.ts
│   │
│   ├── clinical-assessment/       # Bước 3: Lâm sàng & cận lâm sàng
│   │   ├── components/
│   │   │   ├── ClinicalAssessmentPage.tsx
│   │   │   ├── OnsetSection.tsx
│   │   │   ├── SymptomsSection.tsx
│   │   │   ├── PjiTestsSection.tsx
│   │   │   ├── OtherTestsSection.tsx
│   │   │   ├── CultureSamplesInput.tsx
│   │   │   ├── GramStainInput.tsx
│   │   │   ├── ImagingSection.tsx
│   │   │   └── DiagnosisPanel.tsx
│   │   └── hooks/
│   │       └── useDiagnosis.ts
│   │
│   ├── lab-analytics/             # Bước 4: Kết quả xét nghiệm
│   │   ├── components/
│   │   │   ├── LabAnalyticsPage.tsx
│   │   │   ├── LabDataTable.tsx
│   │   │   └── LabChart.tsx
│   │   └── index.ts
│   │
│   └── treatment-plan/            # Bước 5: Phác đồ điều trị
│       ├── components/
│       │   ├── TreatmentPlanPage.tsx
│       │   ├── ClinicalInputs.tsx
│       │   ├── TreatmentTimeline.tsx
│       │   └── RagCitation.tsx
│       └── hooks/
│           └── useTreatmentEffect.ts
│
└── styles/
    └── index.css                  # Global styles + scrollbar
```

## Quy trình lâm sàng (5 bước)

| Bước | Trang | Mô tả |
|------|-------|-------|
| 1 | Thông tin bệnh nhân | Nhập họ tên, MRN, ngày sinh, chiều cao/cân nặng (tự tính BMI) |
| 2 | Tiền sử bệnh | Quá trình bệnh lý, đặc điểm liên quan, tiền sử phẫu thuật |
| 3 | Lâm sàng & cận lâm sàng | Triệu chứng, xét nghiệm PJI, cấy khuẩn, hình ảnh, AI chẩn đoán |
| 4 | Kết quả xét nghiệm | Nhập WBC/Neu/ESR/CRP theo timeline, biểu đồ trend |
| 5 | Phác đồ điều trị | Chọn tác nhân gây bệnh, xem khuyến nghị kháng sinh + trích dẫn |

## Nguyên tắc kiến trúc

- **Feature-based structure**: Mỗi feature module tự chứa (components + hooks + index)
- **Business logic tách khỏi UI**: Tất cả logic nằm trong `lib/utils/` dưới dạng pure functions
- **Constants tập trung**: Không hardcode magic numbers/strings trong components
- **Reusable components**: Các component dùng chung nằm trong `components/common/`
- **Barrel exports**: Mỗi module có `index.ts` để import gọn
- **Type safety**: Strict TypeScript, enums thay cho string literals, không `any`
- **Max ~130 dòng/file**: Dễ đọc, dễ review, dễ phân chia công việc

## Phân công phát triển

Codebase được tổ chức để nhiều developer có thể làm việc song song:

| Nhóm | Phạm vi | Files |
|------|---------|-------|
| Patient Intake | `features/patient-intake/` | 2 files |
| Medical History | `features/medical-history/` | 4 files |
| Clinical Assessment | `features/clinical-assessment/` | 10 files |
| Lab Analytics | `features/lab-analytics/` | 3 files |
| Treatment Plan | `features/treatment-plan/` | 5 files |
| Shared Components | `components/common/` | 6 files |
| Business Logic | `lib/utils/` | 6 files |
| Data & Types | `lib/constants/` + `types/` | 12 files |

## License

MIT License - Copyright (c) 2026 Le Vu Hoang Tung & Claude Code Opus 4.6. See [LICENSE](LICENSE) for details.
