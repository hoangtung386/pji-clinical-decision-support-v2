"""
RAG-ready chat service for clinical case discussion.

This module provides the interface for AI-powered chat about patient cases.
Currently uses rule-based responses. Replace the `generate_response` function
with your RAG pipeline (e.g., LangChain + vector DB + LLM) to enable
intelligent clinical discussions.

Integration points for RAG:
1. Replace `generate_response()` with your LLM call
2. Add vector store retrieval in `_build_context()`
3. Connect to your embedding model for document search
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.patient import Patient
from app.models.clinical import ClinicalAssessment
from app.models.lab import LabResult
from app.models.treatment import TreatmentPlan


async def build_patient_context(db: AsyncSession, patient_id: int) -> str:
    """Build a text summary of the patient case for RAG context."""
    result = await db.execute(
        select(Patient)
        .options(
            selectinload(Patient.clinical_assessment),
            selectinload(Patient.lab_results),
            selectinload(Patient.treatment_plan),
        )
        .where(Patient.id == patient_id)
    )
    patient = result.scalar_one_or_none()
    if not patient:
        return ""

    lines = [
        f"=== HỒ SƠ BỆNH NHÂN ===",
        f"Mã BN: {patient.mrn}",
        f"Họ tên: {patient.name}",
        f"Ngày sinh: {patient.dob}",
        f"Giới tính: {'Nam' if patient.gender == 'male' else 'Nữ'}",
        f"BMI: {patient.bmi}",
        f"Vị trí: {patient.implant_type} ({patient.implant_nature})",
        f"Phân loại: {'Cấp tính' if patient.is_acute else 'Mãn tính'}",
    ]

    if patient.surgery_date:
        lines.append(f"Ngày phẫu thuật: {patient.surgery_date}")
    if patient.symptom_date:
        lines.append(f"Ngày khởi phát: {patient.symptom_date}")

    if patient.medical_history:
        lines.append(f"\nQuá trình bệnh lý: {patient.medical_history}")
    if patient.past_medical_history:
        lines.append(f"Tiền sử bệnh: {patient.past_medical_history}")

    # Comorbidities
    comorbidities = patient.comorbidities or {}
    active = [k for k, v in comorbidities.items() if v]
    if active:
        labels = {
            "diabetes": "Đái tháo đường",
            "smoking": "Hút thuốc",
            "immunosuppression": "Suy giảm miễn dịch",
            "prior_infection": "Tiền sử nhiễm trùng",
            "malnutrition": "Suy dinh dưỡng",
            "liver_disease": "Bệnh gan",
        }
        names = [labels.get(k, k) for k in active]
        lines.append(f"Bệnh nền: {', '.join(names)}")

    # Clinical assessment
    ca = patient.clinical_assessment
    if ca:
        lines.append(f"\n=== ĐÁNH GIÁ LÂM SÀNG ===")
        symptoms = ca.symptoms or {}
        active_symptoms = [k for k, v in symptoms.items() if v]
        symptom_labels = {
            "fever": "Sốt", "sinus_tract": "Đường rò", "pain": "Đau",
            "swelling": "Sưng nề", "drainage": "Chảy dịch",
        }
        if active_symptoms:
            names = [symptom_labels.get(s, s) for s in active_symptoms]
            lines.append(f"Triệu chứng: {', '.join(names)}")

        lines.append(f"Chẩn đoán: {ca.diagnosis_status} (xác suất {ca.diagnosis_probability}%)")
        if ca.diagnosis_reasoning:
            for r in ca.diagnosis_reasoning:
                lines.append(f"  - {r}")

        if ca.imaging_description:
            lines.append(f"Hình ảnh: {ca.imaging_description}")

    # Lab results
    if patient.lab_results:
        lines.append(f"\n=== KẾT QUẢ XÉT NGHIỆM ===")
        for lab in patient.lab_results:
            vals = []
            if lab.wbc is not None:
                vals.append(f"WBC={lab.wbc}")
            if lab.neu is not None:
                vals.append(f"Neu={lab.neu}%")
            if lab.esr is not None:
                vals.append(f"ESR={lab.esr}")
            if lab.crp is not None:
                vals.append(f"CRP={lab.crp}")
            if vals:
                lines.append(f"  {lab.day}: {', '.join(vals)}")

    # Treatment
    tp = patient.treatment_plan
    if tp:
        lines.append(f"\n=== PHÁC ĐỒ ĐIỀU TRỊ ===")
        lines.append(f"Tác nhân: {tp.pathogen}")
        if tp.iv_drug:
            lines.append(f"IV: {tp.iv_drug} ({tp.iv_dosage}) - {tp.iv_duration}")
        if tp.oral_drug:
            lines.append(f"Uống: {tp.oral_drug} ({tp.oral_dosage}) - {tp.oral_duration}")

    return "\n".join(lines)


async def generate_response(
    message: str,
    patient_context: str,
    history: list[dict],
) -> dict:
    """
    Generate AI response for clinical discussion.

    *** RAG INTEGRATION POINT ***
    Replace this function with your RAG pipeline:

    Example with LangChain:
    ```python
    from langchain.chains import ConversationalRetrievalChain
    from langchain.vectorstores import Chroma
    from langchain.llms import OpenAI

    vectorstore = Chroma(persist_directory="./chroma_db")
    retriever = vectorstore.as_retriever()
    chain = ConversationalRetrievalChain.from_llm(
        llm=OpenAI(),
        retriever=retriever,
    )
    result = chain({"question": message, "chat_history": history})
    return {
        "reply": result["answer"],
        "sources": [doc.metadata["source"] for doc in result["source_documents"]],
    }
    ```
    """

    # Current: rule-based placeholder responses
    msg_lower = message.lower()
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

    # Extract key info from context for responses
    is_infected = "Infected" in patient_context
    is_acute = "Cấp tính" in patient_context

    if any(kw in msg_lower for kw in ["chẩn đoán", "diagnosis", "nhiễm trùng", "pji"]):
        if is_infected:
            reply = (
                "Dựa trên dữ liệu ca bệnh hiện tại, hệ thống phát hiện **các tiêu chuẩn chính** "
                "của nhiễm trùng khớp nhân tạo theo ICM 2018. "
                "Khuyến nghị tiến hành điều trị kháng sinh ngay và cân nhắc phẫu thuật can thiệp.\n\n"
                "Bạn có muốn tôi phân tích chi tiết hơn về các tiêu chuẩn chẩn đoán không?"
            )
            sources = ["ICM 2018 Consensus Guidelines", "AAOS Clinical Practice Guidelines"]
        else:
            reply = (
                "Hiện tại chưa đủ tiêu chuẩn để chẩn đoán nhiễm trùng khớp nhân tạo. "
                "Tuy nhiên, cần theo dõi sát và có thể bổ sung thêm xét nghiệm.\n\n"
                "Bạn muốn tôi gợi ý xét nghiệm bổ sung nào?"
            )
            sources = ["ICM 2018 Consensus Guidelines"]

    elif any(kw in msg_lower for kw in ["điều trị", "kháng sinh", "treatment", "thuốc"]):
        reply = (
            "Theo hướng dẫn ICM 2018, phác đồ điều trị PJI phụ thuộc vào:\n"
            "1. **Tác nhân gây bệnh** (MRSA, MSSA, cấy âm tính)\n"
            "2. **Phân loại** (cấp tính vs mãn tính)\n"
            "3. **Tình trạng khớp** và khả năng bảo tồn dụng cụ\n\n"
        )
        if is_acute:
            reply += (
                "Ca bệnh này là **cấp tính** - có thể xem xét DAIR "
                "(Debridement, Antibiotics, Implant Retention) nếu trong 3 tuần đầu."
            )
        else:
            reply += (
                "Ca bệnh này là **mãn tính** - thường cần thay khớp hai thì "
                "(two-stage revision) kết hợp kháng sinh dài hạn."
            )
        sources = [
            "ICM 2018 Consensus Guidelines",
            "IDSA Guidelines for PJI Management",
        ]

    elif any(kw in msg_lower for kw in ["xét nghiệm", "lab", "crp", "wbc", "esr"]):
        reply = (
            "Các chỉ số xét nghiệm quan trọng trong chẩn đoán PJI:\n\n"
            "| Chỉ số | Ngưỡng PJI cấp | Ngưỡng PJI mãn |\n"
            "|--------|----------------|----------------|\n"
            "| WBC (máu) | > 10 x10⁹/L | Bình thường |\n"
            "| CRP | > 100 mg/L | > 10 mg/L |\n"
            "| ESR | > 30 mm/hr | > 30 mm/hr |\n"
            "| WBC (dịch khớp) | > 10,000 cells/µL | > 3,000 cells/µL |\n"
            "| PMN% (dịch khớp) | > 90% | > 80% |\n\n"
            "Bạn có muốn tôi phân tích kết quả xét nghiệm cụ thể của ca bệnh này không?"
        )
        sources = [
            "ICM 2018 - Serum Markers",
            "AAOS PJI Diagnostic Guidelines",
        ]

    elif any(kw in msg_lower for kw in ["tóm tắt", "summary", "tổng quan"]):
        reply = f"Đây là tóm tắt ca bệnh hiện tại:\n\n```\n{patient_context}\n```"
        sources = []

    else:
        reply = (
            "Tôi là trợ lý AI chuyên về nhiễm trùng khớp nhân tạo (PJI). "
            "Tôi có thể giúp bạn về:\n\n"
            "- 🔬 **Chẩn đoán** - Phân tích tiêu chuẩn ICM 2018\n"
            "- 💊 **Điều trị** - Khuyến nghị phác đồ kháng sinh\n"
            "- 📊 **Xét nghiệm** - Đánh giá kết quả lab\n"
            "- 📋 **Tóm tắt** - Tổng quan ca bệnh hiện tại\n\n"
            "Hãy đặt câu hỏi cụ thể để tôi hỗ trợ tốt hơn!"
        )
        sources = []

    return {"reply": reply, "sources": sources, "context_used": context_used}
