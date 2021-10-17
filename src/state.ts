import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

export class StateSubject<T> extends BehaviorSubject<T> {
  constructor(init: T) {
    super(init);
  }

  getState() {
    return this.getValue();
  }

  setState(setter: Partial<T> | ((update: T) => T)) {
    const curr = this.getState();
    const nextState = typeof setter === 'function' ? setter(curr) : { ...curr, ...setter };

    this.next(nextState);
  }

  select<V>(fn: (state: T) => V) {
    return this.pipe(map(fn), distinctUntilChanged());
  }
}
