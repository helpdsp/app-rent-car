/**
 * @generated_by_model gemini-2.5-pro
 * @generated_at 2026-11-17T06:05:00Z
 * @agent_roles design-ux-architect + design-ui-designer + engineering-frontend-developer
 * @vision_command start_sprint --sprint 13
 * @sprint_number 13
 * @task_id S13-T07
 */

'use client';

import React from 'react';
import { Icons } from './icons';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Continuar editando',
  variant = 'danger',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const confirmBg =
    variant === 'danger'
      ? 'bg-[#991B1B] hover:bg-[#7F1D1D] text-white'
      : variant === 'warning'
      ? 'bg-[#D97706] hover:bg-[#B45309] text-white'
      : 'bg-[#B5141B] hover:bg-[#8F1015] text-white';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E5DECE] overflow-hidden p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FEE2E2] text-[#991B1B] flex items-center justify-center shrink-0">
            <Icons.Warning size={22} color="#991B1B" />
          </div>
          <div className="flex-1">
            <h3 id="confirm-dialog-title" className="text-lg font-bold text-[#1E1A16]">
              {title}
            </h3>
            <p className="text-sm text-[#665E55] mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#F2ECE1]">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#D5CDBE] bg-white hover:bg-[#F6F2E8] text-[#1E1A16] font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Icons.Back size={16} />
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 ${confirmBg}`}
          >
            <Icons.Trash size={16} />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
