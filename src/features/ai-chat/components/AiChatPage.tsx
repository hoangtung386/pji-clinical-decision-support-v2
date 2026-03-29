import React, { useEffect, useRef, useState } from 'react';
import { api, isAuthenticated } from '../../../lib/utils/apiClient';
import { usePatient } from '../../../store/PatientContext';
import { getPatientId } from '../../../hooks/useAutoSave';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: Date;
}

interface ChatApiResponse {
  reply: string;
  sources: string[];
  context_used: boolean;
}

export const AiChatPage: React.FC = () => {
  const { demographics, clinical } = usePatient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const patientId = getPatientId();
  const hasCase = Boolean(patientId && demographics.mrn);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcome: Message = {
        role: 'assistant',
        content: hasCase
          ? `Xin chào! Tôi là trợ lý AI chuyên về **Nhiễm trùng khớp nhân tạo (PJI)**.\n\nHiện tôi đang xem ca bệnh **#${demographics.mrn} - ${demographics.name || '(Chưa nhập)'}**.\n\nBạn có thể hỏi tôi về:\n- 🔬 Chẩn đoán theo ICM 2018\n- 💊 Phác đồ điều trị kháng sinh\n- 📊 Phân tích kết quả xét nghiệm\n- 📋 Tóm tắt ca bệnh`
          : 'Xin chào! Vui lòng chọn hoặc tạo ca bệnh trước khi trao đổi.',
        timestamp: new Date(),
      };
      setMessages([welcome]);
    }
  }, [hasCase, demographics.mrn, demographics.name]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    if (!isAuthenticated()) return;

    const userMsg: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await api.post<ChatApiResponse>('/chat/', {
        message: userMsg.content,
        patient_id: patientId,
        history,
      });

      const assistantMsg: Message = {
        role: 'assistant',
        content: res.reply,
        sources: res.sources,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'Chẩn đoán ca bệnh này theo ICM 2018',
    'Khuyến nghị phác đồ điều trị',
    'Phân tích kết quả xét nghiệm',
    'Tóm tắt ca bệnh hiện tại',
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-purple-600">smart_toy</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Trợ lý AI - Tư vấn ca bệnh</h1>
            <p className="text-xs text-slate-500">
              {hasCase
                ? `Đang xem: #${demographics.mrn} - ${demographics.name || '(Chưa nhập)'}`
                : 'Chưa chọn ca bệnh'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {clinical.diagnosis.status !== 'Inconclusive' && (
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                clinical.diagnosis.status === 'Infected'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {clinical.diagnosis.status === 'Infected' ? 'Nhiễm trùng' : 'Không nhiễm trùng'}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
            RAG-Ready
          </span>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-md'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-purple-500 text-[16px]">
                    smart_toy
                  </span>
                  <span className="text-xs font-bold text-purple-600">AI Assistant</span>
                </div>
              )}
              <div
                className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' ? '' : 'prose prose-sm max-w-none'
                }`}
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>'),
                }}
              />
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nguồn tham khảo</p>
                  {msg.sources.map((src, i) => (
                    <span
                      key={i}
                      className="inline-block text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mr-1 mb-1"
                    >
                      📚 {src}
                    </span>
                  ))}
                </div>
              )}
              <p
                className={`text-[10px] mt-1.5 ${
                  msg.role === 'user' ? 'text-white/60' : 'text-slate-400'
                }`}
              >
                {msg.timestamp.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500 text-[16px] animate-spin">
                  progress_activity
                </span>
                <span className="text-sm text-slate-500">Đang suy nghĩ...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && hasCase && (
        <div className="px-6 py-3 bg-white border-t border-slate-100 flex flex-wrap gap-2">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                setInput(q);
                setTimeout(() => sendMessage(), 0);
              }}
              className="text-xs bg-slate-100 hover:bg-primary/10 hover:text-primary text-slate-600 px-3 py-1.5 rounded-full border border-slate-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-slate-200 p-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              hasCase ? 'Hỏi về ca bệnh... (Enter để gửi)' : 'Vui lòng chọn ca bệnh trước...'
            }
            disabled={!hasCase || loading}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading || !hasCase}
            className="h-11 w-11 bg-primary text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-40 flex items-center justify-center flex-shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
