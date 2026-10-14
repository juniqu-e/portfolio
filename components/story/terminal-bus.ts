// 떠 있는 터미널 창을 다른 컴포넌트(히어로 버튼 등)에서 열고 접기 위한 아주 작은 버스.
export const terminalBus: { open: (() => void) | null; close: (() => void) | null } = {
  open: null,
  close: null,
};
