import Link from 'next/link';
import { Button } from '../../../components/ui/button';

type CheckoutActionsProps = {
  canPay: boolean;
  cancelling: boolean;
  isExpired: boolean;
  isPaid: boolean;
  paying: boolean;
  reservationExists: boolean;
  onCancel: () => void;
  onOpenPayment: () => void;
};

export function CheckoutActions({
  canPay,
  cancelling,
  isExpired,
  isPaid,
  paying,
  reservationExists,
  onCancel,
  onOpenPayment,
}: CheckoutActionsProps) {
  return (
    <>
      <div className="checkout-actions mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-center">
        <Button
          className="w-full shadow-lg shadow-indigo-600/15 sm:w-auto"
          disabled={!canPay}
          type="button"
          variant="primary"
          onClick={onOpenPayment}
        >
          {paying ? 'Đang xử lý...' : isPaid ? 'Đã thanh toán' : 'Thanh toán giả lập'}
        </Button>

        <Button
          className="w-full sm:w-auto"
          disabled={!reservationExists || cancelling || isExpired || isPaid}
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          {cancelling ? 'Đang hủy...' : 'Hủy giữ chỗ'}
        </Button>
      </div>

      <div className="mt-6 text-center">
        <Link
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 transition-colors hover:text-white"
          href="/"
        >
          Quay lại trang đặt vé
        </Link>
      </div>
    </>
  );
}
