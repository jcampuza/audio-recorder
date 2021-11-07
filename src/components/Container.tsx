import { FunctionalComponent } from 'preact';

export const Container: FunctionalComponent<{ className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`w-full mx-auto max-w-2xl ${className}`}>{children}</div>;
};
