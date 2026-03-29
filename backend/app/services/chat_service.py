"""
RAG-ready chat service for clinical case discussion.

This module builds structured patient context (JSON) for the chatbot
microservice and provides a local fallback for rule-based responses.
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.patient import Patient
from app.models.clinical import ClinicalAssessment


async def build_patient_context(db: AsyncSession, patient_id: int) -> dict:
    """Build structured JSON of the full patient case for chatbot service."""
    result = await db.execute(
        select(Patient)
        .options(
            selectinload(Patient.clinical_assessment).selectinload(ClinicalAssessment.test_results),
            selectinload(Patient.clinical_assessment).selectinload(ClinicalAssessment.culture_samples),
            selectinload(Patient.lab_results),
            selectinload(Patient.treatment_plan),
        )
        .where(Patient.id == patient_id)
    )
    patient = result.scalar_one_or_none()
    if not patient:
        return {}

    # Demographics
    context: dict = {
        "demographics": {
            "mrn": patient.mrn,
            "name": patient.name,
            "dob": str(patient.dob) if patient.dob else None,
            "gender": patient.gender,
            "phone": patient.phone,
            "address": patient.address,
            "height": patient.height,
            "weight": patient.weight,
            "bmi": patient.bmi,
            "surgery_date": str(patient.surgery_date) if patient.surgery_date else None,
            "symptom_date": str(patient.symptom_date) if patient.symptom_date else None,
            "is_acute": patient.is_acute,
            "implant_type": patient.implant_type.value if patient.implant_type else None,
            "fixation_type": patient.fixation_type,
            "implant_nature": patient.implant_nature.value if patient.implant_nature else None,
            "comorbidities": patient.comorbidities or {},
            "medical_history": patient.medical_history,
            "past_medical_history": patient.past_medical_history,
            "related_characteristics": patient.related_characteristics or {},
            "surgical_history": patient.surgical_history or [],
        },
    }

    # Clinical assessment
    ca = patient.clinical_assessment
    if ca:
        # Group test results by category
        test_groups: dict[str, list] = {
            "hematology": [],
            "biochemistry": [],
            "fluid": [],
            "other": [],
            "fluid_analysis": [],
        }
        for t in ca.test_results:
            cat = t.category.value if hasattr(t.category, 'value') else t.category
            if cat in test_groups:
                test_groups[cat].append({
                    "name": t.name,
                    "result": t.result,
                    "normal_range": t.normal_range,
                    "unit": t.unit,
                })

        context["clinical_assessment"] = {
            "symptoms": ca.symptoms or {},
            "major_criteria": ca.major_criteria or {},
            "imaging_description": ca.imaging_description,
            "test_results": test_groups,
            "culture_samples": [
                {
                    "sample_number": c.sample_number,
                    "status": c.status.value if hasattr(c.status, 'value') else c.status,
                    "bacteria_name": c.bacteria_name or "",
                }
                for c in ca.culture_samples
            ],
            "diagnosis": {
                "score": ca.diagnosis_score,
                "probability": ca.diagnosis_probability,
                "status": ca.diagnosis_status.value if hasattr(ca.diagnosis_status, 'value') else ca.diagnosis_status,
                "reasoning": ca.diagnosis_reasoning or [],
            },
        }

    # Lab results
    if patient.lab_results:
        context["lab_results"] = [
            {
                "day": lab.day,
                "wbc": lab.wbc,
                "neu": lab.neu,
                "esr": lab.esr,
                "crp": lab.crp,
            }
            for lab in patient.lab_results
        ]

    # Treatment plan
    tp = patient.treatment_plan
    if tp:
        context["treatment_plan"] = {
            "pathogen": tp.pathogen,
            "resistance": tp.resistance,
            "iv_drug": tp.iv_drug,
            "iv_dosage": tp.iv_dosage,
            "iv_duration": tp.iv_duration,
            "oral_drug": tp.oral_drug,
            "oral_dosage": tp.oral_dosage,
            "oral_duration": tp.oral_duration,
            "citation": tp.citation,
            "confidence": tp.confidence,
        }

    return context


def _context_to_text(context: dict) -> str:
    """Convert structured context to readable text for rule-based fallback."""
    if not context:
        return ""

    lines = []
    d = context.get("demographics", {})
    lines.append(f"Mã BN: {d.get('mrn', '?')}, Tên: {d.get('name', '?')}")
    lines.append(f"Vị trí: {d.get('implant_type', '?')} ({d.get('implant_nature', '?')})")
    lines.append(f"Phân loại: {'Cấp tính' if d.get('is_acute') else 'Mãn tính'}")

    ca = context.get("clinical_assessment", {})
    if ca:
        diag = ca.get("diagnosis", {})
        lines.append(f"Chẩn đoán: {diag.get('status', '?')} ({diag.get('probability', 0)}%)")

    return "\n".join(lines)


async def generate_response(
    message: str,
    patient_context: dict,
    history: list[dict],
) -> dict:
    """
    Local rule-based fallback when external chatbot service is unavailable.

    *** To integrate your RAG chatbot, configure CHATBOT_SERVICE_URL ***
    *** in environment variables. This function is only the fallback. ***
    """
    msg_lower = message.lower()
    context_text = _context_to_text(patient_context)
    sources: list[str] = []
    context_used = bool(patient_context)

    if not patient_context:
        return {
            "reply": (
                "Hiện chưa có ca bệnh nào được chọn. "
                "Vui lòng quay lại trang chủ, chọn hoặc tạo một ca bệnh, "
                "sau đó quay lại đây để trao đổi."
            ),
            "sources": [],
            "context_used": False,
        }

    diag = patient_context.get("clinical_assessment", {}).get("diagnosis", {})
    is_infected = diag.get("status") == "Infected"
    is_acute = patient_context.get("demographics", {}).get("is_acute", False)

    if any(kw in msg_lower for kw in ["chẩn đoán", "diagnosis", "nhiễm trùng", "pji"]):
        if is_infected:
            reasoning = diag.get("reasoning", [])
            reply = (
                f"Dựa trên dữ liệu ca bệnh, hệ thống phát hiện **các tiêu chuẩn chính** "
                f"của nhiễm trùng khớp nhân tạo theo ICM 2018 "
                f"(xác suất: {diag.get('probability', 0)}%).\n\n"
            )
            if reasoning:
                reply += "**Lý do:**\n"
                for r in reasoning:
                    reply += f"- {r}\n"
            reply += "\nKhuyến nghị tiến hành điều trị kháng sinh ngay."
            sources = ["ICM 2018 Consensus Guidelines", "AAOS Clinical Practice Guidelines"]
        else:
            reply = (
                "Hiện tại chưa đủ tiêu chuẩn để chẩn đoán nhiễm trùng khớp nhân tạo "
                f"(điểm ICM: {diag.get('score', 0)}).\n\n"
                "Cần theo dõi sát và có thể bổ sung thêm xét nghiệm."
            )
            sources = ["ICM 2018 Consensus Guidelines"]

    elif any(kw in msg_lower for kw in ["điều trị", "kháng sinh", "treatment", "thuốc"]):
        tp = patient_context.get("treatment_plan", {})
        reply = "Theo hướng dẫn ICM 2018, phác đồ điều trị hiện tại:\n\n"
        if tp:
            reply += f"**Giai đoạn 1 (IV):** {tp.get('iv_drug', '?')} - {tp.get('iv_dosage', '?')} ({tp.get('iv_duration', '?')})\n"
            reply += f"**Giai đoạn 2 (Uống):** {tp.get('oral_drug', '?')} - {tp.get('oral_dosage', '?')} ({tp.get('oral_duration', '?')})\n"
        if is_acute:
            reply += "\nCa bệnh **cấp tính** - xem xét DAIR nếu trong 3 tuần đầu."
        else:
            reply += "\nCa bệnh **mãn tính** - cân nhắc thay khớp hai thì."
        sources = ["ICM 2018 Consensus Guidelines", "IDSA Guidelines for PJI Management"]

    elif any(kw in msg_lower for kw in ["xét nghiệm", "lab", "crp", "wbc", "esr"]):
        labs = patient_context.get("lab_results", [])
        reply = "**Bảng ngưỡng PJI theo ICM 2018:**\n\n"
        reply += "| Chỉ số | Ngưỡng cấp | Ngưỡng mãn |\n|--------|-----------|------------|\n"
        reply += "| WBC (máu) | > 10 x10⁹/L | Bình thường |\n"
        reply += "| CRP | > 100 mg/L | > 10 mg/L |\n"
        reply += "| ESR | > 30 mm/hr | > 30 mm/hr |\n\n"
        if labs:
            reply += "**Kết quả ca bệnh:**\n"
            for lab in labs:
                vals = []
                if lab.get("wbc") is not None:
                    vals.append(f"WBC={lab['wbc']}")
                if lab.get("crp") is not None:
                    vals.append(f"CRP={lab['crp']}")
                if vals:
                    reply += f"- {lab['day']}: {', '.join(vals)}\n"
        sources = ["ICM 2018 - Serum Markers", "AAOS PJI Diagnostic Guidelines"]

    elif any(kw in msg_lower for kw in ["tóm tắt", "summary", "tổng quan"]):
        d = patient_context.get("demographics", {})
        reply = f"**Tóm tắt ca bệnh #{d.get('mrn', '?')} - {d.get('name', '?')}**\n\n"
        reply += f"- Giới tính: {'Nam' if d.get('gender') == 'male' else 'Nữ'}, "
        reply += f"BMI: {d.get('bmi', 0)}\n"
        reply += f"- Vị trí: {d.get('implant_type', '?')} ({d.get('implant_nature', '?')})\n"
        reply += f"- Phân loại: {'**Cấp tính**' if is_acute else '**Mãn tính**'}\n"
        if diag:
            reply += f"- Chẩn đoán: **{diag.get('status', '?')}** ({diag.get('probability', 0)}%)\n"
        if d.get("medical_history"):
            reply += f"\n**Bệnh lý:** {d['medical_history']}\n"
        sources = []

    else:
        reply = (
            "Tôi là trợ lý AI chuyên về **Nhiễm trùng khớp nhân tạo (PJI)**. "
            "Tôi có thể giúp bạn về:\n\n"
            "- 🔬 **Chẩn đoán** - Phân tích tiêu chuẩn ICM 2018\n"
            "- 💊 **Điều trị** - Khuyến nghị phác đồ kháng sinh\n"
            "- 📊 **Xét nghiệm** - Đánh giá kết quả lab\n"
            "- 📋 **Tóm tắt** - Tổng quan ca bệnh hiện tại\n\n"
            "Hãy đặt câu hỏi cụ thể!"
        )
        sources = []

    return {"reply": reply, "sources": sources, "context_used": context_used}
