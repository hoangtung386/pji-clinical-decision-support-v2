from app.services.icm_scoring import (
    calculate_bmi,
    calculate_diagnosis,
    get_treatment_recommendation,
    is_acute_infection,
)


class TestCalculateBmi:
    def test_normal_bmi(self):
        assert calculate_bmi(175, 70) == 22.9

    def test_zero_height(self):
        assert calculate_bmi(0, 70) == 0.0

    def test_zero_weight(self):
        assert calculate_bmi(175, 0) == 0.0

    def test_negative_values(self):
        assert calculate_bmi(-175, 70) == 0.0


class TestIsAcuteInfection:
    def test_acute_within_21_days(self):
        assert is_acute_infection("2026-01-01", "2026-01-15") is True

    def test_chronic_over_21_days(self):
        assert is_acute_infection("2026-01-01", "2026-02-15") is False

    def test_exactly_21_days(self):
        assert is_acute_infection("2026-01-01", "2026-01-22") is False

    def test_empty_dates(self):
        assert is_acute_infection("", "2026-01-15") is False


class TestCalculateDiagnosis:
    def test_major_criteria_sinus_tract(self):
        result = calculate_diagnosis(
            symptoms={"sinus_tract": True},
            major_criteria={},
            culture_samples=[],
        )
        assert result["status"] == "Infected"
        assert result["probability"] == 100.0

    def test_major_criteria_two_positive_cultures_checkbox(self):
        result = calculate_diagnosis(
            symptoms={},
            major_criteria={"two_positive_cultures": True},
            culture_samples=[],
        )
        assert result["status"] == "Infected"

    def test_two_positive_culture_samples(self):
        samples = [
            {"status": "positive", "bacteria_name": "S. aureus"},
            {"status": "positive", "bacteria_name": "S. aureus"},
            {"status": "negative", "bacteria_name": ""},
        ]
        result = calculate_diagnosis(
            symptoms={}, major_criteria={}, culture_samples=samples
        )
        assert result["status"] == "Infected"
        assert result["probability"] == 95.0

    def test_no_criteria_met(self):
        result = calculate_diagnosis(
            symptoms={}, major_criteria={}, culture_samples=[]
        )
        assert result["status"] == "Not Infected"

    def test_one_positive_culture_not_enough(self):
        samples = [
            {"status": "positive", "bacteria_name": "E. coli"},
            {"status": "negative", "bacteria_name": ""},
        ]
        result = calculate_diagnosis(
            symptoms={}, major_criteria={}, culture_samples=samples
        )
        assert result["status"] == "Not Infected"


class TestGetTreatmentRecommendation:
    def test_mrsa(self):
        rec = get_treatment_recommendation("mrsa")
        assert rec["iv_drug"] == "Daptomycin"

    def test_mssa(self):
        rec = get_treatment_recommendation("mssa")
        assert rec["iv_drug"] == "Cefazolin"

    def test_culture_negative(self):
        rec = get_treatment_recommendation("culture_negative")
        assert "Vancomycin" in rec["iv_drug"]

    def test_unknown_pathogen(self):
        rec = get_treatment_recommendation("unknown")
        assert "Vancomycin" in rec["iv_drug"]
