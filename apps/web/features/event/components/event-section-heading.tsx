type EventSectionHeadingProps = {
  refreshing: boolean;
  onRefresh: () => void;
};

export function EventSectionHeading({ refreshing, onRefresh }: EventSectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">Kho vé</p>
        <h2>Chọn hạng vé của bạn</h2>
      </div>
    </div>
  );
}
