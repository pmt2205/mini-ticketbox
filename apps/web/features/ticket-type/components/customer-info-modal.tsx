import { Button } from '../../../components/ui/button';
import { TextInput } from '../../../components/ui/text-input';
import { formatCurrency } from '../../../lib/format';
import type { AuthUser } from '../../../types/auth';
import type { CustomerForm } from '../types';
import type { FormEvent } from 'react';

type CustomerInfoModalProps = {
  authUser: AuthUser | null;
  customerForm: CustomerForm;
  holding: boolean;
  open: boolean;
  selectedSeatCount: number;
  totalAmount: number;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateCustomer: (field: keyof CustomerForm, value: string) => void;
};

export function CustomerInfoModal({
  authUser,
  customerForm,
  holding,
  open,
  selectedSeatCount,
  totalAmount,
  onClose,
  onSubmit,
  onUpdateCustomer,
}: CustomerInfoModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <form
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12141c]/95 p-6 text-white shadow-2xl"
        onSubmit={onSubmit}
      >
        <p className="mb-1.5 text-xs font-extrabold uppercase tracking-widest text-indigo-400">
          Thông tin đặt vé
        </p>
        <h2 className="text-2xl font-black tracking-tight text-white">
          {authUser ? 'Xác nhận thông tin' : 'Nhập thông tin khách'}
        </h2>

        <div className="mt-6 grid gap-5">
          <TextInput
            disabled={Boolean(authUser)}
            label="Họ tên"
            placeholder="Họ và tên khách hàng"
            required
            type="text"
            value={customerForm.name}
            onChange={(event) => onUpdateCustomer('name', event.target.value)}
          />
          <TextInput
            disabled={Boolean(authUser)}
            label="Email"
            placeholder="email@example.com"
            required
            type="email"
            value={customerForm.email}
            onChange={(event) => onUpdateCustomer('email', event.target.value)}
          />
          <TextInput
            label="Số điện thoại"
            placeholder="09xx xxx xxx"
            minLength={8}
            required
            type="tel"
            value={customerForm.phone}
            onChange={(event) => onUpdateCustomer('phone', event.target.value)}
          />
        </div>

        <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm">
          <ModalSummaryRow label="Số lượng ghế" value={`${selectedSeatCount}`} />
          <ModalSummaryRow label="Tạm tính" value={formatCurrency(totalAmount)} highlight />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button disabled={holding} type="submit" variant="primary">
            {holding ? 'Đang giữ...' : 'Tiếp tục thanh toán'}
          </Button>
          <Button disabled={holding} type="button" variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </form>
    </div>
  );
}

function ModalSummaryRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="mt-3.5 flex items-end justify-between gap-3 first:mt-0">
      <span className="font-semibold text-slate-400">{label}</span>
      <strong className={highlight ? 'text-base font-black text-indigo-400' : 'font-extrabold text-white'}>
        {value}
      </strong>
    </div>
  );
}
