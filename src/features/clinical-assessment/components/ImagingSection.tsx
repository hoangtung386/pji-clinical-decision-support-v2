import React, { useState, useCallback, useEffect } from 'react';
import { usePatient } from '../../../store/PatientContext';
import { SectionCard } from '../../../components/common/SectionCard';
import { ImageTypeModal } from '../../../components/common/ImageTypeModal';
import { ImageType } from '../../../lib/enums/status';
import { generateId } from '../../../lib/utils/idGenerator';

export const ImagingSection: React.FC = () => {
  const { clinical, setClinical } = usePatient();
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [objectUrls]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPendingFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleConfirmType = useCallback(
    (type: ImageType) => {
      if (!pendingFile) return;
      const url = URL.createObjectURL(pendingFile);
      setObjectUrls((prev) => [...prev, url]);

      setClinical((prev) => ({
        ...prev,
        imaging: {
          ...prev.imaging,
          images: [
            ...prev.imaging.images,
            { id: generateId('img'), url, type, name: pendingFile.name },
          ],
        },
      }));
      setPendingFile(null);
    },
    [pendingFile, setClinical],
  );

  const removeImage = (index: number) => {
    setClinical((prev) => ({
      ...prev,
      imaging: {
        ...prev.imaging,
        images: prev.imaging.images.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <SectionCard icon="image" title="Chuẩn đoán hình ảnh" numberBadge={4}>
      <div className="p-6 flex flex-col gap-6">
        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Mô tả hình ảnh</label>
          <textarea
            className="w-full rounded-lg border-slate-200 min-h-[100px] p-3 text-sm focus:ring-primary focus:border-primary"
            placeholder="Nhập mô tả chi tiết về kết quả chẩn đoán hình ảnh..."
            value={clinical.imaging?.description || ''}
            onChange={(e) =>
              setClinical((prev) => ({
                ...prev,
                imaging: { ...prev.imaging, description: e.target.value },
              }))
            }
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Hình ảnh đính kèm</label>
          <div className="grid grid-cols-4 gap-4">
            {clinical.imaging?.images?.map((image, index) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-32 object-cover rounded-lg border border-slate-200"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                  <span className="text-white text-xs px-2 py-1 bg-black/60 rounded">
                    {image.type}
                  </span>
                </div>
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            ))}

            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors aspect-square">
              <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">
                add_photo_alternate
              </span>
              <span className="text-xs text-slate-500 font-medium">Thêm ảnh mới</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Modal replaces prompt() */}
      {pendingFile && (
        <ImageTypeModal
          onConfirm={handleConfirmType}
          onCancel={() => setPendingFile(null)}
        />
      )}
    </SectionCard>
  );
};
