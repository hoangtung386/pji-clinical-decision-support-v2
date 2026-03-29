"""ICM 2018 scoring algorithm - server-side implementation."""

ACUTE_CHRONIC_DAYS = 21
SCORE_INFECTED_MIN = 6
SCORE_INCONCLUSIVE_MIN = 4
MIN_POSITIVE_CULTURES = 2


def calculate_days_between(date_a: str, date_b: str) -> int:
    from datetime import date as dt_date

    a = dt_date.fromisoformat(str(date_a))
    b = dt_date.fromisoformat(str(date_b))
    return abs((b - a).days)


def is_acute_infection(surgery_date: str, symptom_date: str) -> bool:
    if not surgery_date or not symptom_date:
        return False
    return calculate_days_between(surgery_date, symptom_date) < ACUTE_CHRONIC_DAYS


def calculate_bmi(height_cm: float, weight_kg: float) -> float:
    if height_cm <= 0 or weight_kg <= 0:
        return 0.0
    height_m = height_cm / 100
    return round(weight_kg / (height_m * height_m), 1)


def calculate_diagnosis(
    symptoms: dict,
    major_criteria: dict,
    culture_samples: list[dict],
) -> dict:
    # Major criteria: sinus tract or 2 positive cultures checkbox
    if symptoms.get("sinus_tract") or major_criteria.get("two_positive_cultures"):
        return {
            "score": 99,
            "probability": 100.0,
            "status": "Infected",
            "reasoning": [
                "Tiêu chuẩn chính: Đường rò hoặc 2 mẫu cấy dương tính"
            ],
        }

    # Check culture samples (>= 2 positive with bacteria name)
    positive_cultures = [
        s
        for s in culture_samples
        if s.get("status") == "positive" and (s.get("bacteria_name") or "").strip()
    ]

    if len(positive_cultures) >= MIN_POSITIVE_CULTURES:
        unique_bacteria = list({s["bacteria_name"] for s in positive_cultures})
        return {
            "score": 99,
            "probability": 95.0,
            "status": "Infected",
            "reasoning": [
                f"Tiêu chuẩn chính: {len(positive_cultures)} mẫu cấy khuẩn dương tính",
                f"Vi khuẩn: {', '.join(unique_bacteria)}",
            ],
        }

    # Minor criteria scoring
    score = 0
    reasoning: list[str] = []

    if score >= SCORE_INFECTED_MIN:
        status = "Infected"
        probability = 95.0
    elif score >= SCORE_INCONCLUSIVE_MIN:
        status = "Inconclusive"
        probability = 65.0
    else:
        status = "Not Infected"
        probability = 15.0

    probability = min(99.0, max(5.0, (score / 10) * 100))

    return {
        "score": score,
        "probability": probability,
        "status": status,
        "reasoning": reasoning,
    }


def get_treatment_recommendation(pathogen: str) -> dict:
    recommendations = {
        "mrsa": {
            "iv_drug": "Daptomycin",
            "iv_dosage": "6-8 mg/kg IV",
            "iv_duration": "2-4 tuần",
            "oral_drug": "Rifampin + Ciprofloxacin",
            "citation": (
                '"Đối với PJI do MRSA khi MIC Vancomycin > 1.5 mcg/mL, '
                "Daptomycin được khuyến cáo là thuốc tiêm tĩnh mạch chính "
                'để tránh thất bại điều trị."'
            ),
        },
        "mssa": {
            "iv_drug": "Cefazolin",
            "iv_dosage": "2g IV mỗi 8 giờ",
            "iv_duration": "2 tuần",
            "oral_drug": "Rifampin + Levofloxacin",
            "citation": (
                '"Đối với PJI do MSSA, Cefazolin hoặc Nafcillin là tiêu chuẩn vàng. '
                'Rifampin được thêm vào để tác động lên màng sinh học."'
            ),
        },
    }

    default = {
        "iv_drug": "Vancomycin + Cefepime",
        "iv_dosage": "Phác đồ phổ rộng",
        "iv_duration": "4-6 tuần",
        "oral_drug": "Chờ kháng sinh đồ",
        "citation": (
            '"Đối với PJI cấy âm tính, cần bao phủ phổ rộng gồm MRSA '
            'và vi khuẩn Gram âm cho đến khi xác định được vi sinh vật."'
        ),
    }

    return recommendations.get(pathogen, default)
