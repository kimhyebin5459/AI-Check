interface Props {
  onNumberClick: (num: number) => void;
  leftAction?: 'arrow' | null;
  rightAction: 'arrow' | 'submit';
  onBackspace: () => void;
  onSubmit?: () => void;
  isSubmitEnabled?: boolean;
}

export default function NumberKeypad({
  onNumberClick,
  leftAction = null,
  rightAction,
  onBackspace,
  onSubmit,
  isSubmitEnabled,
}: Props) {
  return (
    <div className="mx-auto mt-auto mb-16 w-full max-w-xs">
      <div className="grid w-full grid-cols-3 gap-x-10 gap-y-9">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div key={num} className="flex items-center justify-center">
            <button
              onClick={() => onNumberClick(num)}
              className="grid h-12 w-full place-items-center text-center text-4xl font-medium"
            >
              {num}
            </button>
          </div>
        ))}

        <div className="flex items-center justify-center">
          {leftAction === 'arrow' && (
            <button onClick={onBackspace} className="grid h-12 w-full place-items-center text-3xl text-gray-400">
              ←
            </button>
          )}
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={() => onNumberClick(0)}
            className="grid h-12 w-full place-items-center text-center text-4xl font-medium"
          >
            0
          </button>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={() => {
              if (rightAction === 'submit' && !isSubmitEnabled) return;
              if (rightAction === 'submit') {
                if (isSubmitEnabled) onSubmit?.();
              } else if (rightAction === 'arrow') {
                onBackspace();
              }
            }}
            className={`grid h-12 w-full place-items-center font-semibold ${
              rightAction === 'arrow'
                ? 'text-3xl text-gray-400'
                : isSubmitEnabled
                  ? 'text-2xl'
                  : 'text-2xl text-gray-300'
            }`}
          >
            {rightAction === 'arrow' ? '←' : '완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
