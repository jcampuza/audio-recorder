export const delegate = <T extends Event>(selector: string, handler: (e: T) => void) => {
  return (e: T) => {
    const target = e.target as HTMLElement;
    if (target.matches(selector)) {
      handler(e);
    }
  };
};
