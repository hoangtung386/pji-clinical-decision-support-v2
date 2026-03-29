import React, { useState } from 'react';
import { ImageType } from '../../lib/enums/status';
import { IMAGE_TYPE_OPTIONS } from '../../lib/constants/labels';

interface ImageTypeModalProps {
  onConfirm: (type: ImageType) => void;
  onCancel: () => void;
}

export const ImageTypeModal: React.FC<ImageTypeModalProps> = ({ onConfirm, onCancel }) => {
  const [selectedType, setSelectedType] = useState<ImageType>(ImageType.X_RAY);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-80">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Chọn loại hình ảnh</h3>
        <div className="space-y-2 mb-6">
          {IMAGE_TYPE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <input
                type="radio"
                name="imageType"
                value={opt.value}
                checked={selectedType === opt.value}
                onChange={() => setSelectedType(opt.value as ImageType)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(selectedType)}
            className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-blue-600"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
