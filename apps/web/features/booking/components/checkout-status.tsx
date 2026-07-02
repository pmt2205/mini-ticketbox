import { StatusPill } from '../../../components/status-pill';

type CheckoutStatusProps = {
  displayStatusText: string;
  errorMessage: string | null;
  isExpired: boolean;
  loading: boolean;
  pageTitle: string;
  paymentMessage: string | null;
  statusTone: 'success' | 'warning' | 'danger' | 'neutral';
};

export function CheckoutStatus({
  displayStatusText,
  errorMessage,
  isExpired,
  loading,
  pageTitle,
  paymentMessage,
  statusTone,
}: CheckoutStatusProps) {
  return (
    <div className="checkout-summary flex flex-col items-center text-center">
      <StatusPill tone={statusTone}>{displayStatusText}</StatusPill>

      <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
        {pageTitle}
      </h1>

      {errorMessage ? <div className="alert alert-danger mt-5 w-full">{errorMessage}</div> : null}
      {paymentMessage ? <div className="alert alert-success mt-5 w-full">{paymentMessage}</div> : null}

      {isExpired && !loading ? (
        <div className="alert alert-danger mt-5 w-full text-center">
          Thời gian giữ chỗ đã kết thúc. Vé đã được hoàn trả lại hệ thống, vui lòng đặt lại vé mới.
        </div>
      ) : null}
    </div>
  );
}
