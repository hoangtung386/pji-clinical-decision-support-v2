export enum DiagnosisStatus {
  INFECTED = 'Infected',
  INCONCLUSIVE = 'Inconclusive',
  NOT_INFECTED = 'Not Infected',
}

export enum CultureStatus {
  NEGATIVE = 'negative',
  POSITIVE = 'positive',
}

export enum TestResultFlag {
  HIGH = 'H',
  LOW = 'L',
}

export enum ImplantType {
  THA = 'THA',
  TKA = 'TKA',
}

export enum ImplantNature {
  PRIMARY = 'Primary',
  REVISION = 'Revision',
}

export enum ImageType {
  X_RAY = 'X-ray',
  CT = 'CT',
  ULTRASOUND = 'Ultrasound',
}

export enum PathogenType {
  MRSA = 'mrsa',
  MSSA = 'mssa',
  CULTURE_NEGATIVE = 'culture_negative',
}
