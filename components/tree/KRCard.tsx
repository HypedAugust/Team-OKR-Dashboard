'use client';

import { Trash2, X } from 'lucide-react';
import { useState, useTransition } from 'react';
import { deleteKR, updateKR } from '@/app/actions';
import { ConfidenceLight } from '@/components/ui/ConfidenceLight';
import { OwnerChip } from '@/components/ui/OwnerChip';
import { ProgressCircle } from '@/components/ui/ProgressCircle';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { useToast } from '@/components/ui/Toast';
import { ConfirmDialog } from '@/components/modal/ConfirmDialog';
import {
  formatDate,
  krDisplayStatus,
  progressColor,
} from '@/lib/calc';
import { CONFIDENCE_LABEL } from '@/lib/constants';
import type { Confidence, KR, KRType, Member } from '@/lib/types';

const stripeColor = {
  done: 'bg-status-success',
  risk: 'bg-status-danger',
  normal: 'bg-status-idle',
  idle: 'bg-status-idle',
} as const;

export function KRCard({
  qid,
  kr,
  oid,
  members,
  readOnly,
}: {
  qid: string;
  kr: KR;
  oid: string;
  members: Member[];
  readOnly: boolean;
}) {
  const status = krDisplayStatus(kr);
  const stripe = stripeColor[status];
  const color = progressColor(kr.progress, kr.updated_at !== null);

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!editing) {
    return (
      <>
        <div
          className={`kr-card relative bg-bg-surface1 rounded-2xl pl-6 pr-5 py-5 border border-border-subtle min-h-[460px] flex flex-col ${
            readOnly ? 'opacity-90' : 'hover:border-border-default cursor-pointer transition-colors'
          }`}
          onClick={() => {
            if (!readOnly) setEditing(true);
          }}
        >
          <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-2xl ${stripe}`} />

          {/* 헤더: 유형 + 삭제 */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <TypeBadge type={kr.type} />
              <span className="text-caption text-text-muted num">{kr.id}</span>
            </div>
            {!readOnly && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                className="no-print delete-button text-text-muted hover:text-status-danger transition-colors"
                aria-label="KR 삭제"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {/* 목표 텍스트 */}
          <div className="text-heading-md text-text-primary mb-5 break-words leading-snug min-h-[3.25rem]">
            {kr.target_text || <span className="text-text-muted">목표를 입력하세요</span>}
          </div>

          {/* 화면용: 중앙 큰 원형 게이지 */}
          <div className="print:hidden flex flex-col items-center my-6">
            <ProgressCircle
              value={kr.progress}
              color={color}
              size={180}
              strokeWidth={14}
              centerContent={
                <div className="flex flex-col items-center gap-1">
                  <span className="text-text-primary num leading-none font-extrabold" style={{ fontSize: '44px' }}>
                    {Math.round(kr.progress * 100)}%
                  </span>
                  {kr.target_value !== null && kr.target_value > 0 ? (
                    <span className="text-body-sm text-text-tertiary num">
                      {kr.current_value} / {kr.target_value}
                    </span>
                  ) : (
                    <span className="text-caption text-text-muted">수동</span>
                  )}
                </div>
              }
            />
            {kr.current_detail && (
              <div className="mt-3 text-body-sm text-text-tertiary text-center break-words max-w-full px-2">
                {kr.current_detail}
              </div>
            )}
          </div>

          {/* PDF용: 가로 진척도 바 + 큰 % */}
          <div className="hidden print:block my-2">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-text-primary num font-extrabold" style={{ fontSize: '22px', lineHeight: '24px' }}>
                {Math.round(kr.progress * 100)}%
              </span>
              {kr.target_value !== null && kr.target_value > 0 ? (
                <span className="text-text-tertiary num" style={{ fontSize: '11px' }}>
                  {kr.current_value} / {kr.target_value}
                </span>
              ) : (
                <span className="text-text-muted" style={{ fontSize: '11px' }}>수동</span>
              )}
            </div>
            <div
              className="w-full rounded-full overflow-hidden"
              style={{ height: '8px', background: '#E5E7EB' }}
            >
              <div
                className={
                  color === 'success' ? 'bg-status-success' :
                  color === 'warning' ? 'bg-status-warning' :
                  color === 'danger' ? 'bg-status-danger' :
                  'bg-status-idle'
                }
                style={{
                  width: `${Math.min(100, Math.round(kr.progress * 100))}%`,
                  height: '100%',
                }}
              />
            </div>
            {kr.current_detail && (
              <div className="text-text-tertiary break-words mt-1.5" style={{ fontSize: '11px', lineHeight: '14px' }}>
                {kr.current_detail}
              </div>
            )}
          </div>

          {/* 신뢰도 + Owner + 갱신/상태 (하단 고정) */}
          <div className="space-y-3 pt-3 border-t border-border-subtle mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-label-md text-text-tertiary">신뢰도</span>
              <ConfidenceLight value={kr.confidence} />
            </div>

            {kr.owners.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {kr.owners.map((oid) => {
                  const m = members.find((mm) => mm.id === oid);
                  return <OwnerChip key={oid} name={m?.name ?? oid} />;
                })}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-caption text-text-muted">
                갱신 <span className="num">{formatDate(kr.updated_at)}</span>
              </span>
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        {confirmDelete && (
          <ConfirmDialog
            title="KR 삭제"
            description={`'${kr.id}'를 정말 삭제하시겠습니까?`}
            confirmLabel="삭제"
            variant="danger"
            onCancel={() => setConfirmDelete(false)}
            onConfirm={async () => {
              await deleteKR(qid, oid, kr.id);
              setConfirmDelete(false);
            }}
          />
        )}
      </>
    );
  }

  return (
    <KREditForm
      qid={qid}
      kr={kr}
      members={members}
      onClose={() => setEditing(false)}
    />
  );
}

function KREditForm({
  qid,
  kr,
  members,
  onClose,
}: {
  qid: string;
  kr: KR;
  members: Member[];
  onClose: () => void;
}) {
  const [type, setType] = useState<KRType>(kr.type);
  const [targetText, setTargetText] = useState(kr.target_text);
  const [targetValueStr, setTargetValueStr] = useState(
    kr.target_value !== null ? String(kr.target_value) : ''
  );
  const [currentValue, setCurrentValue] = useState(kr.current_value);
  const [currentDetail, setCurrentDetail] = useState(kr.current_detail);
  const [progressPct, setProgressPct] = useState(Math.round(kr.progress * 100));
  const [confidence, setConfidence] = useState<Confidence>(kr.confidence);
  const [owners, setOwners] = useState<string[]>(kr.owners);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  const targetValueNum = targetValueStr === '' ? null : Number(targetValueStr);
  const hasNumericTarget = targetValueNum !== null && !isNaN(targetValueNum) && targetValueNum > 0;
  const autoProgress = hasNumericTarget
    ? Math.round((Number(currentValue) / targetValueNum!) * 100)
    : null;

  function toggleOwner(mid: string) {
    setOwners((prev) =>
      prev.includes(mid) ? prev.filter((m) => m !== mid) : [...prev, mid]
    );
  }

  function save() {
    startTransition(async () => {
      const r = await updateKR(qid, kr.id, {
        type,
        target_text: targetText,
        target_value: targetValueNum,
        current_value: Number(currentValue) || 0,
        current_detail: currentDetail,
        progress: hasNumericTarget
          ? Math.max(0, Math.min(2, Number(currentValue) / targetValueNum!))
          : Math.max(0, Math.min(2, progressPct / 100)),
        confidence,
        owners,
      });
      if (r.ok) {
        toast.show('저장 완료');
        onClose();
      } else {
        toast.show(r.error, 'error');
      }
    });
  }

  return (
    <div className="kr-card bg-bg-surface2 rounded-xl p-5 border border-border-strong">
      <div className="flex items-center justify-between mb-4">
        <span className="text-caption text-text-muted num">{kr.id}</span>
        <button onClick={onClose} className="text-text-tertiary hover:text-text-primary">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <Field label="유형">
          <div className="flex gap-2">
            {(['Commit', 'Aspire'] as KRType[]).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-md text-label-sm border transition-colors ${
                  type === t
                    ? t === 'Commit'
                      ? 'bg-type-commit-soft border-type-commit text-type-commit'
                      : 'bg-type-aspire-soft border-type-aspire text-type-aspire'
                    : 'bg-bg-surface3 border-border-default text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <Field label="목표 설명">
          <input
            type="text"
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            placeholder="예) 박람회를 통한 고객과의 후속 논의 3건"
            className="w-full px-3 py-2 bg-bg-surface3 border border-border-default rounded-md text-text-primary text-body-md focus:outline-none focus:border-border-strong"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="목표값 (숫자)">
            <input
              type="number"
              value={targetValueStr}
              onChange={(e) => setTargetValueStr(e.target.value)}
              placeholder="예) 3 (비워두면 수동)"
              min={0}
              className="w-full px-3 py-2 bg-bg-surface3 border border-border-default rounded-md text-text-primary text-body-md num focus:outline-none focus:border-border-strong"
            />
          </Field>
          <Field label="현재값 (숫자)">
            <input
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(Number(e.target.value))}
              min={0}
              className="w-full px-3 py-2 bg-bg-surface3 border border-border-default rounded-md text-text-primary text-body-md num focus:outline-none focus:border-border-strong"
            />
          </Field>
        </div>

        <Field label="현재값 상세 (메모)">
          <input
            type="text"
            value={currentDetail}
            onChange={(e) => setCurrentDetail(e.target.value)}
            placeholder="예) IBK-다날, SBVA"
            className="w-full px-3 py-2 bg-bg-surface3 border border-border-default rounded-md text-text-primary text-body-md focus:outline-none focus:border-border-strong"
          />
        </Field>

        <Field label="진척도">
          {hasNumericTarget ? (
            <div className="flex items-center gap-3 px-3 py-2 bg-bg-surface3 border border-border-default rounded-md">
              <span className="text-body-lg text-text-primary num font-semibold">
                {autoProgress}%
              </span>
              <span className="text-caption text-text-tertiary">
                자동 계산 ({currentValue} / {targetValueNum})
              </span>
            </div>
          ) : (
            <div>
              <input
                type="number"
                value={progressPct}
                onChange={(e) => setProgressPct(Number(e.target.value))}
                min={0}
                max={200}
                placeholder="0-100"
                className="w-full px-3 py-2 bg-bg-surface3 border border-border-default rounded-md text-text-primary text-body-md num focus:outline-none focus:border-border-strong"
              />
              <p className="text-caption text-text-tertiary mt-1">
                목표값이 비어있어 수동 입력합니다.
              </p>
            </div>
          )}
        </Field>

        <Field label="신뢰도">
          <div className="flex gap-2">
            {(['high', 'mid', 'low'] as Confidence[]).map((c) => (
              <button
                key={c}
                onClick={() => setConfidence(c)}
                className={`px-3 py-1.5 rounded-md text-label-sm border transition-colors ${
                  confidence === c
                    ? c === 'high'
                      ? 'bg-status-success-soft border-status-success text-status-success'
                      : c === 'mid'
                      ? 'bg-status-warning-soft border-status-warning text-status-warning'
                      : 'bg-status-danger-soft border-status-danger text-status-danger'
                    : 'bg-bg-surface3 border-border-default text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {CONFIDENCE_LABEL[c]}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Owner">
          {members.length === 0 ? (
            <p className="text-body-sm text-text-muted">멤버를 먼저 추가하세요.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleOwner(m.id)}
                  className={`px-3 py-1 rounded-full text-body-sm border transition-colors ${
                    owners.includes(m.id)
                      ? 'bg-text-primary text-bg-base border-text-primary'
                      : 'bg-bg-surface3 border-border-default text-text-secondary hover:border-border-strong'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </Field>
      </div>

      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-border-subtle">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-full bg-bg-surface3 text-text-secondary text-body-md hover:bg-bg-surface2"
        >
          취소
        </button>
        <button
          onClick={save}
          disabled={pending}
          className="px-4 py-2 rounded-full bg-text-primary text-bg-base text-body-md font-medium hover:bg-text-secondary disabled:opacity-50"
        >
          {pending ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-label-md text-text-tertiary mb-1.5">{label}</span>
      {children}
    </label>
  );
}
