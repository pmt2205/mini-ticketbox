import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import { formatCurrency } from '../../../lib/format';
import type { AuthUser } from '../../../types/auth';
import type { Reservation, TicketType } from '../../../types/ticket';
import type { PaymentMode, PaymentResult } from '../types';

type PaymentModalProps = {
  authUser: AuthUser | null;
  open: boolean;
  paying: boolean;
  paymentResult: PaymentResult;
  reservation: Reservation | null;
  selectedTicketType: TicketType | null;
  totalAmount: number;
  onClose: () => void;
  onSimulatePayment: (mode: PaymentMode) => void;
};

export function PaymentModal({
  authUser,
  open,
  paying,
  paymentResult,
  reservation,
  selectedTicketType,
  totalAmount,
  onClose,
  onSimulatePayment,
}: PaymentModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12141c]/95 p-6 text-white shadow-2xl backdrop-blur-md">
        {!paymentResult ? (
          <PaymentPrompt
            paying={paying}
            reservation={reservation}
            selectedTicketType={selectedTicketType}
            totalAmount={totalAmount}
            onSimulatePayment={onSimulatePayment}
          />
        ) : paymentResult.mode === 'success' ? (
          <PaymentSuccess authUser={authUser} paymentResult={paymentResult} reservation={reservation} />
        ) : (
          <PaymentFailure />
        )}

        <button
          className="mt-5 w-full text-center text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
          disabled={paying}
          type="button"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
}

function PaymentPrompt({
  paying,
  reservation,
  selectedTicketType,
  totalAmount,
  onSimulatePayment,
}: {
  paying: boolean;
  reservation: Reservation | null;
  selectedTicketType: TicketType | null;
  totalAmount: number;
  onSimulatePayment: (mode: PaymentMode) => void;
}) {
  return (
    <>
      <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
        Cổng thanh toán giả lập
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight">Xác nhận thanh toán?</h2>
      <p className="mt-3 text-sm font-medium leading-relaxed text-slate-400">
        Chọn thanh toán để mô phỏng giao dịch thành công hoặc lỗi để mô phỏng giao dịch thất bại.
      </p>

      <div className="relative my-5 overflow-hidden rounded-xl border border-dashed border-white/10 bg-slate-950/50 p-4">
        <SummaryRow label="Sự kiện" value="Concert Night 2026" />
        <SummaryRow label="Hạng vé" value={selectedTicketType?.name ?? '-'} />
        <SummaryRow label="Ghế đã chọn" value={reservation?.seats?.map((seat) => seat.code).join(', ') ?? '-'} />
        <div className="my-3 border-t border-dashed border-white/10" />
        <div className="flex items-end justify-between gap-4 text-sm">
          <span className="font-semibold text-slate-400">Tổng thanh toán</span>
          <span className="text-base font-black text-indigo-400">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-emerald-600 to-teal-600 px-5 text-sm font-bold tracking-wide text-white shadow-lg shadow-emerald-600/15 transition-all duration-200 hover:scale-[1.02] hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={paying}
          type="button"
          onClick={() => onSimulatePayment('success')}
        >
          Thanh toán
        </button>
        <Button
          disabled={paying}
          type="button"
          variant="secondary"
          onClick={() => onSimulatePayment('failure')}
        >
          Hủy / Lỗi
        </Button>
      </div>
    </>
  );
}

function PaymentSuccess({
  authUser,
  paymentResult,
  reservation,
}: {
  authUser: AuthUser | null;
  paymentResult: Exclude<PaymentResult, null>;
  reservation: Reservation | null;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
        <span className="text-sm font-black">OK</span>
      </div>
      <h3 className="mt-4 text-xl font-black tracking-tight text-white">Thanh toán thành công!</h3>
      <p className="mt-2 max-w-[280px] text-center text-xs leading-relaxed text-slate-400">
        Giao dịch đã hoàn tất. Cảm ơn bạn đã đặt vé Concert Night 2026.
      </p>

      <div className="mt-5 w-full rounded-xl border border-white/5 bg-slate-950/40 p-4 text-xs">
        <SummaryRow label="Người đặt" value={reservation?.customerName ?? 'Khách'} />
        <SummaryRow label="Số điện thoại" value={reservation?.customerPhone ?? '-'} />
        <SummaryRow label="Mã đơn hàng" value={paymentResult.orderId ?? '-'} />
      </div>

      {authUser ? (
        <Link
          className="mt-6 flex min-h-11 w-full items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-4 text-xs font-bold text-white shadow-md shadow-indigo-600/10 transition hover:from-indigo-500 hover:to-purple-500"
          href="/history"
        >
          Xem lịch sử mua vé
        </Link>
      ) : null}
    </div>
  );
}

function PaymentFailure() {
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.35)]">
        <span className="text-sm font-black">X</span>
      </div>
      <h3 className="mt-4 text-xl font-black tracking-tight text-white">Thanh toán thất bại</h3>
      <p className="mt-2 max-w-[280px] text-center text-xs leading-relaxed text-rose-300">
        Giao dịch không thành công theo lựa chọn thử nghiệm. Vé vẫn được giữ đến khi hết giờ.
      </p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2.5 flex justify-between gap-4 text-xs first:mt-0">
      <span className="font-semibold text-slate-400">{label}</span>
      <span className="max-w-48 truncate text-right font-black text-white">{value}</span>
    </div>
  );
}
