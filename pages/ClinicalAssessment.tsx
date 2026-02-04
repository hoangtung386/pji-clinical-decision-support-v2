import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatient } from '../context/PatientContext';

export const ClinicalAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { demographics, setDemographics, clinical, setClinical } = usePatient();

  // Logic: ICM 2018 Scoring
  useEffect(() => {
    let score = 0;
    const reasoning: string[] = [];

    // Major Criteria (Immediate Infection)
    if (clinical.symptoms.sinusTract || clinical.major.twoPositiveCultures) {
      setClinical(prev => ({
        ...prev,
        diagnosis: { score: 99, probability: 100, status: 'Infected', reasoning: ['Tiêu chuẩn chính: Đường rò hoặc 2 mẫu cấy dương tính'] }
      }));
      return;
    }

    // Minor Criteria Scoring
    // 1. Serology (Mocked as if we have access to high ESR/CRP)
    // Assume high ESR/CRP based on mock lab data context (adding points for demo purposes)
    score += 2; // CRP > 10
    reasoning.push('CRP tăng cao (>10 mg/L) [+2]');

    // 2. Synovial WBC
    // Acute threshold > 10,000, Chronic > 3,000
    const wbcThreshold = demographics.isAcute ? 10000 : 3000;
    if (clinical.synovial.wbc > wbcThreshold) {
      score += 3;
      reasoning.push(`Bạch cầu dịch khớp > ${wbcThreshold} [+3]`);
    }

    // 3. PMN %
    const pmnThreshold = demographics.isAcute ? 90 : 80; // Slide 13 ref says >90 (acute) / >70 or 80 (chronic) usually
    if (clinical.synovial.pmn > pmnThreshold) {
      score += 2;
      reasoning.push(`% Bạch cầu đa nhân > ${pmnThreshold}% [+2]`);
    }

    // 4. Alpha Defensin (simplified)
    if (clinical.synovial.alphaDefensin === 'Positive') {
      score += 3;
      reasoning.push('Alpha-defensin Dương tính [+3]');
    }

    // 5. LE
    if (clinical.synovial.leukocyteEsterase === '2+' || clinical.synovial.leukocyteEsterase === '3+') {
      score += 3;
      reasoning.push('Leukocyte Esterase ++ [+3]');
    }

    // Status Determination
    let status: 'Infected' | 'Inconclusive' | 'Not Infected' = 'Not Infected';
    let probability = 0;

    if (score >= 6) {
      status = 'Infected';
      probability = 95;
    } else if (score >= 4) {
      status = 'Inconclusive';
      probability = 65;
    } else {
      status = 'Not Infected';
      probability = 15;
    }

    // Adjust probability visually based on score
    probability = Math.min(99, Math.max(5, (score / 10) * 100));

    setClinical(prev => ({
      ...prev,
      diagnosis: { score, probability, status, reasoning }
    }));

  }, [clinical.symptoms, clinical.major, clinical.synovial, demographics.isAcute, setClinical]);

  const getStatusColor = (status: string) => {
    if (status === 'Infected') return 'text-danger';
    if (status === 'Inconclusive') return 'text-warning';
    return 'text-success';
  };

  const getStatusText = (status: string) => {
    if (status === 'Infected') return 'Nhiễm trùng';
    if (status === 'Inconclusive') return 'Chưa xác định';
    return 'Không nhiễm trùng';
  }

  const getStatusTextDetailed = (status: string) => {
    if (status === 'Infected') return 'Nguy cơ cao PJI';
    if (status === 'Inconclusive') return 'Chưa xác định';
    return 'Không nhiễm trùng';
  }


  return (
    <>
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between z-10">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">{demographics.name}</h2>
            <span className="text-slate-400 text-sm font-mono bg-slate-100 px-2 py-0.5 rounded">ID #{demographics.mrn}</span>
          </div>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">calendar_today</span> Ngày sinh: {demographics.dob}
            <span className="text-slate-300 mx-1">|</span>
            <span className="material-symbols-outlined text-sm">accessibility_new</span> Vị trí: {demographics.implantType} ({demographics.implantNature})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/labs')} className="flex items-center justify-center gap-2 px-5 h-10 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-lg shadow-md transition-all">
            Tạo báo cáo
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* LEFT COLUMN: INPUTS */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 pb-20">

              {/* 0. Current Status */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">0</span>
                    Ngày khởi phát bệnh
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-slate-700">Ngày khởi phát triệu chứng</span>
                    <input
                      type="date"
                      value={demographics.symptomDate}
                      onChange={(e) => setDemographics(prev => ({ ...prev, symptomDate: e.target.value }))}
                      className="w-full rounded-lg border-slate-300 h-11 px-3 border"
                    />
                    <span className="text-xs text-slate-500">
                      Phân loại: <span className={`font-bold ${demographics.isAcute ? 'text-danger' : 'text-warning'}`}>{demographics.isAcute ? 'CẤP TÍNH (<3 tuần)' : 'MÃN TÍNH (>3 tuần)'}</span>
                    </span>
                  </label>
                </div>
              </section>

              {/* 0.1 Symptoms Checklist */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                    Triệu chứng
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'fever', label: 'Sốt' },
                    { key: 'sinusTract', label: 'Đường rò' },
                    { key: 'erythema', label: 'Tấy đỏ' },
                    { key: 'pain', label: 'Đau' },
                    { key: 'swelling', label: 'Sưng nề' },
                    { key: 'drainage', label: 'Chảy dịch' },
                    { key: 'purulence', label: 'Có mủ' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={clinical.symptoms?.[item.key as keyof typeof clinical.symptoms] || false}
                        onChange={() => setClinical(prev => ({
                          ...prev,
                          symptoms: {
                            ...prev.symptoms,
                            [item.key]: !prev.symptoms[item.key as keyof typeof clinical.symptoms]
                          }
                        }))}
                        className="w-5 h-5 rounded border-slate-300 accent-primary"
                      />
                      <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* 1. Major Criteria REMOVED */}

              {/* 2. Diagnostic Imaging */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                    Chuẩn đoán hình ảnh
                  </h3>
                </div>
                <div className="p-6 flex flex-col gap-6">
                  {/* Description */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Mô tả hình ảnh</label>
                    <textarea
                      className="w-full rounded-lg border-slate-200 min-h-[100px] p-3 text-sm focus:ring-primary focus:border-primary"
                      placeholder="Nhập mô tả chi tiết về kết quả chẩn đoán hình ảnh..."
                      value={clinical.imaging?.description || ''}
                      onChange={(e) => setClinical(prev => ({
                        ...prev,
                        imaging: { ...prev.imaging, description: e.target.value }
                      }))}
                    ></textarea>
                  </div>

                  {/* Image Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Hình ảnh đính kèm</label>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {clinical.imaging?.images.map((img) => (
                        <div key={img.id} className="relative group border border-slate-200 rounded-lg overflow-hidden bg-slate-50 aspect-square">
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-white text-xs truncate">
                            <span className="font-bold block">{img.type}</span>
                            <span className="opacity-80 text-[10px]">{img.name}</span>
                          </div>
                          <button
                            onClick={() => setClinical(prev => ({
                              ...prev,
                              imaging: {
                                ...prev.imaging,
                                images: prev.imaging.images.filter(i => i.id !== img.id)
                              }
                            }))}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                      ))}

                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors aspect-square">
                        <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">add_photo_alternate</span>
                        <span className="text-xs text-slate-500 font-medium">Thêm ảnh mới</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const type = prompt('Chọn loại hình ảnh (X-quang, CT, Siêu âm):', 'X-quang');
                              if (type) {
                                const validTypes = ['X-quang', 'CT', 'Siêu âm'];
                                const selectedType = validTypes.includes(type) ? type as any : 'Other';
                                const newImage = {
                                  id: Math.random().toString(36).substr(2, 9),
                                  url: URL.createObjectURL(file), // Note: Using ObjectURL for demo
                                  type: selectedType,
                                  name: file.name
                                };
                                setClinical(prev => ({
                                  ...prev,
                                  imaging: {
                                    ...prev.imaging,
                                    images: [...prev.imaging.images, newImage]
                                  }
                                }));
                              }
                              e.target.value = ''; // Reset input
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </section>



              {/* 3. Blood Tests */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                    Xét nghiệm máu
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-700">

                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 border-r border-slate-200">Tên xét nghiệm</th>
                        <th className="px-4 py-3 border-r border-slate-200 w-32">Kết quả</th>
                        <th className="px-4 py-3 border-r border-slate-200 w-32">Chỉ số BT</th>
                        <th className="px-4 py-3">Đơn vị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {clinical.bloodTests?.map((test, index) => (
                        <tr key={test.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2 font-medium text-slate-900 border-r border-slate-200">{test.name}</td>
                          <td className="px-4 py-2 border-r border-slate-200 p-0">
                            <input
                              type="text"
                              value={test.result}
                              onChange={(e) => {
                                const newTests = [...(clinical.bloodTests || [])];
                                newTests[index].result = e.target.value;
                                setClinical(prev => ({ ...prev, bloodTests: newTests }));
                              }}
                              className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-inset focus:ring-2 focus:ring-primary outline-none"
                            />
                          </td>
                          <td className="px-4 py-2 border-r border-slate-200 p-0">
                            <input
                              type="text"
                              value={test.normalRange}
                              onChange={(e) => {
                                const newTests = [...(clinical.bloodTests || [])];
                                newTests[index].normalRange = e.target.value;
                                setClinical(prev => ({ ...prev, bloodTests: newTests }));
                              }}
                              className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-inset focus:ring-2 focus:ring-primary outline-none"
                            />
                          </td>
                          <td className="px-4 py-2 text-slate-500 bg-slate-50/30">{test.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>


              {/* 4. Fluid Analysis */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">4</span>
                    Xét nghiệm dịch
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-slate-700">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 border-r border-slate-200">Tên xét nghiệm</th>
                        <th className="px-4 py-3 border-r border-slate-200 w-32">Kết quả</th>
                        <th className="px-4 py-3 border-r border-slate-200 w-32">Chỉ số BT</th>
                        <th className="px-4 py-3">Đơn vị</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {clinical.fluidAnalysis?.map((test, index) => (
                        <tr key={test.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2 font-medium text-slate-900 border-r border-slate-200">{test.name}</td>
                          <td className="px-4 py-2 border-r border-slate-200 p-0">
                            {test.name === 'Nhuộm Gram' ? (
                              <div className="flex flex-wrap gap-1 p-2">
                                {['1+', '2+', '3+', '4+'].map((opt) => (
                                  <label key={opt} className="inline-flex items-center gap-1 cursor-pointer bg-slate-100 px-2 py-1 rounded border border-slate-200 hover:bg-white transition-colors">
                                    <input
                                      type="checkbox"
                                      checked={test.result.includes(opt)}
                                      onChange={(e) => {
                                        const current = test.result ? test.result.split(', ').filter(Boolean) : [];
                                        let newResult;
                                        if (e.target.checked) {
                                          newResult = [...current, opt].join(', ');
                                        } else {
                                          newResult = current.filter(x => x !== opt).join(', ');
                                        }
                                        const newTests = [...(clinical.fluidAnalysis || [])];
                                        newTests[index].result = newResult;
                                        setClinical(prev => ({ ...prev, fluidAnalysis: newTests }));
                                      }}
                                      className="w-3 h-3 accent-primary rounded-sm"
                                    />
                                    <span className="text-xs font-medium">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={test.result}
                                onChange={(e) => {
                                  const newTests = [...(clinical.fluidAnalysis || [])];
                                  newTests[index].result = e.target.value;
                                  setClinical(prev => ({ ...prev, fluidAnalysis: newTests }));
                                }}
                                className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-inset focus:ring-2 focus:ring-primary outline-none"
                              />
                            )}
                          </td>
                          <td className="px-4 py-2 border-r border-slate-200 p-0">
                            <input
                              type="text"
                              value={test.normalRange}
                              onChange={(e) => {
                                const newTests = [...(clinical.fluidAnalysis || [])];
                                newTests[index].normalRange = e.target.value;
                                setClinical(prev => ({ ...prev, fluidAnalysis: newTests }));
                              }}
                              className="w-full h-full px-4 py-2 border-none bg-transparent focus:ring-inset focus:ring-2 focus:ring-primary outline-none"
                            />
                          </td>
                          <td className="px-4 py-2 text-slate-500 bg-slate-50/30">{test.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 5. Fluid Aspiration */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">5</span>
                    Chọc hút dịch khớp
                  </h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Bạch cầu dịch khớp</label>
                    <div className="relative">
                      <input type="number" value={clinical.synovial.wbc} onChange={(e) => setClinical(p => ({ ...p, synovial: { ...p.synovial, wbc: parseInt(e.target.value) } }))} className="w-full rounded-lg border-slate-200 text-slate-900 font-mono text-lg py-2.5 pl-3 pr-12 border focus:ring-primary focus:border-primary shadow-sm" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">cells/µL</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">% Bạch cầu đa nhân</label>
                    <div className="relative">
                      <input type="number" value={clinical.synovial.pmn} onChange={(e) => setClinical(p => ({ ...p, synovial: { ...p.synovial, pmn: parseInt(e.target.value) } }))} className="w-full rounded-lg border-slate-200 text-slate-900 font-mono text-lg py-2.5 pl-3 pr-12 border focus:ring-primary focus:border-primary shadow-sm" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">%</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Leukocyte Esterase</label>
                    <select value={clinical.synovial.leukocyteEsterase} onChange={(e) => setClinical(p => ({ ...p, synovial: { ...p.synovial, leukocyteEsterase: e.target.value as any } }))} className="w-full rounded-lg border-slate-200 text-slate-900 text-base py-2.5 border bg-white">
                      <option>Negative</option>
                      <option>1+</option>
                      <option>2+</option>
                      <option>3+</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: AI DIAGNOSIS */}
            <div className="lg:col-span-5 xl:col-span-4 h-full relative">
              <div className="sticky top-6 flex flex-col gap-6">

                {/* Main AI Card */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-slate-900 font-bold text-lg">Công cụ chẩn đoán AI</h3>
                        <p className="text-slate-500 text-xs">Dựa trên hướng dẫn ICM 2018</p>
                      </div>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                    </div>

                    {/* Gauge */}
                    <div className="flex flex-col items-center justify-center py-4 relative">
                      <div className="relative h-48 w-48">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                          <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
                          <path
                            className={`${getStatusColor(clinical.diagnosis.status)} transition-all duration-1000 ease-out`}
                            strokeDasharray={`${clinical.diagnosis.probability}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="3.5"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter">{Math.round(clinical.diagnosis.probability)}%</span>
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">Xác suất</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col items-center gap-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-opacity-10 ${clinical.diagnosis.status === 'Infected' ? 'bg-red-500 border-red-200' : 'bg-green-500 border-green-200'}`}>
                          <span className={`text-sm font-bold ${getStatusColor(clinical.diagnosis.status)}`}>{getStatusTextDetailed(clinical.diagnosis.status)}</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                          <span className="material-symbols-outlined text-[14px]">timelapse</span>
                          {demographics.isAcute ? 'Nhiễm trùng cấp tính (< 3 tuần)' : 'Nhiễm trùng mãn tính (> 3 tuần)'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RAG Reasoning Box */}
                  <div className="bg-slate-50 p-6 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-primary text-base">psychology</span>
                      Lập luận của AI
                    </h4>
                    <div className="space-y-4">
                      {clinical.diagnosis.reasoning.map((text, idx) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className="mt-1 min-w-4 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
                        </div>
                      ))}
                      {clinical.diagnosis.reasoning.length === 0 && <p className="text-sm text-slate-400 italic">Chưa có tiêu chuẩn đáng kể nào.</p>}
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-200">
                      <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                        Xem tham chiếu Hướng dẫn ICM 2018
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};